import React, { useEffect, useRef, useState } from 'react'
import TailorLayout from '../../layouts/TailorLayout'
import Card from '../../components/ui/Card'
import PrimaryButton from '../../components/ui/PrimaryButton'
import Input from '../../components/ui/Input'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'

const TailorEnquiries = () => {
  const [params] = useSearchParams()
  const customerId = params.get('customerId')
  const customerName = params.get('customerName') || 'Customer'
  const [allEnquiries, setAllEnquiries] = useState([])
  
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [customPricing, setCustomPricing] = useState({ service: '', price: '' })
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const chatRef = useRef(null)
  const navigate = useNavigate()

  // Get current tailor info
  const [currentTailor, setCurrentTailor] = useState(null)

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
      if (user && user.role === 'tailor') {
        setCurrentTailor(user)
      }
    } catch (error) {
      console.error('Error loading current tailor:', error)
    }
  }, [])

  // Load enquiries for this tailor
  useEffect(() => {
    try {
      const enquiries = JSON.parse(localStorage.getItem('tailorEnquiries') || '[]')
      const tailorId = currentTailor?.phone || currentTailor?.id
      if (tailorId) {
        // Filter enquiries for this specific tailor
        const tailorEnquiries = enquiries.filter(e => 
          (e.tailorId || '').replace(/\D/g, '') === (tailorId || '').replace(/\D/g, '')
        )
        setAllEnquiries(tailorEnquiries.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)))
      }
    } catch (error) {
      console.error('Error loading tailor enquiries:', error)
    }
  }, [currentTailor])

  // Load messages for specific customer conversation
  useEffect(() => {
    if (customerId && currentTailor) {
      try {
        const enquiries = JSON.parse(localStorage.getItem('tailorEnquiries') || '[]')
        const tailorId = currentTailor?.phone || currentTailor?.id
        const enquiry = enquiries.find(e => 
          e.customerId === customerId && 
          (e.tailorId || '').replace(/\D/g, '') === (tailorId || '').replace(/\D/g, '')
        )
        if (enquiry && enquiry.messages && enquiry.messages.length > 0) {
          setMessages(enquiry.messages)
        } else {
          setMessages([])
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      }
    }
  }, [customerId, currentTailor])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    if (!chatInput.trim() || !customerId || !currentTailor) return
    
    const tailorId = currentTailor?.phone || currentTailor?.id
    const newMessage = {
      id: messages.length + 1,
      from: 'tailor',
      text: chatInput.trim(),
      createdAt: new Date()
    }
    
    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    setChatInput('')
    
    // Save to localStorage
    try {
      const enquiries = JSON.parse(localStorage.getItem('tailorEnquiries') || '[]')
      const existingIndex = enquiries.findIndex(e => 
        e.customerId === customerId && 
        (e.tailorId || '').replace(/\D/g, '') === (tailorId || '').replace(/\D/g, '')
      )
      
      const enquiryData = {
        customerId,
        customerName,
        tailorId,
        tailorName: currentTailor.name || currentTailor.fullName || 'Tailor',
        messages: updatedMessages,
        lastUpdated: new Date().toISOString()
      }
      
      if (existingIndex >= 0) {
        enquiries[existingIndex] = enquiryData
      } else {
        enquiries.push(enquiryData)
      }
      
      localStorage.setItem('tailorEnquiries', JSON.stringify(enquiries))
      setAllEnquiries(enquiries.sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)))
    } catch (error) {
      console.error('Error saving enquiry:', error)
    }
  }

  // If no customerId, show list of all enquiries for this tailor
  if (!customerId) {
    return (
      <TailorLayout>
        <div className="max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">My Enquiries</h1>
            <div className="text-neutral-600">View and manage enquiries from customers</div>
          </div>

          {allEnquiries.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-neutral-600 mb-4">No enquiries yet</div>
              <div className="text-sm text-neutral-500">Customers will send enquiries here when they want to contact you.</div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {allEnquiries.map((enquiry) => {
                const lastMessage = enquiry.messages && enquiry.messages.length > 0 
                  ? enquiry.messages[enquiry.messages.length - 1] 
                  : null
                const preview = lastMessage 
                  ? (lastMessage.type === 'voice' ? '🎤 Voice message' : (lastMessage.text || '').substring(0, 100))
                  : 'No messages yet'
                
                return (
                  <Link
                    key={enquiry.customerId}
                    to={`/tailor/enquiries?customerId=${enquiry.customerId}&customerName=${encodeURIComponent(enquiry.customerName || 'Customer')}`}
                    className="card p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{enquiry.customerName || 'Customer'}</h3>
                        </div>
                        {lastMessage && (
                          <div className="text-sm text-neutral-600 truncate">{preview}</div>
                        )}
                        {enquiry.lastUpdated && (
                          <div className="text-xs text-neutral-500 mt-2">
                            {new Date(enquiry.lastUpdated).toLocaleString()}
                          </div>
                        )}
                      </div>
                      {lastMessage && lastMessage.from === 'customer' && (
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          New
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </TailorLayout>
    )
  }

  const handleAddCustomPricing = () => {
    if (!customPricing.service || !customPricing.price) return
    
    const pricingMessage = {
      id: messages.length + 1,
      from: 'tailor',
      type: 'pricing',
      text: `Custom pricing: ${customPricing.service} - ₹${customPricing.price}`,
      pricing: { service: customPricing.service, price: customPricing.price },
      createdAt: new Date()
    }
    
    const updatedMessages = [...messages, pricingMessage]
    setMessages(updatedMessages)
    setCustomPricing({ service: '', price: '' })
    
    // Save to localStorage
    if (customerId && currentTailor) {
      try {
        const enquiries = JSON.parse(localStorage.getItem('tailorEnquiries') || '[]')
        const tailorId = currentTailor?.phone || currentTailor?.id
        const existingIndex = enquiries.findIndex(e => 
          e.customerId === customerId && 
          (e.tailorId || '').replace(/\D/g, '') === (tailorId || '').replace(/\D/g, '')
        )
        
        if (existingIndex >= 0) {
          enquiries[existingIndex].messages = updatedMessages
          enquiries[existingIndex].lastUpdated = new Date().toISOString()
          localStorage.setItem('tailorEnquiries', JSON.stringify(enquiries))
        }
      } catch (error) {
        console.error('Error saving pricing:', error)
      }
    }
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return
    
    // Add rejection message
    const rejectMessage = {
      id: messages.length + 1,
      from: 'tailor',
      type: 'rejection',
      text: `Order rejected: ${rejectReason}`,
      reason: rejectReason,
      createdAt: new Date()
    }
    
    const updatedMessages = [...messages, rejectMessage]
    setMessages(updatedMessages)
    setShowRejectModal(false)
    setRejectReason('')
    
    // Save to localStorage
    if (customerId && currentTailor) {
      try {
        const enquiries = JSON.parse(localStorage.getItem('tailorEnquiries') || '[]')
        const tailorId = currentTailor?.phone || currentTailor?.id
        const existingIndex = enquiries.findIndex(e => 
          e.customerId === customerId && 
          (e.tailorId || '').replace(/\D/g, '') === (tailorId || '').replace(/\D/g, '')
        )
        
        if (existingIndex >= 0) {
          enquiries[existingIndex].messages = updatedMessages
          enquiries[existingIndex].status = 'rejected'
          enquiries[existingIndex].lastUpdated = new Date().toISOString()
          localStorage.setItem('tailorEnquiries', JSON.stringify(enquiries))
        }
      } catch (error) {
        console.error('Error saving rejection:', error)
      }
    }
  }

  // Show conversation view
  return (
    <TailorLayout>
      <div className="max-w-4xl">
        <div className="mb-4">
          <Link 
            to="/tailor/enquiries"
            className="text-sm text-[color:var(--color-primary)] hover:underline mb-2 inline-block"
          >
            ← Back to Enquiries
          </Link>
          <h1 className="text-2xl font-semibold">Conversation with {customerName}</h1>
        </div>

        {/* Custom Pricing Section */}
        <Card className="p-5 mb-4">
          <div className="text-lg font-semibold mb-3">Custom Pricing</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Input
                label="Service"
                value={customPricing.service}
                onChange={(e) => setCustomPricing({ ...customPricing, service: e.target.value })}
                placeholder="e.g., Shirt Alteration"
              />
            </div>
            <div>
              <Input
                label="Price (₹)"
                type="number"
                value={customPricing.price}
                onChange={(e) => setCustomPricing({ ...customPricing, price: e.target.value })}
                placeholder="Enter amount"
              />
            </div>
          </div>
          <PrimaryButton 
            onClick={handleAddCustomPricing}
            className="mt-3"
            disabled={!customPricing.service || !customPricing.price}
          >
            Add Pricing
          </PrimaryButton>
        </Card>

        <Card className="p-4">
          <div 
            ref={chatRef} 
            className="h-96 overflow-y-auto rounded-lg border border-neutral-200 p-4 bg-neutral-50 mb-4"
          >
            {messages.length === 0 ? (
              <div className="text-center text-neutral-500 py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`max-w-[80%] mb-2 px-3 py-2 rounded-lg text-sm ${
                    m.from === 'tailor' 
                      ? 'ml-auto bg-[color:var(--color-primary)] text-white' 
                      : 'bg-white border border-neutral-200'
                  } ${m.type === 'rejection' ? 'bg-red-100 border-red-300 text-red-800' : ''}`}
                >
                  {m.type === 'pricing' && m.pricing ? (
                    <div>
                      <div className="font-semibold mb-1">💵 Custom Pricing</div>
                      <div>{m.pricing.service}: ₹{m.pricing.price}</div>
                    </div>
                  ) : (
                    m.text
                  )}
                  {m.createdAt && (
                    <div className={`text-xs mt-1 ${
                      m.from === 'tailor' ? (m.type === 'rejection' ? 'text-red-600' : 'text-white/70') : 'text-neutral-500'
                    }`}>
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <input 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..." 
              className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-[color:var(--color-primary)]" 
            />
            <button 
              onClick={sendMessage}
              className="btn-primary"
            >
              Send
            </button>
          </div>
          <button 
            onClick={() => setShowRejectModal(true)}
            className="w-full btn-outline text-red-600 border-red-200 hover:bg-red-50"
          >
            Reject Order
          </button>
        </Card>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="text-lg font-semibold mb-3">Reject Order</div>
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Reason for rejection</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-[color:var(--color-primary)] h-24 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <PrimaryButton 
                onClick={handleReject}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={!rejectReason.trim()}
              >
                Reject
              </PrimaryButton>
            </div>
          </Card>
        </div>
      )}
    </TailorLayout>
  )
}

export default TailorEnquiries


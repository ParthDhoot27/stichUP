import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSearchParams, Link } from 'react-router-dom'

const Enquiries = () => {
  const [params] = useSearchParams()
  const tailorId = params.get('tailorId')
  const tailorName = params.get('tailorName') || 'Tailor'
  const isOnline = params.get('isOnline') === 'true'
  const [allEnquiries, setAllEnquiries] = useState([])
  
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const chatRef = useRef(null)

  // Load enquiries from localStorage when tailorId changes
  useEffect(() => {
    if (tailorId) {
      try {
        const enquiries = JSON.parse(localStorage.getItem('enquiries') || '[]')
        const enquiry = enquiries.find(e => e.tailorId === tailorId)
        if (enquiry && enquiry.messages && enquiry.messages.length > 0) {
          // Load existing messages
          setMessages(enquiry.messages)
        } else {
          // Initialize new conversation
          if (isOnline) {
            setMessages([
              {
                id: 1,
                from: 'system',
                text: `You started a conversation with ${tailorName}`,
                createdAt: new Date()
              },
              {
                id: 2,
                from: 'tailor',
                text: 'Hello! How can I help you with your tailoring needs?',
                createdAt: new Date()
              }
            ])
          } else {
            setMessages([
              {
                id: 1,
                from: 'system',
                text: `${tailorName} is currently offline. Your enquiry will be sent and they will respond when available.`,
                createdAt: new Date()
              }
            ])
          }
        }
      } catch (error) {
        console.error('Error loading enquiry:', error)
        // Initialize if error occurs
        if (isOnline) {
          setMessages([
            {
              id: 1,
              from: 'system',
              text: `You started a conversation with ${tailorName}`,
              createdAt: new Date()
            },
            {
              id: 2,
              from: 'tailor',
              text: 'Hello! How can I help you with your tailoring needs?',
              createdAt: new Date()
            }
          ])
        }
      }
    }
  }, [tailorId, tailorName, isOnline])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    if (!chatInput.trim()) return
    
    const newMessage = {
      id: messages.length + 1,
      from: 'user',
      text: chatInput.trim(),
      createdAt: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setChatInput('')
    
    // Mock tailor reply (in real app, this would come from socket/API)
    if (isOnline) {
      setTimeout(() => {
        const tailorReply = {
          id: messages.length + 2,
          from: 'tailor',
          text: 'Thank you for your enquiry! I can provide a custom quote for that. Let me check the details.',
          createdAt: new Date()
        }
        setMessages(prev => [...prev, tailorReply])
      }, 1500)
    }
  }

  // Load all enquiries for list view
  useEffect(() => {
    try {
      const enquiries = JSON.parse(localStorage.getItem('enquiries') || '[]')
      setAllEnquiries(enquiries.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)))
    } catch (error) {
      console.error('Error loading enquiries:', error)
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (tailorId && messages.length > 0) {
      try {
        const enquiries = JSON.parse(localStorage.getItem('enquiries') || '[]')
        const existingIndex = enquiries.findIndex(e => e.tailorId === tailorId)
        
        const enquiryData = {
          tailorId,
          tailorName,
          messages,
          lastUpdated: new Date().toISOString(),
          isOnline
        }
        
        if (existingIndex >= 0) {
          enquiries[existingIndex] = enquiryData
        } else {
          enquiries.push(enquiryData)
        }
        
        localStorage.setItem('enquiries', JSON.stringify(enquiries))
        // Update all enquiries list
        setAllEnquiries(enquiries.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)))
      } catch (error) {
        console.error('Error saving enquiry:', error)
      }
    }
  }, [messages, tailorId, tailorName, isOnline])

  // If no tailorId, show list of all enquiries
  if (!tailorId) {
    return (
      <div className="min-h-dvh flex flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold mb-2">My Enquiries</h1>
              <div className="text-neutral-600">View and manage all your tailoring enquiries</div>
            </div>

            {allEnquiries.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-neutral-600 mb-4">No enquiries yet</div>
                <Link to="/find" className="btn-primary">
                  Find Tailors
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {allEnquiries.map((enquiry) => {
                  const lastMessage = enquiry.messages && enquiry.messages.length > 0 
                    ? enquiry.messages[enquiry.messages.length - 1] 
                    : null
                  const preview = lastMessage ? lastMessage.text.substring(0, 100) : 'No messages yet'
                  
                  return (
                    <Link
                      key={enquiry.tailorId}
                      to={`/enquiries?tailorId=${enquiry.tailorId}&tailorName=${encodeURIComponent(enquiry.tailorName)}&isOnline=${enquiry.isOnline}`}
                      className="card p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{enquiry.tailorName}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              enquiry.isOnline ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-600'
                            }`}>
                              {enquiry.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                          {lastMessage && (
                            <div className="text-sm text-neutral-600 truncate">{preview}</div>
                          )}
                          {enquiry.lastUpdated && (
                            <div className="text-xs text-neutral-400 mt-1">
                              {new Date(enquiry.lastUpdated).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <span className="text-blue-600">View →</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show chat view for specific tailor
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">Enquiry with {tailorName}</h1>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                  <span className="text-sm text-neutral-600">Tailor is available for instant chat</span>
                </>
              ) : (
                <>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                    Offline
                  </span>
                  <span className="text-sm text-neutral-600">Your enquiry will be sent and they will respond when available</span>
                </>
              )}
            </div>
          </div>

          <div className="card p-6">
            <div 
              ref={chatRef}
              className="h-96 overflow-y-auto mb-4 bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-3"
            >
              {messages.length === 0 ? (
                <div className="text-center text-neutral-500 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.from === 'user' ? 'justify-end' : msg.from === 'system' ? 'justify-center' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      msg.from === 'user' 
                        ? 'bg-[color:var(--color-primary)] text-white' 
                        : msg.from === 'system'
                        ? 'text-neutral-500 text-xs bg-transparent'
                        : 'bg-white border border-neutral-200'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]"
                disabled={!isOnline}
              />
              <button 
                onClick={sendMessage} 
                className="btn-primary"
                disabled={!isOnline || !chatInput.trim()}
              >
                Send
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <strong>Note:</strong> The tailor can provide custom pricing based on your requirements. Discuss your needs in the chat!
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Enquiries


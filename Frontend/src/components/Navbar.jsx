import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiBell, FiPackage, FiMessageCircle, FiMessageSquare } from 'react-icons/fi'

const Navbar = ({ hideUntilScroll = false }) => {
  const [isVisible, setIsVisible] = useState(!hideUntilScroll)
  const [user, setUser] = useState(null)
  const [earnings, setEarnings] = useState('12,540')
  const [showNotifications, setShowNotifications] = useState(false)
  const [pendingOrders, setPendingOrders] = useState([])
  const [newEnquiries, setNewEnquiries] = useState([])
  const notificationsRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!hideUntilScroll) return
    const onScroll = () => {
      setIsVisible(window.scrollY > 10)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hideUntilScroll])

  const positionClass = hideUntilScroll ? 'fixed' : 'sticky'
  const visibilityClass = isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'

  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hideUntilScroll && isVisible && !hasAnimated) {
      const t = setTimeout(() => setHasAnimated(true), 0)
      return () => clearTimeout(t)
    }
  }, [hideUntilScroll, isVisible, hasAnimated])

  // Check if user is logged in
  useEffect(() => {
    const checkUser = () => {
      try {
        const currentUser = localStorage.getItem('currentUser')
        if (currentUser) {
          setUser(JSON.parse(currentUser))
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    }
    
    checkUser()
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkUser)
    
    // Also trigger check when navigating (by listening to custom event)
    const handleAuthChange = () => checkUser()
    window.addEventListener('authChange', handleAuthChange)
    
    return () => {
      window.removeEventListener('storage', checkUser)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  // Get earnings from localStorage
  useEffect(() => {
    try {
      const tailorEarnings = localStorage.getItem('tailorEarnings')
      if (tailorEarnings) {
        setEarnings(Number(tailorEarnings).toLocaleString('en-IN'))
      }
    } catch {
      // Keep default value
    }
  }, [])

  // Load pending orders and new enquiries
  useEffect(() => {
    const loadNotifications = () => {
      if (user && user.role === 'tailor') {
        try {
          // Load pending orders (status === 'Request')
          const orders = JSON.parse(localStorage.getItem('tailorOrders') || '[]')
          const pending = orders.filter(o => o.status === 'Request' || o.status === 'Pending')
          setPendingOrders(pending)

          // Load new enquiries (unread messages from customers) for this tailor
          const tailorId = user?.phone || user?.id
          if (tailorId) {
            const enquiries = JSON.parse(localStorage.getItem('tailorEnquiries') || '[]')
            // Filter enquiries for this tailor where the last message is from 'customer'
            const newEnqs = enquiries.filter(e => {
              if (!e.messages || e.messages.length === 0) return false
              const messageTailorId = (e.tailorId || '').replace(/\D/g, '')
              const currentTailorId = (tailorId || '').replace(/\D/g, '')
              if (messageTailorId !== currentTailorId) return false
              const lastMessage = e.messages[e.messages.length - 1]
              return lastMessage.from === 'customer' || lastMessage.from === 'user'
            })
            setNewEnquiries(newEnqs)
          }
        } catch (error) {
          console.error('Error loading notifications:', error)
        }
      }
    }

    loadNotifications()
    // Refresh notifications periodically
    const interval = setInterval(loadNotifications, 5000)
    return () => clearInterval(interval)
  }, [user])

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('authChange'))
    navigate('/')
  }

  const playEntrance = hideUntilScroll && isVisible && !hasAnimated

  return (
    <header className={[positionClass, 'top-0 left-0 right-0 w-full z-40 bg-[#305cde] border-b border-transparent transition-all duration-300'].join(' ') + ' ' + visibilityClass}>
      <motion.div
        className="w-full px-4 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-3"
        initial={playEntrance ? { opacity: 0 } : false}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <motion.div
          className="flex items-center gap-2 font-semibold"
          initial={playEntrance ? { x: 80, opacity: 0 } : false}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <Link to="/" className="flex items-center gap-3 font-semibold">
            <img src="/logo2.png" alt="Logo" className="h-10 w-50 rounded-md object-cover" />
          </Link>
        </motion.div>
        <motion.nav
          className="hidden md:flex items-center gap-6 text-sm justify-center text-white"
          initial={playEntrance ? { opacity: 0, scale: 0.95 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut', delay: 0.08 }}
        >
          {/* <Link to="/find" className="text-white/90 hover:text-white hover:underline underline-offset-4">Find Tailors</Link>
          <a href="#how" className="text-white/90 hover:text-white hover:underline underline-offset-4">How it Works</a>
          <a href="#contact" className="text-white/90 hover:text-white hover:underline underline-offset-4">Contact</a> */}
        </motion.nav>
        <motion.div
          className="flex justify-end items-center gap-2"
          initial={playEntrance ? { x: -80, opacity: 0 } : false}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          {user ? (
            user.role === 'customer' ? (
              <>
                <Link 
                  to="/customer/account"
                  className="inline-flex items-center justify-center px-4 py-2 text-white font-medium hover:text-white/80 transition-colors"
                >
                  My Account
                </Link>
                <Link 
                  to="/customer/orders"
                  className="inline-flex items-center justify-center px-4 py-2 text-white font-medium hover:text-white/80 transition-colors"
                >
                  Orders
                </Link>
                <Link 
                  to="/enquiries"
                  className="inline-flex items-center justify-center px-4 py-2 text-white font-medium hover:text-white/80 transition-colors"
                >
                  Enquiries
                </Link>
                <Link 
                  to="/cart"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors relative"
                >
                  <span className="text-xl">🛒</span>
                  <span>Cart</span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/tailor/earnings"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-white font-semibold hover:text-white/80 transition-colors"
                >
                  <span>Today's Earnings: ₹{earnings}</span>
                </Link>
                <Link 
                  to="/tailor/enquiries"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-white font-medium hover:text-white/80 transition-colors"
                  title="Enquiries"
                >
                  <FiMessageSquare className="w-5 h-5" />
                  <span className="hidden sm:inline">Enquiries</span>
                </Link>
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="inline-flex items-center justify-center rounded-full p-2 text-white hover:bg-white/20 transition-colors relative"
                    title="Notifications"
                  >
                    <FiBell className="w-5 h-5" />
                    {(pendingOrders.length > 0 || newEnquiries.length > 0) && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 z-40 max-h-96 overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-neutral-200">
                        <div className="text-lg font-semibold text-neutral-900">Notifications</div>
                      </div>
                      <div className="overflow-y-auto flex-1">
                        {pendingOrders.length === 0 && newEnquiries.length === 0 ? (
                          <div className="p-4 text-center text-neutral-500 text-sm">
                            No new notifications
                          </div>
                        ) : (
                          <>
                            {pendingOrders.length > 0 && (
                              <div className="p-2">
                                <div className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                                  Pending Orders ({pendingOrders.length})
                                </div>
                                {pendingOrders.slice(0, 3).map((order) => (
                                  <Link
                                    key={order.id}
                                    to="/tailor/orders"
                                    onClick={() => setShowNotifications(false)}
                                    className="block px-3 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="mt-1 p-1.5 bg-blue-100 rounded-lg">
                                        <FiPackage className="w-4 h-4 text-blue-600" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-neutral-900">{order.id}</div>
                                        <div className="text-xs text-neutral-600 truncate">{order.user} • {order.service} • {order.cloth}</div>
                                        {order.slot && (
                                          <div className="text-xs text-neutral-500 mt-0.5">{order.slot}</div>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                                {pendingOrders.length > 3 && (
                                  <Link
                                    to="/tailor/orders"
                                    onClick={() => setShowNotifications(false)}
                                    className="block px-3 py-2 text-sm text-[color:var(--color-primary)] hover:bg-neutral-50 rounded-lg text-center font-medium"
                                  >
                                    View all {pendingOrders.length} orders
                                  </Link>
                                )}
                              </div>
                            )}
                            
                            {newEnquiries.length > 0 && (
                              <div className="p-2 border-t border-neutral-200">
                                <div className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                                  New Enquiries ({newEnquiries.length})
                                </div>
                                {newEnquiries.slice(0, 3).map((enquiry) => {
                                  const lastMessage = enquiry.messages && enquiry.messages.length > 0 
                                    ? enquiry.messages[enquiry.messages.length - 1]
                                    : null
                                  const preview = lastMessage 
                                    ? (lastMessage.type === 'voice' ? '🎤 Voice message' : (lastMessage.text || '').substring(0, 50))
                                    : 'New enquiry'
                                  
                                  return (
                                    <Link
                                      key={enquiry.customerId || enquiry.tailorId}
                                      to={enquiry.customerId 
                                        ? `/tailor/enquiries?customerId=${enquiry.customerId}&customerName=${encodeURIComponent(enquiry.customerName || 'Customer')}`
                                        : `/tailor/enquiries`}
                                      onClick={() => setShowNotifications(false)}
                                      className="block px-3 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1.5 bg-green-100 rounded-lg">
                                          <FiMessageCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-medium text-neutral-900">{enquiry.customerName || enquiry.tailorName || 'Customer'}</div>
                                          <div className="text-xs text-neutral-600 truncate">{preview}</div>
                                        </div>
                                      </div>
                                    </Link>
                                  )
                                })}
                                {newEnquiries.length > 3 && (
                                  <Link
                                    to="/tailor/enquiries"
                                    onClick={() => setShowNotifications(false)}
                                    className="block px-3 py-2 text-sm text-[color:var(--color-primary)] hover:bg-neutral-50 rounded-lg text-center font-medium"
                                  >
                                    View all {newEnquiries.length} enquiries
                                  </Link>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Link 
                  to="/tailor/profile"
                  onClick={(e) => {
                    // Ensure notifications close when clicking profile
                    setShowNotifications(false)
                    navigate('/tailor/profile')
                  }}
                  className="inline-flex items-center justify-center rounded-full p-2 text-white hover:bg-white/20 transition-colors relative z-10"
                  title="Profile"
                >
                  <FiUser className="w-5 h-5" />
                </Link>
              </>
            )
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-black text-white font-semibold hover:bg-neutral-900 transition-colors">Login</Link>
              <Link to="/signup" className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-black text-white font-semibold hover:bg-neutral-900 transition-colors">Sign up</Link>
            </>
          )}
        </motion.div>
      </motion.div>
    </header>
  )
}

export default Navbar



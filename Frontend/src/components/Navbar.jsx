import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Navbar = ({ hideUntilScroll = false }) => {
  const [isVisible, setIsVisible] = useState(!hideUntilScroll)

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

  return (
    <header className={[positionClass, 'top-0 left-0 right-0 w-full z-40 bg-[#305cde] border-b border-transparent transition-all duration-300'].join(' ') + ' ' + visibilityClass}>
      <motion.div
        className="w-full px-4 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <motion.div
          className="flex items-center gap-2 font-semibold"
          initial={{ x: '50%' }}
          animate={{ x: isVisible ? 0 : '50%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        >
          <Link to="/" className="flex items-center gap-3 font-semibold">
            <img src="/logo1.png" alt="Logo" className="h-10 w-50 rounded-md object-cover" />
          </Link>
        </motion.div>
        <motion.nav
          className="hidden md:flex items-center gap-6 text-sm justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut', delay: 0.08 }}
        >
          <Link to="/find" className="hover:text-[color:var(--color-primary)]">Find Tailors</Link>
          <a href="#how" className="hover:text-[color:var(--color-primary)]">How it Works</a>
          <a href="#contact" className="hover:text-[color:var(--color-primary)]">Contact</a>
        </motion.nav>
        <motion.div
          className="flex justify-end"
          initial={{ x: '-50%' }}
          animate={{ x: isVisible ? 0 : '-50%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        >
          <Link to="/login" className="btn-outline">Login</Link>
        </motion.div>
      </motion.div>
    </header>
  )
}

export default Navbar



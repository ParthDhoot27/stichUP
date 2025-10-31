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

  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hideUntilScroll && isVisible && !hasAnimated) {
      const t = setTimeout(() => setHasAnimated(true), 0)
      return () => clearTimeout(t)
    }
  }, [hideUntilScroll, isVisible, hasAnimated])

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
          <Link to="/login" className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-black text-white font-semibold hover:bg-neutral-900 transition-colors">Login</Link>
          <Link to="/signup" className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-black text-white font-semibold hover:bg-neutral-900 transition-colors">Sign up</Link>
        </motion.div>
      </motion.div>
    </header>
  )
}

export default Navbar



import React from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiUser, FiShoppingBag } from 'react-icons/fi'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="h-6 w-6 rounded-md bg-[color:var(--color-primary)]" />
          <span>StitchUp</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-3">
          <Link to="/" className="px-3 py-2 rounded-lg hover:bg-neutral-100">Home</Link>
          <Link to="/orders" className="px-3 py-2 rounded-lg hover:bg-neutral-100">Orders</Link>
          <Link to="/profile" className="px-3 py-2 rounded-lg hover:bg-neutral-100">Profile</Link>
        </nav>
        <div className="flex sm:hidden items-center gap-4 text-xl">
          <FiMapPin />
          <FiShoppingBag />
          <FiUser />
        </div>
      </div>
    </header>
  )
}

export default Navbar



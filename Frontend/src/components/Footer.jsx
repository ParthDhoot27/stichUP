import React from 'react'
import { FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-neutral-600">© {new Date().getFullYear()} StitchUp</div>
        <div className="flex items-center gap-4 text-neutral-600">
          <a href="#" aria-label="Twitter" className="hover:text-[color:var(--color-primary)]"><FiTwitter /></a>
          <a href="#" aria-label="Instagram" className="hover:text-[color:var(--color-primary)]"><FiInstagram /></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-[color:var(--color-primary)]"><FiLinkedin /></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer



import React from 'react'
import { FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="text-base font-semibold text-neutral-900">About StitchUp</h4>
            <ul className="mt-3 space-y-2 text-neutral-600 text-base">
              <li><a href="#" className="hover:text-[color:var(--color-primary)]">About</a></li>
              <li><a href="#" className="hover:text-[color:var(--color-primary)]">Career</a></li>
              <li><a href="#" className="hover:text-[color:var(--color-primary)]">Blog</a></li>
              <li><a href="#" className="hover:text-[color:var(--color-primary)]">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-neutral-900">Learn more</h4>
            <ul className="mt-3 space-y-2 text-neutral-600 text-base">
              <li><a href="#" className="hover:text-[color:var(--color-primary)]">Privacy</a></li>
              <li><a href="#" className="hover:text-[color:var(--color-primary)]">Terms</a></li>
              <li><a href="#" className="hover:text-[color:var(--color-primary)]">For Partners (Coming Soon)</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-neutral-900">Follow us</h4>
            <div className="mt-3 flex items-center gap-4 text-neutral-600">
              <a href="#" aria-label="Twitter" className="hover:text-[color:var(--color-primary)]"><FiTwitter /></a>
              <a href="#" aria-label="Instagram" className="hover:text-[color:var(--color-primary)]"><FiInstagram /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-[color:var(--color-primary)]"><FiLinkedin /></a>
            </div>
          </div>
          <div>
            {/* <h4 className="text-base font-semibold text-neutral-900">Download app</h4> */}
            <div className="mt-3 grid grid-cols-2 gap-3 max-w-xs">
              {/* <a href="#" className="h-12 rounded-lg border border-neutral-300 bg-neutral-50 grid place-items-center text-xs font-semibold text-neutral-700">Get it on Google Play</a>
              <a href="#" className="h-12 rounded-lg border border-neutral-300 bg-neutral-50 grid place-items-center text-xs font-semibold text-neutral-700">Download on the App Store</a> */}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-6 text-sm text-neutral-500 leading-relaxed">
          By continuing past this page, you agree to our <a href="#" className="underline hover:text-[color:var(--color-primary)]">Terms of service</a>, <a href="#" className="underline hover:text-[color:var(--color-primary)]">Cookie policy</a>, <a href="#" className="underline hover:text-[color:var(--color-primary)]">Privacy policy</a> and <a href="#" className="underline hover:text-[color:var(--color-primary)]">Content policies</a>. All trademarks are properties of their respective owners. 2016-{new Date().getFullYear()} © Blink Commerce Pvt Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer



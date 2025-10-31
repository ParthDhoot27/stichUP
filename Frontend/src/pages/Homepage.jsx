import React from 'react'
import Card from '../components/ui/Card'
import PrimaryButton from '../components/ui/PrimaryButton'
import TailorCard from '../components/TailorCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import ServiceCard from '../components/ServiceCard'
import TestimonialsSlider from '../components/TestimonialsSlider'
import { FiZap, FiScissors, FiTruck } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const Homepage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar hideUntilScroll />
      <HeroSection />

      {/* Listed professional tailors */}
      <section className="px-4 mx-auto w-full max-w-6xl py-10">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-2xl md:text-3xl momo-heading font-extrabold">Professional Tailors</h1>
            <p className="mt-3 text-neutral-700">• Verified and skilled tailors curated for quality work.</p>
            <p className="mt-2 text-neutral-700">• Years of experience in styling, stitching, and alterations.</p>
            <p className="mt-2 text-neutral-700">• Trusted craftsmanship for a perfect fit, every time.</p>
          </div>
          <img src="/AdobeStock_158668801.webp" alt="Craftsmanship highlight" className="h-64 md:h-80 w-full object-cover rounded-2xl border border-neutral-300" />
        </div>
      </section>

      {/* Convenience at every point */}
      <section className="px-4 mx-auto w-full max-w-6xl py-10">
        <div className="grid gap-20 md:grid-cols-2 items-center">
          <div className="order-2 md:order-2">
            <h1 className="text-2xl md:text-3xl momo-heading font-extrabold">Convenience at every point</h1>
            <p className="mt-3 text-neutral-700">• Book, track, and receive your garments at your doorstep.</p>
            <p className="mt-2 text-neutral-700">• Fast pickup, timely delivery, and real-time updates.</p>
            <p className="mt-2 text-neutral-700">• Tailoring made effortless, comfort meets smart service.</p>
          </div>
          <img src="/sustainable.webp" alt="Convenience highlight" className="order-1 md:order-1 h-64 md:h-80 w-full object-cover rounded-2xl border border-neutral-300" />
        </div>
      </section>

      {/* Fast & Convenient Service */}
      <section className="px-4 mx-auto w-full max-w-6xl py-10">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-2xl md:text-3xl momo-heading font-extrabold">Fast & Convenient Service</h1>
            <p className="mt-3 text-neutral-700">• Doorstep pickup and delivery for ultimate ease.</p>
            <p className="mt-2 text-neutral-700">• Quick turnarounds with live order tracking.</p>
            <p className="mt-2 text-neutral-700">• Instant booking, tailoring made effortless.</p>
          </div>
          <img src="/speed.webp" alt="Fast service highlight" className="h-64 md:h-80 w-full object-cover rounded-2xl border border-neutral-300" />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Homepage
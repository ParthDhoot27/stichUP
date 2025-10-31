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

      {/* Craftsmanship & Quality */}
      <section className="px-4 mx-auto w-full max-w-6xl py-10">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: '#1c1c1c', fontFeatureSettings: '"liga" off, "clig" off', fontFamily: 'Lexend-Medium', fontSize: '26px', fontStyle: 'normal', fontWeight: 800, lineHeight: 'normal' }}>Craftsmanship & Quality</h2>
            <p className="mt-3 text-neutral-700">Skilled tailors delivering perfect fits and precise finishing.</p>
            <p className="mt-2 text-neutral-700">Premium stitching, expert alterations, and attention to detail.</p>
            <p className="mt-2 text-neutral-700">Your clothes handled with care and professionalism.</p>
          </div>
          <img src="/AdobeStock_158668801.webp" alt="Craftsmanship highlight" className="h-64 md:h-80 w-full object-cover rounded-2xl border border-neutral-300" />
        </div>
      </section>

      {/* Sustainable Fashion */}
      <section className="px-4 mx-auto w-full max-w-6xl py-10">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="order-2 md:order-2">
            <h3 className="text-xl md:text-2xl font-semibold" style={{ color: '#1c1c1c', fontFeatureSettings: '"liga" off, "clig" off', fontFamily: 'Lexend-Medium', fontSize: '26px', fontStyle: 'normal', fontWeight: 800, lineHeight: 'normal' }}>Sustainable Fashion</h3>
            <p className="mt-3 text-neutral-700">Revive, alter, and restyle instead of replacing.</p>
            <p className="mt-2 text-neutral-700">Support local artisans and reduce textile waste.</p>
            <p className="mt-2 text-neutral-700">Eco-friendly pickup and minimal packaging practices.</p>
          </div>
          <img src="/sustainable.webp" alt="Sustainable fashion highlight" className="order-1 md:order-1 h-64 md:h-80 w-full object-cover rounded-2xl border border-neutral-300" />
        </div>
      </section>

      {/* Fast & Convenient Service */}
      <section className="px-4 mx-auto w-full max-w-6xl py-10">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold" style={{ color: '#1c1c1c', fontFeatureSettings: '"liga" off, "clig" off', fontFamily: 'Lexend-Medium', fontSize: '26px', fontStyle: 'normal', fontWeight: 800, lineHeight: 'normal' }}>Fast & Convenient Service</h3>
            <p className="mt-3 text-neutral-700">Doorstep pickup and delivery for ultimate ease.</p>
            <p className="mt-2 text-neutral-700">Quick turnarounds with live order tracking.</p>
            <p className="mt-2 text-neutral-700">Instant booking — tailoring made effortless.</p>
          </div>
          <img src="/speed.webp" alt="Fast service highlight" className="h-64 md:h-80 w-full object-cover rounded-2xl border border-neutral-300" />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Homepage
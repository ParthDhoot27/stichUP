import React from 'react'
import Card from '../components/ui/Card'
import PrimaryButton from '../components/ui/PrimaryButton'
import TailorCard from '../components/TailorCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MapPlaceholder from '../components/MapPlaceholder'
import ServiceCard from '../components/ServiceCard'
import TestimonialsSlider from '../components/TestimonialsSlider'
import { FiZap, FiScissors, FiTruck } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const Homepage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <header className="w-full bg-[color:var(--color-primary)] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full border border-white/40">Doorstep tailoring</div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mt-3">Tailoring at your doorstep</h1>
              <p className="text-white/90 mt-2">Find skilled tailors nearby for stitching and alterations.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
                <div className="flex items-center gap-2 bg-white text-[color:var(--color-text)] rounded-xl px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent)]" />
                  <input placeholder="Enter your location" className="flex-1 outline-none bg-transparent" />
                </div>
                <PrimaryButton onClick={() => navigate('/find')}>Find Tailor</PrimaryButton>
                <PrimaryButton variant="outline" onClick={() => navigate('/tailor/dashboard')} className="!text-white !border-white/60 hover:!border-white">Become a Tailor</PrimaryButton>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 mt-6">
                <ServiceCard icon={<FiZap />} title="Doorstep pickup" subtitle="Quick collection from your address" />
                <ServiceCard icon={<FiScissors />} title="Skilled tailors" subtitle="Verified & rated professionals" />
                <ServiceCard icon={<FiTruck />} title="Fast delivery" subtitle="Right to your door" />
              </div>
            </div>
            <MapPlaceholder className="h-72" />
          </div>
        </div>
      </header>

      <section className="px-4 mx-auto w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-3">Popular nearby tailors</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <TailorCard name="StitchUp Tailors" distanceKm={1.2} rating={4.7} reviewCount={128} priceFrom={199} onBook={() => navigate('/booking')} />
          <TailorCard name="Needle & Thread" distanceKm={0.8} rating={4.6} reviewCount={96} priceFrom={149} onBook={() => navigate('/booking')} />
        	<TailorCard name="Elegant Alterations" distanceKm={1.9} rating={4.8} reviewCount={212} priceFrom={249} onBook={() => navigate('/booking')} />
        </div>
      </section>

      <section className="mt-10 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <h2 className="text-2xl font-semibold mb-3">What customers say</h2>
          <TestimonialsSlider items={[
            { name: 'Aarav', stars: '★★★★★', text: 'Pickup was quick and fitting perfect!' },
            { name: 'Riya', stars: '★★★★★', text: 'Loved the doorstep service and updates.' },
            { name: 'Kabir', stars: '★★★★☆', text: 'Great pricing and timely delivery.' },
          ]} />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Homepage
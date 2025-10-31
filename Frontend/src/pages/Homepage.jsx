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

      <section className="px-4 mx-auto w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-3">Explore our services</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard icon={<FiScissors />} title="Alterations & Repairs" subtitle="Hems, tapering, patching, and more" />
          <ServiceCard icon={<FiTruck />} title="Pickup & Delivery" subtitle="Doorstep convenience, fast turnaround" />
          <ServiceCard icon={<FiZap />} title="Express Service" subtitle="Urgent orders handled with care" />
        </div>
      </section>

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
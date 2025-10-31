import React from 'react'
import PrimaryButton from './ui/PrimaryButton'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const navigate = useNavigate()
  return (
    <header
      className="relative w-full min-h-dvh text-white bg-[#002366]"
      id="hero"
    >
      <div
        className="absolute inset-0 bg-[#002366] bg-[url('/bg-landing.jpg')] bg-cover bg-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-4">
        <div className="min-h-dvh grid place-items-center text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Tailor at your Doorstep
            </h1>
            <p className="mt-3 text-white/90 max-w-2xl mx-auto">
              Book trusted local tailors for alterations and custom fits.
              <br/>
              Fast pickup, perfect fit, easy delivery.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <PrimaryButton onClick={() => navigate('/find')} className="px-8 py-3.5 text-lg md:px-10 md:py-4 md:text-xl rounded-2xl shadow-lg shadow-black/20 ring-1 ring-white/20">
                Find a tailor
              </PrimaryButton>
              <PrimaryButton
                variant="outline"
                onClick={() => navigate('/tailor/dashboard')}
                className="px-8 py-3.5 text-lg md:px-10 md:py-4 md:text-xl rounded-2xl shadow-lg shadow-black/10 !text-white !border-white/60 hover:!border-white !bg-white/10 hover:!bg-white/20 backdrop-blur-sm"
              >
                Become a tailor
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeroSection



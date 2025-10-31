import React from 'react'
import PrimaryButton from './ui/PrimaryButton'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const navigate = useNavigate()
  const [showLogo, setShowLogo] = React.useState(true)
  React.useEffect(() => {
    const onScroll = () => setShowLogo(window.scrollY <= 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header
      className="relative w-full min-h-dvh text-white bg-[#305cde]"
      id="hero"
    >
      <div
        className="absolute inset-0 bg-[#305cde] bg-[url('/bg-landing.jpg')] bg-cover bg-center scale-x-[-1]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-4">
        {showLogo && (
          <img src="/logo2.png" alt="Logo" className="absolute top-3 left-4 h-25 w-auto rounded-md object-cover z-10" />
        )}
        <div className="min-h-dvh flex items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight tasa-orbiter-700">
              TAILORING AT
              <br/> 
              YOUR DOORSTEP
            </h1>
            <p className="mt-3 text-white/90 max-w-2xl text-lg md:text-xl leading-relaxed">
              Skilled tailors nearby for stitching, alterations, and custom fittings,
              <br/>
              just a tap away.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-centre justify-center gap-4">
              <PrimaryButton onClick={() => navigate('/find')} className="px-8 py-3.5 text-lg md:px-10 md:py-4 md:text-xl rounded-2xl shadow-lg shadow-black/20 ring-1 ring-white/20">
                Find a Tailor
              </PrimaryButton>
              <PrimaryButton
                variant="outline"
                onClick={() => navigate('/tailor/dashboard')}
                className="px-8 py-3.5 text-lg md:px-10 md:py-4 md:text-xl rounded-2xl shadow-lg shadow-black/10 !text-white !border-white/60 hover:!border-white !bg-white/10 hover:!bg-white/20 backdrop-blur-sm"
              >
                Become a Tailor
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeroSection



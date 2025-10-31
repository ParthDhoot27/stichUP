import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PrimaryButton from '../components/ui/PrimaryButton'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const Customer = () => {
  const navigate = useNavigate()
  const [, setParams] = useSearchParams()

  const chooseType = (type) => {
    try { localStorage.setItem('workType', type) } catch {}
    setParams({ type })
    navigate(`/find?type=${type}`)
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="card p-6">
            <div className="text-2xl font-semibold">Welcome</div>
            <div className="text-neutral-600 mt-1">What kind of work do you need help with?</div>

            <div className="grid gap-3 sm:grid-cols-2 mt-5">
              <button onClick={() => chooseType('light')} className="rounded-xl border border-neutral-200 p-4 text-left hover:border-[color:var(--color-primary)]">
                <div className="text-lg font-semibold">Quick Fix</div>
                <div className="text-neutral-600 text-sm mt-1">Buttons, small stitch, chain, minor repairs</div>
              </button>
              <button onClick={() => chooseType('heavy')} className="rounded-xl border border-neutral-200 p-4 text-left hover:border-[color:var(--color-primary)]">
                <div className="text-lg font-semibold">Heavy Tailoring</div>
                <div className="text-neutral-600 text-sm mt-1">New garments, alterations, complex work</div>
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <PrimaryButton onClick={() => {
                let t = ''
                try { t = localStorage.getItem('workType') || '' } catch {}
                if (t === 'light' || t === 'heavy') navigate(`/find?type=${t}`)
                else navigate('/find')
              }}>Search tailors near me</PrimaryButton>
              <Link className="btn-outline" to="/location">Use my location</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Customer

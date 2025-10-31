import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Customer = () => {
  const navigate = useNavigate()
  const [, setParams] = useSearchParams()

  const chooseType = (type) => {
    try { localStorage.setItem('workType', type) } catch {}
    setParams({ type })
    if (type === 'light') {
      navigate('/categories')
    } else {
      navigate(`/find?type=${type}`)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="p-6">
          <h1 className="text-2xl md:text-3xl momo-heading font-extrabold">Welcome Back,</h1>
            <div className="text-neutral-600 mt-1">What kind of work do you need help with?</div>

            <div className="grid gap-4 sm:grid-cols-2 mt-6">
              <button onClick={() => chooseType('light')} className="rounded-xl border border-neutral-200 p-6 text-left hover:border-[color:var(--color-primary)] transition-all hover:shadow-md">
                <img src="/quick-fix.jpg" alt="Quick Fix" className="w-full h-40 object-cover rounded-lg mb-4" />
                <div className="text-xl font-semibold">Quick Fix</div>
                <div className="text-neutral-600 text-sm mt-2">Buttons, small stitch, chain, alterations...</div>
              </button>
              <button onClick={() => chooseType('heavy')} className="rounded-xl border border-neutral-200 p-6 text-left hover:border-[color:var(--color-primary)] transition-all hover:shadow-md">
                <img src="/heavy_tailoring.jpg" alt="Heavy Tailoring" className="block w-auto h-40 object-cover rounded-lg mb-4 mx-auto" />
                <div className="text-xl font-semibold">Heavy Tailoring</div>
                <div className="text-neutral-600 text-sm mt-2">New garments, complex work...</div>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Customer

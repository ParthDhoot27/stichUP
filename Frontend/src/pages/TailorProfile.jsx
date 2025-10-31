import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PrimaryButton from '../components/ui/PrimaryButton'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import { FiMapPin, FiStar, FiPhone, FiMessageCircle } from 'react-icons/fi'

const ServiceRow = ({ name, price }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-b-0 border-neutral-200">
    <div className="text-sm">{name}</div>
    <div className="font-semibold">₹{price}</div>
  </div>
)

const ReviewItem = ({ name, rating, text }) => (
  <div className="p-4 border border-neutral-200 rounded-xl">
    <div className="flex items-center justify-between">
      <div className="font-medium">{name}</div>
      <div className="text-sm text-neutral-600">{rating} ★</div>
    </div>
    <p className="text-neutral-600 text-sm mt-1">{text}</p>
  </div>
)

const TailorProfile = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // Placeholder data; read from route state if present
  const tailor = location.state?.tailor || {
    name: 'StitchUp Tailors',
    rating: 4.7,
    reviews: 128,
    years: 8,
    location: 'Andheri East, Mumbai',
    bannerUrl: '',
    avatarUrl: '',
    services: [
      { name: 'Shirt Alteration', price: 149 },
      { name: 'Pant Hemming', price: 129 },
      { name: 'Blouse Stitching', price: 499 },
      { name: 'Kurta Stitching', price: 699 },
    ],
    reviewsList: [
      { name: 'Aarav', rating: 5, text: 'Perfect fit and quick pickup!' },
      { name: 'Riya', rating: 5, text: 'Loved the communication and delivery.' },
      { name: 'Kabir', rating: 4, text: 'Great quality at a fair price.' },
    ],
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-44 md:h-60 w-full bg-neutral-100 border-b border-neutral-200">
          {tailor.bannerUrl ? (
            <img src={tailor.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          ) : null}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0">
            <div className="h-24 w-24 rounded-2xl border-4 border-white overflow-hidden bg-neutral-200">
              {tailor.avatarUrl ? (
                <img src={tailor.avatarUrl} alt={tailor.name} className="w-full h-full object-cover" />
              ) : null}
            </div>
          </div>
        </div>

        {/* Header details */}
        <div className="mx-auto max-w-6xl px-4 pt-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">{tailor.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-neutral-600 mt-1">
                <span className="inline-flex items-center gap-1"><FiStar className="text-[color:var(--color-primary)]" /> {tailor.rating} ({tailor.reviews})</span>
                <span>{tailor.years}+ yrs exp</span>
                <span className="inline-flex items-center gap-1"><FiMapPin /> {tailor.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-outline inline-flex items-center gap-2"><FiPhone /> Call</button>
              <button className="btn-outline inline-flex items-center gap-2"><FiMessageCircle /> Chat</button>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid lg:grid-cols-[1fr_420px] gap-4 mt-6">
            <div className="grid gap-4">
              <Card className="p-5">
                <div className="text-lg font-semibold mb-3">Services & Pricing</div>
                <div className="grid sm:grid-cols-2 gap-x-8">
                  {tailor.services.map((s, i) => <ServiceRow key={i} name={s.name} price={s.price} />)}
                </div>
              </Card>

              <Card className="p-5">
                <div className="text-lg font-semibold mb-3">Reviews</div>
                <div className="grid gap-3">
                  {tailor.reviewsList.map((r, i) => (
                    <ReviewItem key={i} name={r.name} rating={r.rating} text={r.text} />
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid gap-4">
              <Card className="p-5">
                <div className="text-lg font-semibold">About</div>
                <p className="text-neutral-600 text-sm mt-2">Premium tailoring services with doorstep pickup and delivery. Skilled in alterations and custom stitching.</p>
              </Card>
              <Card className="p-5">
                <div className="text-lg font-semibold">Location</div>
                <div className="mt-3 h-40 rounded-xl border border-neutral-200 bg-neutral-50 grid place-items-center text-neutral-500">Map preview</div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky booking bar */}
      <div className="sticky bottom-0 inset-x-0 bg-white/80 backdrop-blur border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="text-sm"><span className="font-semibold">From ₹{tailor.services[0].price}</span> • Trusted by {tailor.reviews}+ customers</div>
          <PrimaryButton onClick={()=> navigate('/booking', { state: { tailor } })}>Book Service</PrimaryButton>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TailorProfile



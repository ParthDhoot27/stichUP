import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TailorListCard from '../components/TailorListCard'
import { FiSearch } from 'react-icons/fi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const sampleTailors = [
  { id: 6, name: 'Button & Hem', rating: 4.2, reviews: 30, distanceKm: 3.1, priceFrom: 99, shopPhotoUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', avgQuickMins: 30, avgHeavyMins: 140, isAvailable: false, currentOrders: 7 },
  { id: 7, name: 'Classic Tailors Co.', rating: 4.9, reviews: 340, distanceKm: 0.4, priceFrom: 299, shopPhotoUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', avgQuickMins: 12, avgHeavyMins: 70, isAvailable: true, currentOrders: 0 },
  { id: 8, name: 'Metro Mend', rating: 4.3, reviews: 54, distanceKm: 2.0, priceFrom: 129, shopPhotoUrl: 'https://images.unsplash.com/photo-1520975909799-9b8b9a2b5b5f?auto=format&fit=crop&w=800&q=80', avgQuickMins: 24, avgHeavyMins: 95, isAvailable: true, currentOrders: 6 },
  { id: 9, name: 'SewRight Studio', rating: 4.6, reviews: 77, distanceKm: 1.5, priceFrom: 179, shopPhotoUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80', avgQuickMins: 19, avgHeavyMins: 88, isAvailable: true, currentOrders: 2 },
  { id: 10, name: 'Pocketfix Tailors', rating: 4.1, reviews: 28, distanceKm: 4.0, priceFrom: 89, shopPhotoUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', avgQuickMins: 35, avgHeavyMins: 150, isAvailable: false, currentOrders: 9 },
]

const Chip = ({ label, selected, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    whileHover={{ y: -1 }}
    onClick={onClick}
    className={[
      'px-3 py-1.5 rounded-full border text-sm',
      selected
        ? 'border-(--color-primary) text-(--color-primary) bg-(--color-primary)/10'
        : 'border-neutral-200 hover:border-(--color-primary)'
    ].join(' ')}
  >
    {label}
  </motion.button>
)

const FindTailor = () => {
  const [query, setQuery] = useState('')
  const [workType, setWorkType] = useState('quick') // quick | heavy
  const [hovered, setHovered] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const list = useMemo(() => {
    // Mock data filtering logic
    return sampleTailors.filter(t =>
      query ? t.name.toLowerCase().includes(query.toLowerCase()) : true
    )
  }, [query])

  // Mock initial loading state
  useEffect(() => {
    const to = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(to)
  }, [])

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="z-10 px-4 py-3">
          <div className="mx-auto max-w-6xl flex flex-col gap-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Chip label="Quick Fix" selected={workType === 'quick'} onClick={() => setWorkType('quick')} />
              <Chip label="Heavy Tailoring" selected={workType === 'heavy'} onClick={() => setWorkType('heavy')} />
            </div>
            <div className="mx-auto max-w-4xl flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 px-3 py-2 shadow-soft">
                <FiSearch className="text-neutral-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tailors by name or service"
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-xl bg-neutral-200" />
                  <div className="flex-1 grid gap-2">
                    <div className="h-4 w-40 bg-neutral-200 rounded" />
                    <div className="h-3 w-56 bg-neutral-200 rounded" />
                    <div className="h-6 w-56 bg-neutral-200 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : list.length ? (
            list.map((t) => (
              <TailorListCard
                key={t.id}
                tailor={t}
                onHover={setHovered}
                onLeave={() => setHovered(null)}
                onOpen={() => navigate(`/tailor/${t.id}`, { state: { tailor: t } })}
                onBook={() => navigate('/booking', { state: { tailor: t } })}
              />
            ))
          ) : (
            <div className="card p-6 text-center text-neutral-600">
              No tailors match. Adjust filters or pick another work type.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default FindTailor



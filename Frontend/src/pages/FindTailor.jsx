import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TailorListCard from '../components/TailorListCard'
import MapPlaceholder from '../components/MapPlaceholder'
import { FiSearch } from 'react-icons/fi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const sampleTailors = [
  { id: 1, name: 'StitchUp Tailors', rating: 4.7, reviews: 128, distanceKm: 1.2, priceFrom: 199, tags: ['Stitching','Alteration'],
    waiting: 1, heavyAvgMins: 45, lightAvgMins: 12, photoUrl: null },
  { id: 2, name: 'Needle & Thread', rating: 4.6, reviews: 96, distanceKm: 0.8, priceFrom: 149, tags: ['Alteration'],
    waiting: 3, heavyAvgMins: 60, lightAvgMins: 15, photoUrl: null },
  { id: 3, name: 'Elegant Alterations', rating: 4.8, reviews: 212, distanceKm: 1.9, priceFrom: 249, tags: ['Stitching','Urgent'],
    waiting: 0, heavyAvgMins: 50, lightAvgMins: 10, photoUrl: null },
  { id: 1, name: 'StitchUp Tailors', rating: 4.7, reviews: 128, distanceKm: 1.2, priceFrom: 199, shopPhotoUrl: 'https://images.unsplash.com/photo-1520975917765-9763f2a7b3d6?auto=format&fit=crop&w=800&q=80', avgQuickMins: 20, avgHeavyMins: 90, isAvailable: true, currentOrders: 2 },
  { id: 2, name: 'Needle & Thread', rating: 4.6, reviews: 96, distanceKm: 0.8, priceFrom: 149, shopPhotoUrl: 'https://images.unsplash.com/photo-1556909214-7c1e6a5b7b6b?auto=format&fit=crop&w=800&q=80', avgQuickMins: 25, avgHeavyMins: 100, isAvailable: false, currentOrders: 5 },
  { id: 3, name: 'Elegant Alterations', rating: 4.8, reviews: 212, distanceKm: 1.9, priceFrom: 249, shopPhotoUrl: 'https://images.unsplash.com/photo-1542736667-069246bdbc45?auto=format&fit=crop&w=800&q=80', avgQuickMins: 15, avgHeavyMins: 80, isAvailable: true, currentOrders: 1 },
  { id: 4, name: 'Rapid Repairs', rating: 4.5, reviews: 64, distanceKm: 0.6, priceFrom: 119, shopPhotoUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80', avgQuickMins: 18, avgHeavyMins: 85, isAvailable: true, currentOrders: 4 },
  { id: 5, name: 'Urban Stitchworks', rating: 4.4, reviews: 48, distanceKm: 2.3, priceFrom: 159, shopPhotoUrl: 'https://images.unsplash.com/photo-1523906630133-f6934a84d1d3?auto=format&fit=crop&w=800&q=80', avgQuickMins: 22, avgHeavyMins: 110, isAvailable: true, currentOrders: 3 },
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
        ? 'border-[color:var(--color-primary)] text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10'
        : 'border-neutral-200 hover:border-[color:var(--color-primary)]'
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
  const paramType = (params.get('type') || '').toLowerCase()
  let persistedType = ''
  try { persistedType = localStorage.getItem('workType') || '' } catch {}
  const selectedType = (paramType === 'heavy' || paramType === 'light')
    ? paramType
    : (persistedType === 'heavy' || persistedType === 'light') ? persistedType : ''

  const list = useMemo(() => {
    const base = sampleTailors.filter(t =>
      (query ? t.name.toLowerCase().includes(query.toLowerCase()) : true)
    )

    return base.map(t => {
      const avg = selectedType === 'heavy' ? t.heavyAvgMins : selectedType === 'light' ? t.lightAvgMins : null
      const etaMinutes = avg != null ? (t.waiting * avg) + avg : undefined
      const availability = t.waiting === 0 ? 'Available' : 'Busy'
      return { ...t, availability, etaMinutes }
    })
  }, [query, selectedType])

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
              <Chip label="Quick Fix" selected={selectedType==='light'} onClick={()=> { try { localStorage.setItem('workType', 'light') } catch {}; navigate('/find?type=light') }} />
              <Chip label="Heavy Tailoring" selected={selectedType==='heavy'} onClick={()=> { try { localStorage.setItem('workType', 'heavy') } catch {}; navigate('/find?type=heavy') }} />
            </div>
          <div className="mx-auto max-w-4xl flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 px-3 py-2 shadow-soft">
              <FiSearch className="text-neutral-500" />
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search tailors by name or service" className="flex-1 outline-none bg-transparent" />
            </div>

            <div className="flex items-center gap-2">
              <Chip label="Quick" selected={workType==='quick'} onClick={() => setWorkType('quick')} />
              <Chip label="Heavy" selected={workType==='heavy'} onClick={() => setWorkType('heavy')} />
            </div>
          </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-[420px_1fr] gap-3 flex-1 px-4 pb-4">
          {/* List column */}
          <div className="order-2 md:order-1 mx-auto w-full max-w-6xl md:max-w-none md:mx-0">
            <div className="hidden md:grid gap-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
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
                list.map(t => (
                  <TailorListCard
                    key={t.id}
                    tailor={t}
                    onHover={setHovered}
                    onLeave={()=>setHovered(null)}
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
            {/* Mobile bottom sheet style */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-3">
              <div className="card p-3 shadow-soft">
                <div className="text-sm text-neutral-600 mb-2">Nearby tailors</div>
                <div className="grid gap-3 max-h-[45dvh] overflow-auto">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="card p-4 animate-pulse">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-xl bg-neutral-200" />
                          <div className="flex-1 grid gap-2">
                            <div className="h-4 w-32 bg-neutral-200 rounded" />
                            <div className="h-3 w-48 bg-neutral-200 rounded" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : list.length ? (
                    list.map(t => (
                      <TailorListCard
                        key={t.id}
                        tailor={t}
                        onHover={setHovered}
                        onLeave={()=>setHovered(null)}
                        onOpen={() => navigate(`/tailor/${t.id}`, { state: { tailor: t } })}
                        onBook={() => navigate('/booking', { state: { tailor: t } })}
                      />
                    ))
                  ) : (
                    <div className="text-center text-neutral-600 p-4">No tailors match. Adjust filters or pick another work type.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map column */}
          <div className="order-1 md:order-2">
            <div className="h-[65dvh] md:h-[calc(100dvh-6rem)] rounded-2xl border border-neutral-200 bg-neutral-50 relative">
              <MapPlaceholder className="absolute inset-0 rounded-2xl" />
              {hovered ? (
                <div className="absolute top-3 left-3 bg-white rounded-xl shadow-soft border border-neutral-200 px-3 py-2 text-sm">
                  Highlighting: <span className="font-semibold">{hovered.name}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default FindTailor



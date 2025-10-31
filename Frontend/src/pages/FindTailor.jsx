import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MapPlaceholder from '../components/MapPlaceholder'
import TailorListCard from '../components/TailorListCard'
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
]

const Chip = ({ label, selected, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    whileHover={{ y: -1 }}
    onClick={onClick}
    className={["px-3 py-1.5 rounded-full border text-sm",
      selected ? 'border-[color:var(--color-primary)] text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10' : 'border-neutral-200 hover:border-[color:var(--color-primary)]' ].join(' ')}>
    {label}
  </motion.button>
)

const FindTailor = () => {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ Alteration: false, Stitching: false, Urgent: false })
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

  const activeTags = Object.entries(filters).filter(([,v]) => v).map(([k]) => k)
  const list = useMemo(() => {
    const base = sampleTailors.filter(t =>
      (query ? t.name.toLowerCase().includes(query.toLowerCase()) : true) &&
      (activeTags.length ? activeTags.every(tag => t.tags.includes(tag)) : true)
    )

    return base.map(t => {
      const avg = selectedType === 'heavy' ? t.heavyAvgMins : selectedType === 'light' ? t.lightAvgMins : null
      const etaMinutes = avg != null ? (t.waiting * avg) + avg : undefined
      const availability = t.waiting === 0 ? 'Available' : 'Busy'
      return { ...t, availability, etaMinutes }
    })
  }, [query, activeTags, selectedType])

  // Mock initial loading state
  useEffect(() => {
    const to = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(to)
  }, [])

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 grid grid-rows-[auto_1fr]">
        {/* Floating controls */}
        <div className="z-10 px-4 py-3">
          <div className="mx-auto max-w-6xl flex flex-col gap-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Chip label="Quick Fix" selected={selectedType==='light'} onClick={()=> { try { localStorage.setItem('workType', 'light') } catch {}; navigate('/find?type=light') }} />
              <Chip label="Heavy Tailoring" selected={selectedType==='heavy'} onClick={()=> { try { localStorage.setItem('workType', 'heavy') } catch {}; navigate('/find?type=heavy') }} />
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 px-3 py-2 shadow-soft">
              <FiSearch className="text-neutral-500" />
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search tailors" className="flex-1 outline-none bg-transparent" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {['Alteration','Stitching','Urgent'].map((f) => (
                <Chip key={f} label={f} selected={filters[f]} onClick={()=> setFilters(s => ({...s, [f]: !s[f]}))} />
              ))}
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
                  No tailors match your search. Try changing filters or work type.
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
                    <div className="text-center text-neutral-600 p-4">No tailors found nearby. Adjust filters and try again.</div>
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



import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TailorListCard from '../components/TailorListCard'
import { FiSearch } from 'react-icons/fi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

const FindTailor = () => {
  const [query, setQuery] = useState('')
  const [workType, setWorkType] = useState('quick') // quick | heavy
  const [hovered, setHovered] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tailors, setTailors] = useState([])
  const navigate = useNavigate()
  const [params] = useSearchParams()

  useEffect(() => {
    const fetchTailors = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/tailors', {
          params: { query, workType },
        })
        console.log('API Response:', response.data) // Debugging line

        // Ensure the response is valid and contains an array
        if (response.data && Array.isArray(response.data)) {
          setTailors(response.data)
        } else {
          console.error('Unexpected API response format:', response.data)
          setTailors([]) // Fallback to an empty array
        }
      } catch (error) {
        console.error('Error fetching tailors:', error)
        setTailors([]) // Fallback to an empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchTailors()
  }, [query, workType])

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
          ) : tailors.length ? (
            tailors.map((t) => (
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

export default FindTailor



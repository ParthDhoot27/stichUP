import React from 'react'
import { motion } from 'framer-motion'

const TailorListCard = ({ tailor, onHover, onLeave, onBook, onOpen }) => {
  const {
    name,
    rating,
    reviews,
    distanceKm = 0,
    priceFrom,
    shopPhotoUrl,
    avgQuickMins = 30,
    avgHeavyMins = 120,
    isAvailable = true,
    currentOrders = 0
  } = tailor

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -2 }}
      onMouseEnter={() => onHover?.(tailor)} onMouseLeave={() => onLeave?.(tailor)} onClick={() => onOpen?.(tailor)} className="card p-5 cursor-pointer">
      <div className="flex gap-4">
        <div className="w-28 h-28 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
          {shopPhotoUrl ? <img src={shopPhotoUrl} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm text-neutral-400">No photo</div>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-semibold truncate text-lg">{name}</div>
              <div className="text-sm text-neutral-600 mt-1">{distanceKm} km • From ₹{priceFrom}</div>
            </div>
            <div className="text-right">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-600'}`}>{isAvailable ? 'Open' : 'Closed'}</div>
              <div className="text-sm text-neutral-600 mt-2">{rating} ★</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-xs text-neutral-500">Quick avg</div>
              <div className="font-medium">{avgQuickMins} mins</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500">Heavy avg</div>
              <div className="font-medium">{avgHeavyMins} mins</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500">Current orders</div>
              <div className="font-medium">{currentOrders}</div>
            </div>
          </div>

          <div className="mt-4">
            <button onClick={() => onBook?.(tailor)} className="btn-primary">Book Service</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TailorListCard



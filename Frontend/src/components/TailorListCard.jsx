import React from 'react'
import { motion } from 'framer-motion'

const Tag = ({ children }) => (
  <span className="px-2 py-0.5 rounded-full text-xs border border-neutral-200 bg-neutral-50">{children}</span>
)

const TailorListCard = ({ tailor, onHover, onLeave, onBook, onOpen }) => {
  const { name, rating, reviews, distanceKm, priceFrom, photoUrl, tags = [], availability, waiting, etaMinutes } = tailor
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -2 }}
      onMouseEnter={() => onHover?.(tailor)} onMouseLeave={() => onLeave?.(tailor)} onClick={() => onOpen?.(tailor)} className="card p-4 cursor-pointer">
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
          {photoUrl ? <img src={photoUrl} alt={name} className="w-full h-full object-cover" /> : null}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold truncate">{name}</div>
            <div className="text-sm text-neutral-600 whitespace-nowrap">{rating} ★ ({reviews})</div>
          </div>
          <div className="text-sm text-neutral-600 mt-0.5">{distanceKm} km • From ₹{priceFrom}</div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {availability ? (
              <span className={["px-2 py-0.5 rounded-full text-xs border",
                availability === 'Available' ? 'border-green-300 text-green-700 bg-green-50' : 'border-yellow-300 text-yellow-700 bg-yellow-50'
              ].join(' ')}>{availability === 'Available' ? 'Available now' : 'Busy'}</span>
            ) : null}
            {Number.isFinite(waiting) ? (
              <span className="px-2 py-0.5 rounded-full text-xs border border-neutral-200 bg-neutral-50">In queue: {waiting}</span>
            ) : null}
            {Number.isFinite(etaMinutes) ? (
              <span className="px-2 py-0.5 rounded-full text-xs border border-neutral-200 bg-neutral-50">Est. time: {etaMinutes} min</span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
          </div>
          <div className="mt-3">
            <button onClick={() => onBook?.(tailor)} className="btn-primary">Book Service</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TailorListCard



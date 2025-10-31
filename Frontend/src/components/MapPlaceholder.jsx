import React from 'react'

const MapPlaceholder = ({ className = '' }) => {
  return (
    <div className={["rounded-2xl border border-neutral-200 bg-neutral-50 grid place-items-center text-neutral-500", className].join(' ')}>
      Map placeholder
    </div>
  )
}

export default MapPlaceholder



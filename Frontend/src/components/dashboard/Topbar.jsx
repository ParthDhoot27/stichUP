import React from 'react'
import { FiBell, FiSearch } from 'react-icons/fi'

const Topbar = () => {
  return (
    <div className="sticky top-0 z-30 h-14 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="px-4 h-full flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 bg-white rounded-xl border border-neutral-200 px-3 py-2 w-80">
          <FiSearch className="text-neutral-500" />
          <input placeholder="Search orders" className="flex-1 outline-none bg-transparent" />
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded-lg hover:bg-neutral-100"><FiBell /></button>
          <div className="h-8 w-8 rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  )
}

export default Topbar



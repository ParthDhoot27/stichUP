import React from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'

const TailorLayout = ({ children }) => {
  return (
    <div className="min-h-dvh grid md:grid-cols-[16rem_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Topbar />
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default TailorLayout



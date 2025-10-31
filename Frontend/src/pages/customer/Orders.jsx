import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const CustomerOrders = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-6">My Orders</h1>
            <div className="text-neutral-600">No orders yet</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CustomerOrders


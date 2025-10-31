import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

const Categories = () => {
  const navigate = useNavigate()

  const categories = [
    { id: 'shirt', name: 'Shirt', image: '/shirt.jpg' },
    { id: 'pant', name: 'Pant', image: '/pant.jpg' },
    { id: 'jacket', name: 'Jacket', image: '/jacket.jpg' },
    { id: 'kurta', name: 'Kurta', image: '/kurta.jpg' },
    { id: 'dress', name: 'Dress', image: '/dress.jpg' },
    { id: 'saree', name: 'Saree', image: '/saree.jpg' },
    { id: 'other', name: 'Other', image: '/other.jpg' },
  ]

  const handleCategorySelect = (categoryId) => {
    try {
      localStorage.setItem('selectedCategory', categoryId)
    } catch {}
    navigate(`/quick-fix-options?category=${categoryId}`)
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">Select Category</h1>
            <div className="text-neutral-600 mb-6">Choose the type of garment you need help with</div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="rounded-xl border border-neutral-200 overflow-hidden text-left hover:border-[color:var(--color-primary)] transition-all hover:shadow-md"
                >
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="text-lg font-semibold">{category.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Categories


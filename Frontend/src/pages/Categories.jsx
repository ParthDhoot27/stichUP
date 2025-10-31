import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate, useParams } from 'react-router-dom'

const Categories = () => {
  const navigate = useNavigate()
  const { type } = useParams()

  // Quick fix categories - for simple repairs and alterations
  const quickFixCategories = [
    { id: 'shirt', name: 'Shirt', image: '/shirt.jpg' },
    { id: 'pant', name: 'Pant', image: '/pant.jpg' },
    { id: 'jacket', name: 'Jacket', image: '/jacket.jpg' },
    { id: 'kurta', name: 'Kurta', image: '/kurta.jpg' },
    { id: 'dress', name: 'Dress', image: '/dress.jpg' },
    { id: 'saree', name: 'Saree', image: '/saree.jpg' },
    { id: 'other', name: 'Other', image: '/other.jpg' },
  ]

  // Heavy tailoring categories - for new garments and complex work
  const heavyTailoringCategories = [
    { id: 'suit', name: 'Suit', image: '/suit.jpg' },
    { id: 'blazer', name: 'Blazer', image: '/blazer.jpg' },
    { id: 'coat', name: 'Coat', image: '/coat.jpg' },
    { id: 'dress', name: 'Dress', image: '/dress.jpg' },
    { id: 'sherwani', name: 'Sherwani', image: '/sherwani.jpg' },
    { id: 'lehenga', name: 'Lehenga', image: '/lehenga.jpg' },
    { id: 'saree', name: 'Saree', image: '/saree.jpg' },
    { id: 'traditional', name: 'Traditional', image: '/traditional.jpg' },
    { id: 'other', name: 'Other', image: '/other.jpg' },
  ]

  // Use appropriate categories based on type
  const categories = type === 'heavy-tailoring' ? heavyTailoringCategories : quickFixCategories

  const handleCategorySelect = (categoryId) => {
    try {
      localStorage.setItem('selectedCategory', categoryId)
    } catch {}
    
    // Navigate based on type: quick-fix goes to quick-fix-options, heavy-tailoring goes to find
    if (type === 'heavy-tailoring') {
      try {
        localStorage.setItem('workType', 'heavy')
      } catch {}
      navigate(`/find?type=heavy&category=${categoryId}`)
    } else {
      // Default to quick-fix behavior
      navigate(`/quick-fix-options?category=${categoryId}`)
    }
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


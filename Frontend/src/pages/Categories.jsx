import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate, useParams } from 'react-router-dom'

const Categories = () => {
  const navigate = useNavigate()
  const { type } = useParams()

  // Quick fix categories - for simple repairs and alterations
  const quickFixCategories = [
    { id: 'shirt', name: 'Shirt', image: '/categories/shirt.png' },
    { id: 'pant', name: 'Pant', image: '/categories/pants.png' },
    { id: 'jacket', name: 'Jacket', image: '/categories/jacket.png' },
    { id: 'kurta', name: 'Kurta', image: '/categories/kurta.png' },
    { id: 'dress', name: 'Dress', image: '/categories/dress.png' },
    { id: 'saree', name: 'Saree', image: '/categories/saree.png' },
    { id: 'other', name: 'Other', image: '/categories/others.png' },
  ]

  // Heavy tailoring categories - for new garments and complex work
  const heavyTailoringCategories = [
    { id: 'suit', name: 'Suit', image: '/categories/jacket.png' }, // Using jacket image for suit
    { id: 'blazer', name: 'Blazer', image: '/categories/jacket.png' },
    { id: 'coat', name: 'Coat', image: '/categories/jacket.png' },
    { id: 'dress', name: 'Dress', image: '/categories/dress.png' },
    { id: 'sherwani', name: 'Sherwani', image: '/categories/kurta.png' }, // Using kurta image for sherwani
    { id: 'lehenga', name: 'Lehenga', image: '/categories/dress.png' }, // Using dress image for lehenga
    { id: 'saree', name: 'Saree', image: '/categories/saree.png' },
    { id: 'traditional', name: 'Traditional', image: '/categories/kurta.png' }, // Using kurta image for traditional
    { id: 'other', name: 'Other', image: '/categories/others.png' },
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

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="rounded-xl border border-neutral-200 overflow-hidden text-left hover:border-[color:var(--color-primary)] transition-all hover:shadow-md flex flex-col h-full"
                >
                  <div className="flex-1 min-h-[200px] overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
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


'use client'

import { useState, useEffect } from 'react'
import PricingCard from './PricingCard'
import { Euro } from 'lucide-react'

interface PricingItem {
  id: string
  serviceName: string
  price: string
  description?: string
  order: number
  isActive: boolean
}

interface ServicePricing {
  id: string
  title: string
  serviceId: string
  order: number
  isActive: boolean
  service: {
    title: string
    slug: string
  }
  pricingItems: PricingItem[]
}

interface PricingSectionProps {
  serviceId?: string // Optional: to show pricing for specific service only
  className?: string
}

export default function PricingSection({ serviceId, className }: PricingSectionProps) {
  const [pricingData, setPricingData] = useState<ServicePricing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPricingData()
  }, [serviceId])

  const fetchPricingData = async () => {
    try {
      const url = serviceId
        ? `/api/pricing?serviceId=${serviceId}`
        : '/api/pricing'

      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        setPricingData(data)
      } else {
        console.error('Failed to fetch pricing data')
      }
    } catch (error) {
      console.error('Error fetching pricing:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className={`py-12 md:py-16 bg-gradient-to-b from-white to-gray-50/50 ${className || ''}`}>
        <div className="max-w-[1250px] mx-auto px-4 text-center">
          <div className="animate-pulse">Ielādē cenrādi...</div>
        </div>
      </section>
    )
  }

  if (pricingData.length === 0) {
    return null // Don't render anything if no pricing data
  }

  return (
    <section className={`py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50/50 ${className || ''}`}>
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-optimized Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <div className="flex justify-center mb-3 sm:mb-4">
  <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#B7AB96]/10 text-[#706152]">
    <Euro size={14} className="sm:w-4 sm:h-4" />
    <span className="text-xs sm:text-sm font-medium">Cenrādis</span>
  </div>
</div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#706152] mb-3 sm:mb-4 leading-none px-2 flex justify-center items-center">
            Mūsu cenas
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#706152] max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4">
            Apskatiet mūsu pakalpojumu cenas un izvēlieties sev piemērotāko
          </p>
        </div>

        {/* Mobile-optimized Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {pricingData.map((pricing) => (
            <PricingCard
              key={pricing.id}
              title={pricing.title}
              items={pricing.pricingItems}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
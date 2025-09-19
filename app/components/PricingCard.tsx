'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Euro } from 'lucide-react'
import { clsx } from 'clsx'

interface PricingItem {
  id?: string
  service?: string
  serviceName?: string
  price: string
  description?: string
  order?: number
}

interface PricingCardProps {
  title: string
  items: PricingItem[]
  className?: string
}

export default function PricingCard({ title, items, className }: PricingCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={clsx(
      "relative bg-gradient-to-br from-white via-gray-50/30 to-white rounded-xl sm:rounded-2xl lg:rounded-[28px] border border-gray-100/50 shadow-lg hover:shadow-xl hover:shadow-[#B7AB96]/10 transition-all duration-500 overflow-hidden w-full",
      className
    )}>
      {/* Mobile-optimized Floating Background Elements */}
      <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 lg:-top-10 lg:-right-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-[#B7AB96]/5 rounded-full blur-xl sm:blur-2xl"></div>
      <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 lg:-bottom-8 lg:-left-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-20 lg:h-20 bg-[#706152]/5 rounded-full blur-lg sm:blur-xl"></div>

      <div
        className="w-full hover:bg-gradient-to-r hover:from-[#B7AB96]/5 hover:to-transparent transition-all duration-300 cursor-pointer active:bg-[#B7AB96]/5"
        onClick={toggleDropdown}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#706152] transition-colors duration-300">
            {title}
          </h3>
          
          {/* Simplified structure - removed pointer-events-none and complex flex wrapper */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gray-100 hover:bg-gradient-to-br hover:from-[#B7AB96] hover:to-[#706152] flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-sm">
            {isOpen ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#706152] hover:text-white transition-colors duration-300" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#706152] hover:text-white transition-colors duration-300" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile-optimized Dropdown Content */}
      {isOpen && (
        <div className="px-3 pb-4 sm:px-4 sm:pb-5 lg:px-6 lg:pb-6 animate-fade-in">
          {/* Mobile-optimized Headers */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-[#B7AB96]/10 rounded-lg sm:rounded-xl mb-3 sm:mb-4 border border-[#B7AB96]/20">
            <h4 className="font-bold text-[#706152] text-xs sm:text-sm lg:text-base">
              Pakalpojums
            </h4>
            <h4 className="font-bold text-[#706152] text-xs sm:text-sm lg:text-base">
              Cena
            </h4>
          </div>

          {/* Mobile-optimized Items */}
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className={clsx(
                  "flex items-center justify-between p-3 sm:p-4 bg-white/70 rounded-lg sm:rounded-xl border border-[#B7AB96]/10 hover:border-[#B7AB96]/30 transition-all duration-300",
                  "hover:shadow-md hover:bg-gradient-to-r hover:from-white hover:to-[#B7AB96]/5 active:scale-[0.98]"
                )}
              >
                {/* Left: Service info */}
                <div className="flex-1 pr-3">
                  <h4 className="font-semibold text-[#706152] text-xs sm:text-sm lg:text-base leading-tight">
                    {item.serviceName || item.service}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-[#706152]/70 leading-relaxed mt-1">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Right: Price badge */}
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-3 py-1.5 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-[#B7AB96] to-[#a59885] text-white font-semibold rounded-full text-xs sm:text-sm lg:text-base shadow-md">
                    <span className="tabular-nums">
                      {item.price.replace(/[€]/g, '').trim()}
                    </span>
                    <Euro className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-8 h-8 md:w-16 md:h-16 bg-gradient-to-bl from-[#B7AB96]/10 to-transparent rounded-bl-xl md:rounded-bl-3xl rounded-tr-[16px] md:rounded-tr-[28px] pointer-events-none"></div>
    </div>
  )
}

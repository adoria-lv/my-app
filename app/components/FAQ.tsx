// components/ui/FAQ.tsx
'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Plus, Minus, HelpCircle, Phone, Search, Sparkles, MessageCircle, Clock, Heart, Euro, X } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
  icon: string
  order: number
  isActive: boolean
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Clock': return <Clock className="w-5 h-5" />
    case 'MessageCircle': return <MessageCircle className="w-5 h-5" />
    case 'Sparkles': return <Sparkles className="w-5 h-5" />
    case 'Heart': return <Heart className="w-5 h-5" />
    case 'Euro': return <Euro className="w-5 h-5" />
    case 'HelpCircle':
    default: return <HelpCircle className="w-5 h-5" />
  }
}

export default function FAQ() {
  const [faqData, setFaqData] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/faq', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFaqData(data)
        // Open first FAQ by default
        if (data.length > 0) {
          setOpenItems(new Set([data[0].id]))
        }
      } else {
        // Fallback data if API fails
        setFaqData([
          {
            id: '1',
            question: 'Kā pieteikt vizīti mūsu veselības centrā?',
            answer: 'Ātri un ērti iespējams pieteikt vizīti zvanot pa tālruni +371 67315000, tāču iespējams izmantot arī iespēju pieteikt vizīti mūsu mājas lapā, aizpildot pieteikuma anketu, kurā iespējams norādīt sev vēlamo laiku un datumu.',
            category: 'Pieteikšanās',
            icon: 'Clock',
            order: 1,
            isActive: true
          }
        ])
        setOpenItems(new Set(['1']))
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      // Fallback data
      setFaqData([])
    } finally {
      setLoading(false)
    }
  }

  const categories = [...new Set(faqData.map(item => item.category).filter(Boolean))]

  const toggleItem = (id: string) => {
    if (openItems.has(id)) {
      setOpenItems(new Set())
    } else {
      setOpenItems(new Set([id]))
    }
  }

  const filteredFAQ = faqData
    .filter(item => selectedCategory ? item.category === selectedCategory : true)
    .filter(item => searchTerm ?
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    )

  if (loading) {
    return (
      <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-br from-slate-50 via-white to-gray-50/30 relative overflow-hidden">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-br from-slate-50 via-white to-gray-50/30 relative overflow-hidden">
      {/* Optimized Background decorations for mobile */}
      <div className="absolute inset-0">
        <div className="absolute top-8 left-4 sm:top-16 sm:left-8 lg:top-20 lg:left-20 w-24 h-24 sm:w-32 sm:h-32 lg:w-80 lg:h-80 bg-gradient-to-br from-[#B7AB96]/8 to-[#706152]/5 rounded-full blur-2xl lg:blur-3xl" />
        <div className="absolute bottom-8 right-4 sm:bottom-16 sm:right-8 lg:bottom-20 lg:right-20 w-28 h-28 sm:w-36 sm:h-36 lg:w-96 lg:h-96 bg-gradient-to-tl from-[#706152]/6 to-[#B7AB96]/8 rounded-full blur-2xl lg:blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 sm:w-24 sm:h-24 lg:w-64 lg:h-64 bg-[#B7AB96]/4 rounded-full blur-xl lg:blur-2xl" />
      </div>

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile-optimized Header */}
        <div className="text-center mb-6">
        <div className="section-badge">
            <HelpCircle />
            <span className="text-sm sm:text-base">Biežāk uzdotie jautājumi</span>
          </div>
          <h2 className="section-heading">
            Jūsu jautājumi,<br className="sm:hidden" /> mūsu atbildes
          </h2>
          <p className="section-subheading">
            Atrodiet atbildes uz populārākajiem jautājumiem par mūsu pakalpojumiem. 
            Ja neatrodat vajadzīgo informāciju, sazinieties ar mums.
          </p>
        </div>

        {/* Mobile-optimized Search Bar */}
        <div className="max-w-xl lg:max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="relative group">
            <HelpCircle className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-[#706152] w-5 h-5 group-hover:text-[#B7AB96] transition-colors duration-300 z-10 pointer-events-none" />
            <input
              type="text"
              placeholder="Meklēt jautājumus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 sm:pl-14 pr-12 h-12 rounded-xl bg-gray-50/50 border border-gray-200 focus:bg-white hover:bg-white shadow-sm hover:shadow-md focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:border-[#B7AB96] transition-all duration-300 font-medium text-sm sm:text-base placeholder:text-gray-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center transition-colors duration-200 z-10"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile-first Layout */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8">
          
          {/* Mobile-optimized Categories & Contact */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            
            {/* Category Filter - Mobile Horizontal Scroll */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-2xl p-4 lg:p-6 shadow-xl border border-gray-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#B7AB96] to-[#706152] flex items-center justify-center shadow-lg">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#706152] text-base sm:text-lg">Kategorijas</h3>
              </div>
              
              {/* Mobile: Horizontal scroll, Desktop: Vertical stack */}
              <div className="lg:space-y-3">
                {/* Mobile horizontal scroll container */}
                <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={clsx(
                      "flex-shrink-0 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm whitespace-nowrap min-h-[44px] flex items-center",
                      selectedCategory === null
                        ? "bg-[#B7AB96] text-white shadow-lg"
                        : "bg-gray-100 text-[#706152] hover:bg-gray-200"
                    )}
                  >
                    Visi
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category || null)}
                      className={clsx(
                        "flex-shrink-0 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm whitespace-nowrap min-h-[44px] flex items-center",
                        selectedCategory === category
                          ? "bg-[#B7AB96] text-white shadow-lg"
                          : "bg-gray-100 text-[#706152] hover:bg-gray-200"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                {/* Desktop vertical stack */}
                <div className="hidden lg:block space-y-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={clsx(
                      "w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all duration-300 min-h-[44px]",
                      selectedCategory === null
                        ? "bg-[#B7AB96] text-white shadow-xl"
                        : "bg-gray-100 text-[#706152] hover:bg-gray-200 hover:shadow-lg"
                    )}
                  >
                    Visi jautājumi
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category || null)}
                      className={clsx(
                        "w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all duration-300 min-h-[44px]",
                        selectedCategory === category
                          ? "bg-[#B7AB96] text-white shadow-xl"
                          : "bg-gray-100 text-[#706152] hover:bg-gray-200 hover:shadow-lg"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile-optimized Contact Card */}
            <div className="bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-2xl lg:rounded-2xl p-4 lg:p-6 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-2xl translate-x-6 -translate-y-6" />
              <div className="relative z-10">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-2xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-4 shadow-lg">
                  <Phone className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <h4 className="font-bold text-lg lg:text-xl mb-2 lg:mb-3 text-white">Neatradāt atbildi?</h4>
                <p className="text-white/90 mb-4 lg:mb-6 leading-relaxed text-sm lg:text-base">
                  Zvaniet mums, un mēs atbildēsim uz visiem jūsu jautājumiem
                </p>
                <a 
                  href="tel:+37167315000"
                  className="w-full bg-white text-[#706152] text-center py-3 lg:py-4 rounded-xl lg:rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg text-base min-h-[44px] flex items-center justify-center"
                >
                  +371 67 315 000
                </a>
              </div>
            </div>
          </div>

          {/* Mobile-optimized FAQ Items */}
          <div className="lg:col-span-3">
            <div className="space-y-3 sm:space-y-4">
              {filteredFAQ.map((item, index) => (
                <div
                  key={item.id}
                  className={clsx(
                    "bg-white/90 backdrop-blur-sm rounded-2xl lg:rounded-2xl shadow-lg border border-gray-100/60 overflow-hidden transition-all duration-500 hover:shadow-xl",
                    openItems.has(item.id) && "shadow-xl border-[#B7AB96]/20"
                  )}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-4 lg:p-6 text-left flex items-start justify-between hover:bg-gray-50/50 transition-all duration-300 group min-h-[44px]"
                  >
                    <div className="flex items-start gap-3 lg:gap-4 flex-1 pr-3">
                      {/* Mobile-optimized Icon Badge */}
                      <div className={clsx(
                        "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg flex-shrink-0",
                        openItems.has(item.id)
                          ? "bg-gradient-to-br from-[#B7AB96] to-[#706152] text-white shadow-xl transform scale-105"
                          : "bg-gray-100 text-[#706152] group-hover:bg-gradient-to-br group-hover:from-[#B7AB96] group-hover:to-[#706152] group-hover:text-white group-hover:shadow-xl group-hover:scale-105"
                      )}>
                        {getIconComponent(item.icon)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-[#706152] group-hover:text-[#B7AB96] transition-colors duration-300 mb-2 lg:mb-3 leading-tight">
                          {item.question}
                        </h3>
                        {item.category && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 lg:px-3 lg:py-1.5 bg-gradient-to-r from-[#B7AB96]/10 to-[#706152]/10 text-[#706152] text-xs font-semibold rounded-full border border-[#B7AB96]/20">
                            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#B7AB96] rounded-full" />
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mobile-optimized Toggle Icon */}
                    <div className={clsx(
                      "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg flex-shrink-0",
                      openItems.has(item.id) 
                        ? "bg-gradient-to-br from-[#B7AB96] to-[#706152] rotate-180 shadow-xl scale-105" 
                        : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-[#B7AB96] group-hover:to-[#706152] group-hover:shadow-xl group-hover:scale-105"
                    )}>
                      {openItems.has(item.id) ? (
                        <Minus className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      ) : (
                        <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-[#706152] group-hover:text-white transition-colors duration-300" />
                      )}
                    </div>
                  </button>

                  {openItems.has(item.id) && (
                    <div className="px-4 pb-4 lg:px-6 lg:pb-6 animate-fade-in">
                      <div className="pr-3 lg:pr-6">
                        <div className="bg-gradient-to-r from-gray-50/80 to-transparent rounded-xl lg:rounded-xl px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6 shadow-inner">
                        <p className="text-[#706152] leading-relaxed text-xs sm:text-sm lg:text-base text-center sm:text-justify">
                          {item.answer}
                        </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQ.length === 0 && (
              <div className="text-center py-8 lg:py-10">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 lg:w-8 lg:h-8 text-[#706152]" />
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-[#706152] mb-2">Nav atrasti jautājumi</h3>
                <p className="text-[#706152] text-sm lg:text-base px-4">Mēģiniet mainīt meklēšanas kritērijus vai kategoriju</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

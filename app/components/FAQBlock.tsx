'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Plus, Minus, HelpCircle, Clock, MessageCircle, Sparkles, Heart, Euro } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  icon: string
  order: number
  isActive: boolean
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'HelpCircle':
      return <HelpCircle className="w-5 h-5" />
    case 'Clock':
      return <Clock className="w-5 h-5" />
    case 'MessageCircle':
      return <MessageCircle className="w-5 h-5" />
    case 'Sparkles':
      return <Sparkles className="w-5 h-5" />
    case 'Heart':
      return <Heart className="w-5 h-5" />
    case 'Euro':
      return <Euro className="w-5 h-5" />
    default:
      return <HelpCircle className="w-5 h-5" />
  }
}

interface FAQBlockProps {
  apiEndpoint?: string // Custom API endpoint for service-specific FAQs
}

export default function FAQBlock({ apiEndpoint = '/api/faq' }: FAQBlockProps) {
  const [faqData, setFaqData] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchFAQs()
  }, [apiEndpoint])

  const fetchFAQs = async () => {
    try {
      const response = await fetch(apiEndpoint, {
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
        if (data.length > 0) {
          setOpenItems(new Set([data[0].id]))
        }
      } else {
        setFaqData([
          {
            id: '1',
            question: 'Kā pieteikt vizīti mūsu veselības centrā?',
            answer: 'Ātri un ērti iespējams pieteikt vizīti zvanot pa tālruni +371 67315000, tāču iespējams izmantot arī iespēju pieteikt vizīti mūsu mājas lapā, aizpildot pieteikuma anketu, kurā iespējams norādīt sev vēlamo laiku un datumu.',
            icon: 'HelpCircle',
            order: 1,
            isActive: true
          }
        ])
        setOpenItems(new Set(['1']))
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      setFaqData([])
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (id: string) => {
    if (openItems.has(id)) {
      setOpenItems(new Set())
    } else {
      setOpenItems(new Set([id]))
    }
  }

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
      <div className="absolute inset-0">
        <div className="absolute top-8 left-4 sm:top-16 sm:left-8 lg:top-20 lg:left-20 w-24 h-24 sm:w-32 sm:h-32 lg:w-80 lg:h-80 bg-gradient-to-br from-[#B7AB96]/8 to-[#706152]/5 rounded-full blur-2xl lg:blur-3xl" />
        <div className="absolute bottom-8 right-4 sm:bottom-16 sm:right-8 lg:bottom-20 lg:right-20 w-28 h-28 sm:w-36 sm:h-36 lg:w-96 lg:h-96 bg-gradient-to-tl from-[#706152]/6 to-[#B7AB96]/8 rounded-full blur-2xl lg:blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 sm:w-24 sm:h-24 lg:w-64 lg:h-64 bg-[#B7AB96]/4 rounded-full blur-xl lg:blur-2xl" />
      </div>

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-3 sm:space-y-4">
            {faqData.map((item) => (
              <div
                key={item.id}
                className={clsx(
                  "bg-white/90 backdrop-blur-sm rounded-2xl lg:rounded-2xl shadow-lg border border-gray-100/60 overflow-hidden transition-all duration-500 hover:shadow-xl",
                  openItems.has(item.id) && "shadow-xl border-[#B7AB96]/20"
                )}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-4 lg:p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-all duration-300 group min-h-[44px]"
                >
                  <div className="flex items-center gap-3 lg:gap-4 flex-1 pr-3">
                    <div className={clsx(
                      "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg flex-shrink-0",
                      openItems.has(item.id)
                        ? "bg-gradient-to-br from-[#B7AB96] to-[#706152] text-white shadow-xl transform scale-105"
                        : "bg-gray-100 text-[#706152] group-hover:bg-gradient-to-br group-hover:from-[#B7AB96] group-hover:to-[#706152] group-hover:text-white group-hover:shadow-xl group-hover:scale-105"
                    )}>
                      {getIconComponent(item.icon)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-[#706152] group-hover:text-[#B7AB96] transition-colors duration-300 leading-tight">
                        {item.question}
                      </h3>
                    </div>
                  </div>

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

          {faqData.length === 0 && (
            <div className="text-center py-8 lg:py-10">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6 lg:w-8 lg:h-8 text-[#706152]" />
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-[#706152] mb-2">Nav atrasti jautājumi</h3>
              <p className="text-[#706152] text-sm lg:text-base px-4">Pašlaik nav pieejami jautājumi</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
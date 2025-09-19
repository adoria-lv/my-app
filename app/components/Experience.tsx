'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Phone, Users, Award, Heart, Check } from 'lucide-react'
import Image from 'next/image'
import AppointmentDialog from './AppointmentDialog'

interface Stat {
  id: string
  title: string
  number: number
  suffix: string
  label: string
  iconType: string
  color: string
  order: number
  isActive: boolean
}

interface ContentData {
  id: string
  headerTitle: string
  headerSubtitle: string
  description: string
  companyName: string
  image: string
  rating: string
  address: string
  email: string
  phone: string
  isActive: boolean
}

const getIconByType = (type: string) => {
  switch (type) {
    case 'experience': return <Check className="w-5 h-5 md:w-6 md:h-6" />
    case 'patients': return <Users className="w-5 h-5 md:w-6 md:h-6" />
    case 'specialists': return <Award className="w-5 h-5 md:w-6 md:h-6" />
    case 'services': return <Heart className="w-5 h-5 md:w-6 md:h-6" />
    default: return <Check className="w-5 h-5 md:w-6 md:h-6" />
  }
}

export default function Experience() {
  const [stats, setStats] = useState<Stat[]>([])
  const [content, setContent] = useState<ContentData | null>(null)
  const [animatedNumbers, setAnimatedNumbers] = useState<Record<string, number>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsResponse, contentResponse] = await Promise.all([
        fetch('/api/experience-stats', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }),
        fetch('/api/experience-content', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
      ])
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
        // Initialize animated numbers to 0 for all stats
        const initialNumbers: Record<string, number> = {}
        statsData.forEach((stat: Stat) => {
          initialNumbers[stat.id] = 0
        })
        setAnimatedNumbers(initialNumbers)
      } else {
        // Fallback data
        setStats([
          {
            id: 'experience',
            title: 'Gadu pieredze',
            number: 18,
            suffix: '+',
            label: 'Gadu pieredze',
            iconType: 'experience',
            color: 'from-[#B7AB96] to-[#a59885]',
            order: 1,
            isActive: true
          },
          {
            id: 'patients',
            title: 'Apmierināti pacienti',
            number: 15000,
            suffix: '+',
            label: 'Apmierināti pacienti',
            iconType: 'patients',
            color: 'from-[#a59885] to-[#706152]',
            order: 2,
            isActive: true
          },
          {
            id: 'specialists',
            title: 'Speciālisti',
            number: 25,
            suffix: '+',
            label: 'Speciālisti',
            iconType: 'specialists',
            color: 'from-[#706152] to-[#5f5449]',
            order: 3,
            isActive: true
          },
          {
            id: 'services',
            title: 'Pakalpojumi',
            number: 50,
            suffix: '+',
            label: 'Pakalpojumi',
            iconType: 'services',
            color: 'from-[#B7AB96] to-[#706152]',
            order: 4,
            isActive: true
          }
        ])
        // Initialize animated numbers for fallback data
        const fallbackNumbers: Record<string, number> = {
          'experience': 0,
          'patients': 0,
          'specialists': 0,
          'services': 0
        }
        setAnimatedNumbers(fallbackNumbers)
      }
      
      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setContent(contentData)
      } else {
        // Fallback content
        setContent({
          id: 'default',
          headerTitle: 'Kāpēc izvēlēties Adoria?',
          headerSubtitle: 'Ar 15+ gadu pieredzi veselības aprūpē, mēs esam kļuvuši par uzticamu partneri jūsu un jūsu ģimenes veselības jautājumos',
          description: 'ir ar pretīmnākošu attieksmi pret klientu un sniedz augstas kvalitātes medicīniskos pakalpojumus, pašā Rīgas centrā',
          companyName: 'Veselības un skaistuma centrs Adoria',
          image: '/experience.webp',
          rating: '4.6',
          address: 'A. Čaka iela 70-3',
          email: 'info@adoria.lv',
          phone: '+371 67 315 000',
          isActive: true
        })
      }
    } catch (error) {
      console.error('Error fetching experience data:', error)
    }
  }

  // Animation trigger logic
  useEffect(() => {
    if (!stats.length) return

    const startAnimation = () => {
      if (isVisible) return // Don't restart if already animated

      setIsVisible(true)

      // Animate each number with smooth easing
      stats.forEach((stat, index) => {
        const startTime = Date.now()
        const duration = 1200 // 1.2 seconds
        const delay = index * 100 // Stagger animation slightly

        const animateNumber = () => {
          const elapsed = Date.now() - startTime - delay

          if (elapsed < 0) {
            requestAnimationFrame(animateNumber)
            return
          }

          if (elapsed < duration) {
            // Ease out cubic function for smooth animation
            const progress = elapsed / duration
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const currentValue = Math.floor(stat.number * easeOut)

            setAnimatedNumbers(prev => ({ ...prev, [stat.id]: currentValue }))
            requestAnimationFrame(animateNumber)
          } else {
            setAnimatedNumbers(prev => ({ ...prev, [stat.id]: stat.number }))
          }
        }

        requestAnimationFrame(animateNumber)
      })
    }

    // Try intersection observer first
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation()
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '100px 0px'
      }
    )

    const element = document.getElementById('experience-section')
    if (element) {
      observer.observe(element)
    }

    // Fallback: start animation after a delay if observer fails
    const fallbackTimer = setTimeout(() => {
      if (!isVisible) {
        console.log('Fallback animation triggered')
        startAnimation()
      }
    }, 2000)

    // Also try to start immediately if element is already visible
    setTimeout(() => {
      if (element && !isVisible) {
        const rect = element.getBoundingClientRect()
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
        if (isInViewport) {
          startAnimation()
        }
      }
    }, 500)

    return () => {
      observer.disconnect()
      clearTimeout(fallbackTimer)
    }
  }, [stats, isVisible])

  if (!content) return null

  return (
    <section
      id="experience-section"
      className="py-8 md:py-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 25%, #f8f9fa 75%, #f1f3f4 100%)'
      }}
    >
      <div className="max-w-[1250px] mx-auto px-4">

        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8">
        <div className="section-badge">
            <Award />
            Mūsu pieredze
          </div>
          <h2 className="section-heading">
            {content.headerTitle}
          </h2>
          <p className="section-subheading">
            {content.headerSubtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">

          {/* Left - Content */}
          <div className="space-y-4 md:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {stats.map((stat, index) => (
                <div
                  key={stat.id}
                  className="group bg-white rounded-lg p-3 md:p-4 border border-gray-100 hover:border-[#B7AB96]/30 hover:shadow-xl hover:shadow-[#B7AB96]/10 transition-all duration-500 md:hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-1 md:mb-2 rounded-lg bg-[#B7AB96]/10 flex items-center justify-center group-hover:bg-[#B7AB96] transition-all duration-300 md:group-hover:scale-110">
                      <div className="transition-all duration-300 group-hover:text-white text-[#B7AB96] scale-75 md:scale-100">
                        {getIconByType(stat.iconType)}
                      </div>
                    </div>
                    <div className="text-lg md:text-xl font-bold text-[#706152] group-hover:text-[#B7AB96] transition-colors mb-0.5">
                      {isVisible ? (animatedNumbers[stat.id] !== undefined ? animatedNumbers[stat.id] : stat.number) : 0}{stat.suffix}
                    </div>
                    <div className="text-[10px] md:text-xs text-[#706152] font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Image for mobile only */}
            <div className="block lg:hidden relative mt-3 rounded-2xl overflow-hidden shadow-xl group h-[300px] md:h-[350px]">
              <Image
                src={content.image}
                alt="Adoria interjers"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Floating elements - Responsive */}
              <div className="absolute top-3 right-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 md:p-3 shadow-lg">
                  <div className="text-center">
                    <div className="text-sm md:text-lg font-bold text-[#B7AB96] mb-0.5">{content.rating} ★</div>
                    <div className="text-[10px] md:text-xs text-[#706152]">Kopējais novērtējums</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 md:p-3 shadow-lg">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#B7AB96] rounded-lg flex items-center justify-center">
                      <Heart size={16} className="md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#706152] text-xs md:text-sm truncate">{content.address}</div>
                      <div className="text-[#706152] text-xs md:text-sm">
                        <a href={`mailto:${content.email}`} className="hover:text-[#B7AB96] transition-colors">{content.email}</a>
                        <span> / </span>
                        <a href={`tel:${content.phone.replace(/\s/g, '')}`} className="hover:text-[#B7AB96] transition-colors">{content.phone}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-[#B7AB96]/5 to-transparent rounded-lg md:rounded-xl p-3 md:p-4 border-l-4 border-[#B7AB96]">
              <h3 className="text-base md:text-lg font-bold text-[#706152] mb-1 md:mb-2">{content.companyName}</h3>
              <p className="text-[#706152] leading-relaxed text-xs md:text-sm">
                {content.description}
              </p>
            </div>

            {/* Contact CTA */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <AppointmentDialog>
                <button className="flex-1 bg-[#B7AB96] text-white font-semibold py-2 md:py-3 px-3 md:px-4 rounded-lg hover:bg-[#a59885] transition-colors text-xs md:text-sm">
                  Pieteikt vizīti
                </button>
              </AppointmentDialog>
              <button className="flex-1 border-2 border-[#B7AB96] text-[#B7AB96] font-semibold py-2 md:py-3 px-3 md:px-4 rounded-lg hover:bg-[#B7AB96] hover:text-white transition-all text-xs md:text-sm">
                Sazināties
              </button>
            </div>
          </div>

          {/* Right - Large Image for desktop only */}
          <div className="relative mt-6 lg:mt-0 lg:block hidden rounded-2xl overflow-hidden shadow-xl group h-[350px] md:h-[400px] lg:h-[500px]">
            <Image
              src={content.image}
              alt="Adoria interjers"
              fill
              sizes="(max-width: 1024px) 0vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Floating elements - Responsive */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold text-[#B7AB96] mb-1">{content.rating} ★</div>
                  <div className="text-xs text-[#706152]">Kopējais novērtējums</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 shadow-lg">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-[#B7AB96] rounded-lg md:rounded-xl flex items-center justify-center">
                    <Heart size={20} className="md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#706152] text-sm md:text-lg">{content.address}</div>
                    <div className="text-[#706152] text-sm md:text-base">
                      <a href={`mailto:${content.email}`} className="hover:text-[#B7AB96] transition-colors">{content.email}</a>
                      <span> / </span>
                      <a href={`tel:${content.phone.replace(/\s/g, '')}`} className="hover:text-[#B7AB96] transition-colors">{content.phone}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

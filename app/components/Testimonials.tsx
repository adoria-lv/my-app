// Testimonials.tsx - TIKAI datubāzes integrācija, dizainu nemainu!
'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { ChevronLeft, ChevronRight, Quote, Star, Heart, Award, UserStar } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  avatar?: string
  service?: string
  date: string
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visibleTestimonials, setVisibleTestimonials] = useState<number[]>([])
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      } else {
        // Fallback data ja API neatbild
        setTestimonials([
          {
            id: '1',
            name: 'Laura Berkmane',
            text: 'Pirmo reizi aizvedu savu meitu pie zobu higiēnistes Anitas Preisas. Super attieksme un pieja 💯, šādu meistarību vairāk. 😊 Palēies lielisks darbs 👍😊',
            rating: 5,
            avatar: '/avatars/laura-b.jpg',
            service: 'Zobārstniecība',
            date: '2025-08-15'
          },
          {
            id: '2',
            name: 'Arita Janauska',
            text: 'Varu teikt tikai to pašu labāko. Laipna apkalpošana, personāls lielisks. Bērnu zobārsts dr. Reihs 👍 izsaku viennozīmīgi šo klīniku.',
            rating: 5,
            avatar: '/avatars/arita-j.jpg',
            service: 'Bērnu zobārstniecība',
            date: '2025-09-02'
          },
          {
            id: '3',
            name: 'Rihards Rub',
            text: 'Šajā klīnikā izmantoju gan zobārstes Polīnas Bites, gan higiēnistes Anitas Preisas pakalpojumus, un pagaidām par saņemtajiem pakalpojumiem neesu vīlies.',
            rating: 5,
            avatar: '/avatars/rihards-r.jpg',
            service: 'Zobārstniecība',
            date: '2025-07-28'
          },
          {
            id: '4',
            name: 'Anna Liepiņa',
            text: 'Ļoti patīkama atmosfēra un profesionāla pieeja. Fizioterapeite Sandra palīdzēja atrisināt muguras problēmas. Noteikti ieteikšu draugiem!',
            rating: 5,
            avatar: '/avatars/anna-l.jpg',
            service: 'Fizioterapija',
            date: '2025-08-20'
          },
          {
            id: '5',
            name: 'Māris Ozols',
            text: 'Ārstniecības pakalpojumi ir augstā līmenī. Dr. Kalniņš ir ļoti kompetents speciālists. Ļoti apmierināts ar saņemto aprūpi.',
            rating: 5,
            avatar: '/avatars/maris-o.jpg',
            service: 'Ārstniecība',
            date: '2025-09-05'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    }
  }

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const itemsPerSlide = windowWidth < 1024 ? 1 : 3

  // Entrance animation
  useEffect(() => {
    testimonials.forEach((_, index) => {
      setTimeout(() => {
        setVisibleTestimonials(prev => [...prev, index])
      }, index * 150)
    })
  }, [testimonials])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / itemsPerSlide))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(testimonials.length / itemsPerSlide)) % Math.ceil(testimonials.length / itemsPerSlide))
  }

  const renderStars = (rating: number) => {
    return (
      <>
        {/* SVG gradienta definīcija */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B7AB96" />
              <stop offset="100%" stopColor="#706152" />
            </linearGradient>
          </defs>
        </svg>
  
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={clsx(
              "transition-colors duration-200",
              i < rating 
                ? "text-transparent" 
                : "text-[#706152]"
            )}
            style={i < rating ? { fill: "url(#starGradient)" } : {}}
          />
        ))}
      </>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-slate-50 via-white to-gray-50/50 relative overflow-hidden">
      {/* Dynamic Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-[#B7AB96]/8 to-[#706152]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-[#706152]/8 to-[#B7AB96]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#B7AB96]/3 rounded-full blur-2xl" />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#706152]/3 rounded-full blur-2xl" />
      </div>

      <div className="max-w-[1250px] mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="section-badge">
            <Quote />
            Ko saka mūsu pacienti
          </div>
          <h2 className="section-heading">
            Uzticība, kas iedvesmo
          </h2>
          <p className="section-subheading pb-6">
            Mūsu pacientu pozitīvā pieredze ir mūsu lielākais lepnums un motivācija
            turpināt sniegt kvalitatīvus pakalpojumus
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {mounted && testimonials.slice(currentSlide * itemsPerSlide, (currentSlide + 1) * itemsPerSlide).map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={clsx(
                  "group transition-all duration-700 ease-out",
                  visibleTestimonials.includes(testimonials.indexOf(testimonial)) 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                )}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Viss oriģinālais dizains paliek tāds pats - tikai dati no datubāzes! */}
                <div className="relative bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg hover:shadow-xl hover:shadow-[#B7AB96]/20 transition-all duration-500 transform md:hover:-translate-y-2 border border-gray-200/50 h-full group-hover:bg-white">
                  
                  {/* Quote Icon with floating effect */}
                  <div className="absolute -top-8 left-8 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 z-20">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#B7AB96] via-[#a59885] to-[#706152] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#B7AB96]/30 group-hover:shadow-3xl">
                      <Quote size={24} className="text-white group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-8 relative z-10">
                    {/* Stars Rating */}
                    <div className="flex gap-1 mb-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-[#706152] text-xs md:text-sm leading-relaxed mb-4 text-center">
                      {testimonial.text}
                    </blockquote>

                    {/* Service Badge */}
                    {testimonial.service && (
                      <div className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-[#B7AB96]/10 text-[#706152] font-medium mb-3 md:mb-4 text-xs md:text-sm">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-full flex items-center justify-center">
                          <Heart size={12} className="text-white" />
                        </div>
                        {testimonial.service}
                      </div>
                    )}

                    {/* Author Info */}
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        {testimonial.avatar ? (
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-[#B7AB96] via-[#a59885] to-[#706152] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                            {testimonial.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md -z-10" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#706152] text-sm md:text-base mb-1 group-hover:text-[#B7AB96] transition-colors duration-300">
                          {testimonial.name}
                        </div>
                        {testimonial.date && (
                          <div className="text-[#706152] text-sm flex items-center gap-2">
                            <div className="w-1 h-1 bg-[#B7AB96] rounded-full" />
                            {new Date(testimonial.date).toLocaleDateString('lv-LV', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>


                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B7AB96]/20 via-transparent to-[#706152]/20 rounded-[32px]" />
                    <div className="absolute inset-[1px] bg-white rounded-[31px]" />
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 bg-gradient-to-br from-[#B7AB96]/10 to-[#706152]/10 blur-xl -z-10" />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            {currentSlide > 0 && (
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#706152] hover:bg-[#B7AB96] hover:text-white transition-all duration-200"
                aria-label="Iepriekšējie atsauksmes"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Dots */}
            {mounted && testimonials.length > 0 && (
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(testimonials.length / itemsPerSlide) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index)
                    }}
                    className={clsx(
                      "w-3 h-3 rounded-full transition-all duration-200",
                      index === currentSlide 
                        ? "bg-[#B7AB96] scale-125" 
                        : "bg-gray-300 hover:bg-gray-400"
                    )}
                    aria-label={`Iet uz ${index + 1}. atsauksmju grupu`}
                  />
                ))}
              </div>
            )}

            {currentSlide < Math.ceil(testimonials.length / itemsPerSlide) - 1 && (
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#706152] hover:bg-[#B7AB96] hover:text-white transition-all duration-200"
                aria-label="Nākamās atsauksmes"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

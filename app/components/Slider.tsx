'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import Image from 'next/image'

interface SlideData {
  id: number
  title: string
  subtitle?: string
  image: string
  mobileImage?: string
  ctaText?: string
  ctaLink?: string
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<SlideData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch('/api/slider')
        if (!res.ok) throw new Error('Failed to fetch slides')
        const data = await res.json()
        setSlides(data)
      } catch (error) {
        setSlides([])
      } finally {
        setLoading(false)
      }
    }
    fetchSlides()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  if (loading) {
    return (
      <div className="relative w-full h-[350px] md:h-[600px] lg:h-[700px] overflow-hidden">
        {/* Background image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#B7AB96] via-[#a59885] to-[#706152]"></div>

        {/* Loading content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-semibold">Ielādē...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!loading && slides.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[350px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-[#B7AB96] via-[#a59885] to-[#706152] text-white text-xl">
        Nav pievienoti slaidi
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-full h-[350px] md:aspect-auto md:h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-gray-900 via-[#706152] to-gray-800">
      {/* Floating Background Elements - Responsive */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 md:top-20 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-tl from-[#706152]/20 to-[#B7AB96]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 md:w-64 md:h-64 bg-[#B7AB96]/10 rounded-full blur-2xl" />
      </div>

      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={clsx(
              "absolute inset-0 transition-all duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
          >
            <div className="absolute inset-0 overflow-hidden">
              {/* Mobile Image - Load first */}
              <Image
                src={slide.mobileImage || slide.image}
                alt={slide.title}
                fill
                className="block md:hidden object-cover object-center transition-transform duration-1000"
                priority={index === 0}
              />
              {/* Desktop Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="hidden md:block object-cover transition-transform duration-1000"
                priority={index === 0}
              />
            </div>

            <div className="relative h-full flex items-center">
              <div className="max-w-[1250px] mx-auto px-4 w-full">
                <div className="max-w-2xl text-center md:text-left">
                  <h1 className="slider-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight hover:text-[#B7AB96] transition-colors duration-500">
                    {slide.title}
                  </h1>

                  {slide.subtitle && (
                    <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-8 leading-relaxed">
                      {slide.subtitle}
                    </p>
                  )}

                  {slide.ctaText && slide.ctaLink && (
                    <a
                      href={slide.ctaLink}
                      className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] text-white font-bold text-base md:text-lg rounded-full hover:shadow-2xl hover:shadow-[#B7AB96]/40 transition-all duration-500 hover:scale-105 md:hover:scale-110 hover:-translate-y-1 md:hover:-translate-y-2 border border-white/20 group/cta"
                    >
                      <span className="group-hover/cta:scale-105 transition-transform duration-300">
                        {slide.ctaText}
                      </span>
                      <div className="w-2 h-2 bg-white rounded-full group-hover/cta:scale-150 transition-transform duration-300" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Navigation Buttons - Only show if multiple slides - Responsive */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-[#B7AB96] hover:to-[#706152] hover:border-white/40 transition-all duration-500 z-10 hover:scale-110 hover:-translate-x-1 shadow-lg hover:shadow-2xl hover:shadow-[#B7AB96]/30 group"
            aria-label="Iepriekšējais slaids"
          >
            <ChevronLeft size={20} className="md:w-7 md:h-7 group-hover:scale-110 group-hover:-translate-x-1 transition-all duration-300" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-[#B7AB96] hover:to-[#706152] hover:border-white/40 transition-all duration-500 z-10 hover:scale-110 hover:translate-x-1 shadow-lg hover:shadow-2xl hover:shadow-[#B7AB96]/30 group"
            aria-label="Nākamais slaids"
          >
            <ChevronRight size={20} className="md:w-7 md:h-7 group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300" />
          </button>
        </>
      )}

      {/* Enhanced Pagination Indicators - Only show if multiple slides - Responsive */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-white/10 backdrop-blur-xl rounded-full p-3 md:p-4 border border-white/20 shadow-lg">
            <div className="flex gap-2 md:gap-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={clsx(
                    "relative w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-500 hover:scale-125",
                    index === currentSlide
                      ? "bg-gradient-to-r from-[#B7AB96] to-[#706152] scale-125 shadow-lg shadow-[#B7AB96]/50"
                      : "bg-white/40 hover:bg-white/70"
                  )}
                  aria-label={`Iet uz ${index + 1}. slaidu`}
                >
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-white/30 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decorative Bottom Border with Interesting Shape - Responsive */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 z-20">
        <svg
          className="w-full h-full max-w-full"
          viewBox="0 0 1200 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ maxWidth: '100%', overflow: 'hidden' }}
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B7AB96" stopOpacity="0.9"/>
              <stop offset="50%" stopColor="#a59885" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#706152" stopOpacity="0.9"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Complex Wave Pattern */}
          <path
            d="M0,60 C120,20 240,80 360,45 C480,10 600,70 720,40 C840,10 960,60 1080,35 C1140,25 1170,30 1200,35 L1200,100 L0,100 Z"
            fill="url(#borderGradient)"
            filter="url(#glow)"
            className="drop-shadow-lg"
          />
          
          {/* Secondary Layer for Depth */}
          <path
            d="M0,75 C150,45 300,85 450,60 C600,35 750,75 900,55 C1050,35 1125,50 1200,45 L1200,100 L0,100 Z"
            fill="white"
            fillOpacity="0.1"
          />
        </svg>
      </div>

    </div>
  )
}

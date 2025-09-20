'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { clsx } from 'clsx'

interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
}

interface GalleryProps {
  images: GalleryImage[]
  title?: string
  className?: string
}

export default function Gallery({
  images,
  title = "Galerija",
  className = ""
}: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before using portals
  useEffect(() => {
    setMounted(true)
  }, [])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    // Prevent background scrolling
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${window.scrollY}px`
    document.body.style.width = '100%'
    document.body.style.touchAction = 'none'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    // Restore scrolling
    const scrollY = document.body.style.top
    document.body.style.overflow = 'unset'
    document.body.style.position = 'static'
    document.body.style.top = ''
    document.body.style.width = 'auto'
    document.body.style.touchAction = 'auto'
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
  }

  const goToPrevious = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation()
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const goToNext = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation()
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return
      
      if (e.key === 'Escape') {
        e.preventDefault()
        closeLightbox()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }

    if (selectedImage !== null) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  if (images.length === 0) {
    return null
  }

  const showBackground = !className.includes('bg-transparent')

  // Lightbox component that will be rendered in portal
  const lightboxContent = selectedImage !== null && mounted ? (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center touch-none select-none"
      style={{ 
        zIndex: 2147483647,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onContextMenu={handleContextMenu}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          closeLightbox()
        }}
        className="fixed top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
        style={{ zIndex: 2147483647 }}
        aria-label="Aizvērt galeriju"
      >
        <X className="w-6 h-6 sm:w-5 sm:h-5" />
      </button>

      {/* Side navigation buttons for desktop */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
            style={{ zIndex: 2147483647 }}
            aria-label="Iepriekšējais attēls"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
            style={{ zIndex: 2147483647 }}
            aria-label="Nākamais attēls"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom navigation buttons for all screen sizes */}
      {images.length > 1 && (
        <div 
          className="fixed bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4" 
          style={{ zIndex: 2147483647 }}
        >
          <button
            onClick={goToPrevious}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
            aria-label="Iepriekšējais attēls"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {/* Image counter in the middle */}
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm font-medium">
              {selectedImage + 1} / {images.length}
            </span>
          </div>
          
          <button
            onClick={goToNext}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
            aria-label="Nākamais attēls"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Image counter for when there's only one image */}
      {images.length === 1 && (
        <div 
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2" 
          style={{ zIndex: 2147483647 }}
        >
          <span className="text-white text-sm font-medium">
            1 / 1
          </span>
        </div>
      )}

      {/* Main image container */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-4 pb-24"
        onTouchStart={(e) => {
          const touchStartX = e.touches[0].clientX
          const handleTouchEnd = (endEvent: TouchEvent) => {
            const touchEndX = endEvent.changedTouches[0].clientX
            const diff = touchStartX - touchEndX
            
            if (Math.abs(diff) > 50) {
              if (diff > 0) {
                goToNext()
              } else {
                goToPrevious()
              }
            }
            
            document.removeEventListener('touchend', handleTouchEnd)
          }
          
          document.addEventListener('touchend', handleTouchEnd)
        }}
      >
        <div className="relative max-w-full max-h-full w-full h-full">
          <Image
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
            quality={95}
          />
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      <section className={clsx(
        showBackground ? "py-8 sm:py-10 lg:py-12 bg-gradient-to-br from-slate-50 via-white to-gray-50/30 relative overflow-hidden" : "py-0",
        className
      )}>
        {/* Background decorations - only when not transparent */}
        {showBackground && (
          <div className="absolute inset-0">
            <div className="absolute top-8 left-4 sm:top-16 sm:left-8 lg:top-20 lg:left-20 w-24 h-24 sm:w-32 sm:h-32 lg:w-80 lg:h-80 bg-gradient-to-br from-[#B7AB96]/8 to-[#706152]/5 rounded-full blur-2xl lg:blur-3xl" />
            <div className="absolute bottom-8 right-4 sm:bottom-16 sm:right-8 lg:bottom-20 lg:right-20 w-28 h-28 sm:w-36 sm:h-36 lg:w-96 lg:h-96 bg-gradient-to-tl from-[#706152]/6 to-[#B7AB96]/8 rounded-full blur-2xl lg:blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-20 h-20 sm:w-24 sm:h-24 lg:w-64 lg:h-64 bg-[#B7AB96]/4 rounded-full blur-xl lg:blur-2xl" />
          </div>
        )}

        <div className={clsx(
          showBackground ? "max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10" : "w-full"
        )}>
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="section-badge">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm sm:text-base">Galerija</span>
            </div>
            <h2 className="section-heading">{title}</h2>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
            {images.slice(0, 4).map((image, index) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:scale-105"
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden aspect-square">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Zoom icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                      <ZoomIn className="w-5 h-5 text-[#706152]" />
                    </div>
                  </div>

                  {/* Image title removed from gallery grid */}
                </div>
              </div>
            ))}
          </div>

          {/* Show more images indicator */}
          {images.length > 4 && (
            <div className="text-center mt-6">
              <p className="text-sm text-[#706152] opacity-75">
                +{images.length - 4} vairāk {images.length - 4 === 1 ? 'attēls' : 'attēli'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox rendered as portal directly to document.body */}
      {mounted && lightboxContent && createPortal(lightboxContent, document.body)}
    </>
  )
}

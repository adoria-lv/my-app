'use client'

import { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { ChevronDown, BookOpen } from 'lucide-react'

interface ReadMoreFadeProps {
  children: React.ReactNode
  maxHeight?: number
  fadeHeight?: number
  className?: string
  buttonText?: string
  collapseText?: string
  showCollapseButton?: boolean
}

export default function ReadMoreFade({
  children,
  maxHeight = 200,
  fadeHeight = 80,
  className = '',
  buttonText = 'Lasīt vairāk',
  collapseText = 'Lasīt mazāk',
  showCollapseButton = true
}: ReadMoreFadeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [fullHeight, setFullHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setFullHeight(contentRef.current.scrollHeight)
    }
  }, [children])

  const handleToggle = () => {
    if (isExpanded) {
      if (fullHeight > maxHeight) {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <div ref={containerRef} className={className}>
      <div
        ref={contentRef}
        className="overflow-hidden relative transition-all duration-500 ease-out"
        style={{
          maxHeight: isExpanded ? `${fullHeight}px` : `${maxHeight}px`,
          height: isExpanded ? 'auto' : `${maxHeight}px`
        }}
      >
        <div className={clsx("w-full", !isExpanded && "overflow-hidden")}>
          {children}
        </div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/95 via-white/90 to-transparent pointer-events-none transition-opacity duration-200 z-10" />
        )}
      </div>

      {/* Enhanced Read More Button */}
      <div className={clsx("flex justify-center", isExpanded ? "mt-8" : "mt-6")}>
        <button
          onClick={handleToggle}
          className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100/60 rounded-2xl hover:border-[#B7AB96]/20 hover:shadow-xl transition-all duration-500 hover:scale-105 active:scale-[0.98] active:duration-75 touch-manipulation mt-3"
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#B7AB96]/5 to-[#706152]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          <div className="relative z-10 flex items-center gap-3 px-8 py-4">
            {!isExpanded ? (
              <>
                <div className="w-8 h-8 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-xl flex items-center justify-center group-hover:scale-105 group-hover:shadow-xl transition-all duration-500">
                  <BookOpen size={14} className="text-[#B7AB96] group-hover:text-[#706152] transition-colors duration-500" />
                </div>
                <span className="font-bold text-[#706152] group-hover:text-[#B7AB96] transition-colors duration-500">
                  {buttonText}
                </span>
                <ChevronDown
                  size={18}
                  className="text-[#B7AB96] transition-all duration-500 group-hover:scale-105"
                />
              </>
            ) : (
              showCollapseButton && (
                <>
                  <div className="w-8 h-8 bg-gradient-to-br from-[#706152]/20 to-[#B7AB96]/10 rounded-xl flex items-center justify-center group-hover:scale-105 group-hover:shadow-xl transition-all duration-500">
                    <BookOpen size={14} className="text-[#706152] group-hover:text-[#B7AB96] transition-colors duration-500" />
                  </div>
                  <span className="font-bold text-[#706152] group-hover:text-[#B7AB96] transition-colors duration-500">
                    {collapseText}
                  </span>
                  <ChevronDown
                    size={18}
                    className="text-[#B7AB96] rotate-180 transition-all duration-500 group-hover:scale-105"
                  />
                </>
              )
            )}
          </div>
          
        </button>
      </div>
    </div>
  )
}

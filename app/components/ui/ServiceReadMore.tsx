'use client'

import { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { ChevronDown, BookOpen } from 'lucide-react'

interface ServiceReadMoreProps {
  children: React.ReactNode
  maxHeight?: number
  className?: string
  buttonText?: string
  collapseText?: string
}

export default function ServiceReadMore({
  children,
  maxHeight = 200,
  className = '',
  buttonText = 'Lasīt vairāk',
  collapseText = 'Lasīt mazāk'
}: ServiceReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowButton, setShouldShowButton] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  console.log('ServiceReadMore rendered with maxHeight:', maxHeight)

  useEffect(() => {
    if (contentRef.current) {
      const fullHeight = contentRef.current.scrollHeight
      console.log('fullHeight:', fullHeight, 'maxHeight:', maxHeight)
      setShouldShowButton(fullHeight > maxHeight)
    }
  }, [children, maxHeight])

  const handleToggle = () => {
    if (isExpanded) {
      // When collapsing, scroll back to the button position
      if (buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect()
        const scrollTop = window.pageYOffset + buttonRect.top - 100 // 100px offset from top

        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        })
      }
    }
    setIsExpanded(!isExpanded)
  }

  // Always show button for service content - the content is meant to be collapsible
  // if (!shouldShowButton) {
  //   return <div className={className}>{children}</div>
  // }

  return (
    <div className={className}>
      <div className="relative">
        <div
          ref={contentRef}
          className={clsx(
            "transition-all duration-500 ease-out relative",
            !isExpanded && "overflow-hidden"
          )}
          style={{
            maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
            height: isExpanded ? 'auto' : `${maxHeight}px`
          }}
        >
          {children}

          {/* Strong fade overlay when collapsed */}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/98 via-white/90 via-white/70 to-transparent pointer-events-none z-20" />
          )}
        </div>
      </div>

      {/* Read More Button */}
      <div className="flex justify-center mt-6 relative z-20">
        <button
          ref={buttonRef}
          onClick={handleToggle}
          className="group relative overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:border-[#B7AB96]/30 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 my-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#B7AB96]/5 to-[#706152]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          <div className="relative z-10 flex items-center gap-3 px-6 py-3">
            <div className="w-7 h-7 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <BookOpen size={12} className="text-[#B7AB96] group-hover:text-[#706152] transition-colors duration-300" />
            </div>
            <span className="font-semibold text-sm text-[#706152] group-hover:text-[#B7AB96] transition-colors duration-300">
              {isExpanded ? collapseText : buttonText}
            </span>
            <ChevronDown
              size={16}
              className={clsx(
                "text-[#B7AB96] transition-all duration-300",
                isExpanded && "rotate-180"
              )}
            />
          </div>
        </button>
      </div>
    </div>
  )
}
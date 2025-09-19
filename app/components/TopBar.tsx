'use client'

import { Mail, MapPin, Clock, Globe, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

interface TopBarProps {
  className?: string
}

interface TopBarData {
  email: string
  address: string
  hours: string
  instagram?: string
  facebook?: string
  whatsapp?: string
  twitter?: string
  showInstagram: boolean
  showFacebook: boolean
  showWhatsapp: boolean
  showTwitter: boolean
}

export default function TopBar({ className }: TopBarProps) {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('LV')
  const [topBarData, setTopBarData] = useState<TopBarData>({
    email: 'adoria@adoria.lv',
    address: 'A. Čaka iela 70-3, Rīga',
    hours: 'P. - C. 08:00 - 19:00 / Pk., S. 10:00 - 17:00',
    instagram: '',
    facebook: '',
    whatsapp: '',
    twitter: '',
    showInstagram: true,
    showFacebook: true,
    showWhatsapp: true,
    showTwitter: true
  })
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'LV', name: 'Latviešu' },
    { code: 'RU', name: 'Русский' },
    { code: 'EN', name: 'English' }
  ]

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode)
    setIsLanguageDropdownOpen(false)
  }

  // Fetch TopBar data
  useEffect(() => {
    const fetchTopBarData = async () => {
      try {
        const response = await fetch('/api/topbar')
        if (response.ok) {
          const data = await response.json()
          setTopBarData(data)
        }
      } catch (error) {
        console.error('Error fetching TopBar data:', error)
      }
    }

    fetchTopBarData()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false)
      }
    }

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLanguageDropdownOpen])
  return (
    <div 
      className={clsx(
        "w-full px-4 py-2 text-sm text-[#706152] relative z-40 bg-gradient-to-br from-gray-50 via-white to-gray-100",
        className
      )}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Desktop version */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Left side - Contact info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#B7AB96]/10 rounded-lg flex items-center justify-center">
                <Mail size={14} className="text-[#B7AB96]" />
              </div>
              <span>{topBarData.email}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#B7AB96]/10 rounded-lg flex items-center justify-center">
                <MapPin size={14} className="text-[#B7AB96]" />
              </div>
              <span>{topBarData.address}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#B7AB96]/10 rounded-lg flex items-center justify-center">
                <Clock size={14} className="text-[#B7AB96]" />
              </div>
              <span>{topBarData.hours}</span>
            </div>
          </div>

          {/* Right side - Social icons and language */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {topBarData.showInstagram && (
                <a
                  href={topBarData.instagram || "#"}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#B7AB96] transition-all duration-200 group"
                  aria-label="Instagram"
                  target={topBarData.instagram ? "_blank" : "_self"}
                  rel={topBarData.instagram ? "noopener noreferrer" : ""}
                >
                  <Image
                    src="/instagram-icon.svg"
                    alt="Instagram"
                    width={22}
                    height={22}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              )}

              {topBarData.showFacebook && (
                <a
                  href={topBarData.facebook || "#"}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#B7AB96] transition-all duration-200 group"
                  aria-label="Facebook"
                  target={topBarData.facebook ? "_blank" : "_self"}
                  rel={topBarData.facebook ? "noopener noreferrer" : ""}
                >
                  <Image
                    src="/facebook-icon.svg"
                    alt="Facebook"
                    width={22}
                    height={22}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              )}

              {topBarData.showWhatsapp && (
                <a
                  href={topBarData.whatsapp || "#"}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#B7AB96] transition-all duration-200 group"
                  aria-label="WhatsApp"
                  target={topBarData.whatsapp ? "_blank" : "_self"}
                  rel={topBarData.whatsapp ? "noopener noreferrer" : ""}
                >
                  <Image
                    src="/whatsapp-icon.svg"
                    alt="WhatsApp"
                    width={22}
                    height={22}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              )}

              {topBarData.showTwitter && (
                <a
                  href={topBarData.twitter || "#"}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#B7AB96] transition-all duration-200 group"
                  aria-label="X (Twitter)"
                  target={topBarData.twitter ? "_blank" : "_self"}
                  rel={topBarData.twitter ? "noopener noreferrer" : ""}
                >
                  <Image
                    src="/x-icon.svg"
                    alt="X (Twitter)"
                    width={22}
                    height={22}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              )}
            </div>

            {/* Language selector - Desktop */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button 
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-100 hover:bg-[#B7AB96] text-[#706152] hover:text-white transition-all duration-200 group"
              >
                <Globe size={14} className="text-[#B7AB96] group-hover:text-white transition-colors" />
                <span className="text-sm font-medium">{selectedLanguage}</span>
                <ChevronDown size={12} className={clsx(
                  "group-hover:text-white transition-all duration-200",
                  isLanguageDropdownOpen && "rotate-180"
                )} />
              </button>
              
              {/* Dropdown */}
              {isLanguageDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 min-w-full">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={clsx(
                        "w-full px-3 py-2 text-sm font-medium text-left hover:bg-[#B7AB96] hover:text-white transition-colors duration-200 whitespace-nowrap",
                        selectedLanguage === lang.code && "bg-[#B7AB96] text-white"
                      )}
                    >
                      {lang.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile version */}
        <div className="lg:hidden">
          {/* Contact info - stacked vertically */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#B7AB96]/10 rounded-lg flex items-center justify-center">
                <Mail size={14} className="text-[#B7AB96]" />
              </div>
              <span className="text-sm break-words">{topBarData.email}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#B7AB96]/10 rounded-lg flex items-center justify-center">
                <MapPin size={14} className="text-[#B7AB96]" />
              </div>
              <span className="text-sm break-words">{topBarData.address}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#B7AB96]/10 rounded-lg flex items-center justify-center">
                <Clock size={14} className="text-[#B7AB96]" />
              </div>
              <span className="text-sm break-words">{topBarData.hours}</span>
            </div>
          </div>
          
          {/* Bottom row - Social icons and Language */}
          <div className="flex items-center justify-between">
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {topBarData.showInstagram && (
                <a
                  href={topBarData.instagram || "#"}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#B7AB96] transition-all duration-200 group"
                  aria-label="Instagram"
                  target={topBarData.instagram ? "_blank" : "_self"}
                  rel={topBarData.instagram ? "noopener noreferrer" : ""}
                >
                  <Image
                    src="/instagram-icon.svg"
                    alt="Instagram"
                    width={16}
                    height={16}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              )}

              {topBarData.showFacebook && (
                <a
                  href={topBarData.facebook || "#"}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#B7AB96] transition-all duration-200 group"
                  aria-label="Facebook"
                  target={topBarData.facebook ? "_blank" : "_self"}
                  rel={topBarData.facebook ? "noopener noreferrer" : ""}
                >
                  <Image
                    src="/facebook-icon.svg"
                    alt="Facebook"
                    width={16}
                    height={16}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              )}

              {topBarData.showWhatsapp && (
                <a
                  href={topBarData.whatsapp || "#"}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#B7AB96] transition-all duration-200 group"
                  aria-label="WhatsApp"
                  target={topBarData.whatsapp ? "_blank" : "_self"}
                  rel={topBarData.whatsapp ? "noopener noreferrer" : ""}
                >
                  <Image
                    src="/whatsapp-icon.svg"
                    alt="WhatsApp"
                    width={16}
                    height={16}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              )}

              {topBarData.showTwitter && (
                <a
                  href={topBarData.twitter || "#"}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#B7AB96] transition-all duration-200 group"
                  aria-label="X (Twitter)"
                  target={topBarData.twitter ? "_blank" : "_self"}
                  rel={topBarData.twitter ? "noopener noreferrer" : ""}
                >
                  <Image
                    src="/x-icon.svg"
                    alt="X (Twitter)"
                    width={16}
                    height={16}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              )}
            </div>
            
            {/* Language selector - Mobile */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#B7AB96] text-[#706152] hover:text-white transition-all duration-200 group"
              >
                <Globe size={12} className="text-[#B7AB96] group-hover:text-white transition-colors" />
                <span className="text-sm font-medium">{selectedLanguage}</span>
                <ChevronDown size={10} className={clsx(
                  "group-hover:text-white transition-all duration-200",
                  isLanguageDropdownOpen && "rotate-180"
                )} />
              </button>
              
              {/* Mobile Dropdown */}
              {isLanguageDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 min-w-full">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={clsx(
                        "w-full px-2.5 py-1.5 text-sm font-medium text-center hover:bg-[#B7AB96] hover:text-white transition-colors duration-200 whitespace-nowrap",
                        selectedLanguage === lang.code && "bg-[#B7AB96] text-white"
                      )}
                    >
                      {lang.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

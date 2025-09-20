'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Phone, MapPin, Clock } from 'lucide-react'
import { clsx } from 'clsx'
import Link from 'next/link'
import Image from 'next/image'
import AppointmentDialog from './AppointmentDialog'

interface DropdownItem {
  id: string
  label: string
  href: string
  iconPath?: string
  order: number
  isActive: boolean
}

interface MenuItem {
  id: string
  label: string
  href?: string
  iconPath?: string
  order: number
  isActive: boolean
  dropdowns: DropdownItem[]
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())
  const menuRef = useRef<HTMLDivElement>(null)

  // Fetch main menu items from database
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu')
        if (response.ok) {
          const data = await response.json()
          setMenuItems(data)
        }
      } catch (error) {
        console.error('Error fetching menu items:', error)
      }
    }

    fetchMenuItems()
  }, [])

  const toggleDropdown = (label: string) => {
    const newOpenDropdowns = new Set(openDropdowns)
    if (newOpenDropdowns.has(label)) {
      newOpenDropdowns.delete(label)
    } else {
      newOpenDropdowns.add(label)
    }
    setOpenDropdowns(newOpenDropdowns)
  }


  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    // SOLID WHITE BACKGROUND - NO TRANSPARENCY
    <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto overflow-x-hidden scrollbar-thin max-w-full">
      {/* Header with Logo and Close */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200/50">
        {/* Logo */}
        <Link href="/" onClick={onClose} className="flex items-center">
          <Image
            src="/logo.png"
            alt="Adoria"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Aizvērt"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="tel:+37167315000"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-xl bg-[#B7AB96] flex items-center justify-center">
              <Phone size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 font-medium">Zvanīt</div>
              <div className="text-sm font-bold text-[#706152]">67 315 000</div>
            </div>
          </Link>

          {/* Location Card */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200">
            <div className="w-8 h-8 rounded-xl bg-[#706152] flex items-center justify-center">
              <MapPin size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 font-medium">Adrese</div>
              <div className="text-sm font-bold text-[#706152]">A. Čaka 70-3</div>
            </div>
          </div>
        </div>
      </div>

{/* ELEGANT MOBILE MENU CONTENT */}
<div className="bg-white">
  <div className="px-6 py-6">
    <div className="space-y-3">
      {menuItems.map((item, index) => (
        <div key={item.id}>
          {item.dropdowns.length > 0 ? (
            <div className="group">
              <button
                onClick={() => toggleDropdown(item.label)}
                className="w-full flex items-center justify-between py-4 px-5 text-left bg-white hover:bg-gradient-to-r hover:from-[#B7AB96]/10 hover:to-[#706152]/5 rounded-xl border-l-4 border-gray-100 hover:border-[#B7AB96] transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <div className="flex items-center gap-4">
                  {item.iconPath ? (
                    <Image
                      src={item.iconPath}
                      alt={item.label}
                      width={20}
                      height={20}
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-2 h-2 bg-[#B7AB96] rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  )}
                  <span className="text-lg font-semibold text-[#706152] group-hover:text-[#B7AB96] transition-colors duration-300">{item.label}</span>
                </div>

                <ChevronDown
                  size={18}
                  className={clsx(
                    "text-[#B7AB96] transition-all duration-300",
                    openDropdowns.has(item.label) && "rotate-180"
                  )}
                />
              </button>

              {openDropdowns.has(item.label) && (
                <div className="mt-4 ml-6 space-y-1 animate-fade-in">
                  {item.dropdowns.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.id}
                      href={dropdownItem.href}
                      className="group/sub flex items-center gap-3 py-4 px-4 text-[#706152] hover:text-[#B7AB96] hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-[#B7AB96]"
                      onClick={onClose}
                    >
                      <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {dropdownItem.iconPath ? (
                          <Image
                            src={dropdownItem.iconPath}
                            alt={dropdownItem.label}
                            width={20}
                            height={20}
                            className="w-4 h-4"
                          />
                        ) : (
                          <Image
                            src="/menu-li-icon.svg"
                            alt="Menu icon"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                        )}
                      </div>
                      <span className="flex-1">{dropdownItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : item.label === 'Pieteikt vizīti' ? (
            <AppointmentDialog>
              <button className="group flex items-center gap-4 py-4 px-5 text-lg font-semibold text-[#706152] hover:text-[#B7AB96] bg-white hover:bg-gradient-to-r hover:from-[#B7AB96]/10 hover:to-[#706152]/5 rounded-xl border-l-4 border-gray-100 hover:border-[#B7AB96] transition-all duration-300 shadow-sm hover:shadow-md w-full text-left">
                {item.iconPath ? (
                  <Image
                    src={item.iconPath}
                    alt={item.label}
                    width={20}
                    height={20}
                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-2 h-2 bg-[#B7AB96] rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                )}
                <span>{item.label}</span>
              </button>
            </AppointmentDialog>
          ) : (
            <Link
              href={item.href || '#'}
              className="group flex items-center gap-4 py-4 px-5 text-lg font-semibold text-[#706152] hover:text-[#B7AB96] bg-white hover:bg-gradient-to-r hover:from-[#B7AB96]/10 hover:to-[#706152]/5 rounded-xl border-l-4 border-gray-100 hover:border-[#B7AB96] transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={onClose}
            >
              {item.iconPath ? (
                <Image
                  src={item.iconPath}
                  alt={item.label}
                  width={20}
                  height={20}
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-2 h-2 bg-[#B7AB96] rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              )}
              <span>{item.label}</span>
            </Link>
          )}
        </div>
      ))}
    </div>

    {/* PROFESSIONAL CTA SECTION */}
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="bg-gradient-to-r from-[#B7AB96] to-[#706152] rounded-2xl p-6 text-white text-center shadow-lg">
        <div className="mb-4">
          <Phone className="w-8 h-8 mx-auto mb-2" />
          <h3 className="text-lg font-bold">Nepieciešama palīdzība?</h3>
          <p className="text-sm opacity-90">Zvaniet mums jebkurā laikā</p>
        </div>
        <Link 
          href="tel:+37167315000"
          className="block w-full py-3 px-6 bg-white/20 backdrop-blur-sm rounded-xl font-bold text-lg hover:bg-white/30 transition-colors duration-200"
        >
          +371 67 315 000
        </Link>
      </div>
    </div>
  </div>
</div>

      {/* FOOTER SECTION - FIXED AT BOTTOM */}
      <div className="bg-white border-t border-gray-200 p-6">
        {/* E-pieraksts Button */}
        <AppointmentDialog>
          <button
            className="w-full flex items-center justify-center gap-3 py-4 px-6 mb-6 rounded-2xl bg-gradient-to-r from-[#B7AB96] to-[#706152] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={onClose}
          >
            <Clock size={20} />
            E-pieraksts
          </button>
        </AppointmentDialog>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-6">
          <Link 
            href="#" 
            className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Instagram"
          >
            <Image
              src="/instagram-icon.svg"
              alt="Instagram"
              width={24}
              height={24}
            />
          </Link>
          <Link 
            href="#" 
            className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Facebook"
          >
            <Image
              src="/facebook-icon.svg"
              alt="Facebook"
              width={24}
              height={24}
            />
          </Link>
          <Link 
            href="#" 
            className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="WhatsApp"
          >
            <Image
              src="/whatsapp-icon.svg"
              alt="WhatsApp"
              width={24}
              height={24}
            />
          </Link>
          <Link 
            href="#" 
            className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="X (Twitter)"
          >
            <Image
              src="/x-icon.svg"
              alt="X (Twitter)"
              width={24}
              height={24}
            />
          </Link>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center gap-6">
          <button className="px-4 py-2 rounded-xl bg-[#B7AB96] text-white font-bold text-sm">
            LV
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-[#B7AB96] font-semibold text-sm">
            RU
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-[#B7AB96] font-semibold text-sm">
            EN
          </button>
        </div>
      </div>
    </div>
  )
}

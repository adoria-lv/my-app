'use client'

import { useState, useCallback, useEffect } from 'react'
import { Phone, X, Menu, ChevronDown, Users, UserCheck, MapPin, Euro } from 'lucide-react'
import { clsx } from 'clsx'
import Image from 'next/image'
import MobileMenu from './MobileMenu'
import Link from 'next/link'
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

export default function MainMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null)

  // Fetch menu items from database
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

  const handleMouseEnter = (label: string) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      setHideTimeout(null)
    }
    setActiveDropdown(label)
  }

  const handleMouseLeave = () => {
    // Add a small delay before hiding dropdown to allow moving to dropdown
    const timeout = setTimeout(() => {
      setActiveDropdown(null)
    }, 100)
    setHideTimeout(timeout)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Adoria"
                  width={120}
                  height={40}
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-2">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdowns.length > 0 && handleMouseEnter(item.label)}
                  onMouseLeave={() => item.dropdowns.length > 0 && handleMouseLeave()}
                >
                  {item.dropdowns.length > 0 ? (
                    <button
                      className={clsx(
                        "flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#706152] hover:text-white hover:bg-[#B7AB96] transition-all duration-200 font-medium text-sm group",
                        activeDropdown === item.label && "text-white bg-[#B7AB96]"
                      )}
                    >
                      {item.iconPath && (
                        <Image
                          src={item.iconPath}
                          alt={item.label}
                          width={16}
                          height={16}
                          className="w-4 h-4 group-hover:brightness-0 group-hover:invert transition-all"
                        />
                      )}
                      <span>{item.label}</span>
                      <ChevronDown
                        size={16}
                        className={clsx(
                          "transition-transform duration-200 ease-in-out",
                          activeDropdown === item.label && "rotate-180"
                        )}
                      />
                    </button>
                  ) : item.label === 'Pieteikt vizīti' ? (
                    <AppointmentDialog>
                      <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#706152] hover:text-white hover:bg-[#B7AB96] transition-all duration-200 font-medium text-sm group">
                        {item.iconPath && (
                          <Image
                            src={item.iconPath}
                            alt={item.label}
                            width={16}
                            height={16}
                            className="w-4 h-4 group-hover:brightness-0 group-hover:invert transition-all"
                          />
                        )}
                        {item.label}
                      </button>
                    </AppointmentDialog>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#706152] hover:text-white hover:bg-[#B7AB96] transition-all duration-200 font-medium text-sm group"
                    >
                      {item.iconPath && (
                        <Image
                          src={item.iconPath}
                          alt={item.label}
                          width={16}
                          height={16}
                          className="w-4 h-4 group-hover:brightness-0 group-hover:invert transition-all"
                        />
                      )}
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <AppointmentDialog>
                <button
                  className="px-6 py-2.5 rounded-full text-white font-medium hover:opacity-90 transition-opacity duration-200 text-sm"
                  style={{ backgroundColor: '#B7AB96' }}
                >
                  E-pieraksts
                </button>
              </AppointmentDialog>

              <a href="tel:+37167315000" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#B7AB96' }}
                >
                  <Phone size={18} className="text-white" />
                </div>
                <div className="text-lg font-bold text-[#706152]">
                  +371 67 315 000
                </div>
              </a>
            </div>

            <div className="lg:hidden flex items-center gap-3">
              {/* Phone Button for Mobile */}
              <a
                href="tel:+37167315000"
                className="w-10 h-10 rounded-full bg-[#B7AB96] flex items-center justify-center hover:bg-[#a59885] transition-all duration-300 animate-pulse hover:animate-none hover:scale-110 shadow-lg hover:shadow-xl"
                aria-label="Zvanīt +371 67 315 000"
              >
                <Phone size={18} className="text-white" />
              </a>

              {/* Menu Toggle Button */}
              <button
                onClick={toggleMobileMenu}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ backgroundColor: '#B7AB96' }}
                aria-label={mobileMenuOpen ? 'Aizvērt izvēlni' : 'Atvērt izvēlni'}
              >
                {mobileMenuOpen ? (
                  <X size={20} className="text-white" />
                ) : (
                  <Menu size={20} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Global dropdown positioned relative to entire nav */}
        {menuItems.map((item) =>
          item.dropdowns.length > 0 && (
            <div
              key={item.label}
              className={clsx(
                "absolute left-0 right-0 top-full bg-white border-t-2 border-[#B7AB96] shadow-lg transition-all duration-200 ease-in-out z-10 max-w-none",
                activeDropdown === item.label
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              )}
              style={{ marginTop: '-1px' }}
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-[1250px] mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {item.dropdowns.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.id}
                      href={dropdownItem.href}
                      className="flex items-center gap-4 p-4 text-[#706152] hover:text-white hover:bg-[#B7AB96] font-medium transition-all duration-200 rounded-lg group border border-transparent hover:border-[#B7AB96]"
                    >
                      <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                        {dropdownItem.iconPath ? (
                          <Image
                            src={dropdownItem.iconPath}
                            alt={dropdownItem.label}
                            width={28}
                            height={28}
                            className="w-7 h-7 group-hover:brightness-0 group-hover:invert transition-all"
                          />
                        ) : (
                          <Image
                            src="/menu-li-icon.svg"
                            alt="Menu icon"
                            width={28}
                            height={28}
                            className="w-7 h-7 group-hover:brightness-0 group-hover:invert transition-all"
                          />
                        )}
                      </div>
                      <span className="text-sm">{dropdownItem.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </nav>

      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={closeMobileMenu} 
      />
    </>
  )
}

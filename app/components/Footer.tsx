'use client'

import { useState, useEffect } from 'react'
import {
  Phone,
  Mail,
  MapPin} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ServiceCategory {
  id: string
  title: string
  href: string
  subServices: {
    id: string
    title: string
    isActive: boolean
  }[]
}

interface FooterSettings {
  id: string
  logoPath: string
  companyDescription: string
  phone: string
  email: string
  address: string
  showServices: boolean
  isActive: boolean
}

interface SocialLink {
  id: string
  name: string
  href: string
  icon: string
  isActive: boolean
}

interface QuickLink {
  id: string
  label: string
  href: string
  isActive: boolean
}

export default function Footer() {
  const [services, setServices] = useState<ServiceCategory[]>([])
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesResponse = await fetch('/api/services')
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json()
          setServices(servicesData)
        }

        // Fetch footer settings
        const footerResponse = await fetch('/api/footer-settings')
        if (footerResponse.ok) {
          const footerData = await footerResponse.json()
          if (footerData.length > 0) {
            setFooterSettings(footerData[0])
          }
        }

        // Fetch social links
        const socialResponse = await fetch('/api/social-links')
        if (socialResponse.ok) {
          const socialData = await socialResponse.json()
          setSocialLinks(socialData.filter((link: SocialLink) => link.isActive))
        }

        // Fetch quick links
        const quickResponse = await fetch('/api/quick-links')
        if (quickResponse.ok) {
          const quickData = await quickResponse.json()
          setQuickLinks(quickData.filter((link: QuickLink) => link.isActive))
        }

      } catch (error) {
        console.error('Error fetching footer data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#B7AB96] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#706152] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#B7AB96] rounded-full blur-2xl" />
      </div>

      <div className="max-w-[1250px] mx-auto px-4 relative z-10">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              {footerSettings && (
                <div>
                  <Image
                    src={footerSettings.logoPath}
                    alt="Adoria"
                    width={150}
                    height={50}
                    className="h-20 w-auto mb-4"
                  />
                  <p className="text-[#706152] leading-relaxed">
                    {footerSettings.companyDescription}
                  </p>
                </div>
              )}

              {/* Contact Info */}
              {footerSettings && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#706152]">
                    <div className="w-10 h-10 bg-[#B7AB96]/10 rounded-lg flex items-center justify-center">
                      <Phone size={18} className="text-[#B7AB96]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#706152]">Zvanīt:</div>
                      <a href={`tel:${footerSettings.phone}`} className="font-semibold hover:text-[#B7AB96] transition-colors">
                        {footerSettings.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[#706152]">
                    <div className="w-10 h-10 bg-[#B7AB96]/10 rounded-lg flex items-center justify-center">
                      <Mail size={18} className="text-[#B7AB96]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#706152]">E-pasts:</div>
                      <a href={`mailto:${footerSettings.email}`} className="font-semibold hover:text-[#B7AB96] transition-colors">
                        {footerSettings.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-[#706152]">
                    <div className="w-10 h-10 bg-[#B7AB96]/10 rounded-lg flex items-center justify-center mt-1">
                      <MapPin size={18} className="text-[#B7AB96]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#706152]">Adrese:</div>
                      <div className="font-semibold">{footerSettings.address}</div>
                    </div>
                  </div>

                </div>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#706152] mb-4">Adoria internetā</h4>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.id}
                        href={social.href}
                        className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#B7AB96] transition-all duration-200 group"
                        aria-label={social.name}
                      >
                        <Image
                          src={social.icon}
                          alt={social.name}
                          width={18}
                          height={18}
                          className="opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Services Grid */}
            <div className="lg:col-span-3">
              {!loading && services.length > 0 && (
                <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
                  {services.map((category) => (
                    <div key={category.id}>
                      <Link href={category.href}>
                        <h4 className="font-bold text-[#706152] mb-4 pb-2 border-b border-[#B7AB96]/30 hover:text-[#B7AB96] transition-colors duration-200 cursor-pointer">
                          {category.title}
                        </h4>
                      </Link>
                      {category.subServices && category.subServices.length > 0 && (
                        <div className="space-y-3">
                          {category.subServices.map((service) => (
                            <div key={service.id} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-full mt-2 flex-shrink-0"></div>
                              <Link
                                href={`/pakalpojumi/${category.title.toLowerCase().replace(/ /g, '-')}#${service.title.toLowerCase().replace(/ /g, '-')}`}
                                className="text-[#706152] hover:text-[#B7AB96] transition-colors duration-200 text-sm leading-relaxed"
                              >
                                {service.title}
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
          
        </div>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-6 md:hidden mb-6">
              {quickLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-[#706152] hover:text-[#B7AB96] transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            
            <div className="text-[#706152] text-sm text-center md:text-left">
              © {new Date().getFullYear()} Adoria | Izstrāde & Uzturēšana:{" "}
              <Link
                href="https://www.facebook.com/mairisdigital/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#B7AB96] transition-colors font-semibold"
              >
                MairisDigital
              </Link>
            </div>

            <div className="hidden md:flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-[#706152] hover:text-[#B7AB96] transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

    </footer>
  )
}

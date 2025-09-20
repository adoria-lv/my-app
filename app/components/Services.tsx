'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ServiceData {
  id: string
  title: string
  icon: string
  description: string
  href: string
  order: number
  isActive: boolean
}

export default function ServicesAlternative() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        const activeServices = data.filter((service: ServiceData) => service.isActive)
        setServices(activeServices)
        
        activeServices.forEach((_: any, index: number) => {
          setTimeout(() => {
            setVisibleIndexes(prev => [...prev, index])
          }, 150 * index)
        })
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      const fallbackServices = [
        {
          id: 'arstnieciba',
          title: 'Ārstniecība',
          icon: '/services/arstnieciba.svg',
          description: 'Vispārējā ārsta konsultācijas un veselības pārbaudes',
          href: '/arstnieciba',
          order: 1,
          isActive: true,
        },
        {
          id: 'ginekologija',
          title: 'Ginekoloģija',
          icon: '/services/ginekologija.svg',
          description: 'Sieviešu veselības aprūpe ar mūsdienīgu aprīkojumu',
          href: '/ginekologija',
          order: 2,
          isActive: true,
        },
        {
          id: 'zobarstnieciba',
          title: 'Zobārstniecība',
          icon: '/services/zobarstnieciba.svg',
          description: 'Mutes dobuma veselības uzturēšana',
          href: '/zobarstnieciba',
          order: 3,
          isActive: true,
        },
        {
          id: 'acu-protezesana',
          title: 'Acu protezēšana',
          icon: '/services/acu-protezesana.svg',
          description: 'Individuālu acu protēžu izgatavošana',
          href: '/acu-protezesana',
          order: 4,
          isActive: true,
        },
        {
          id: 'fizioterapija',
          title: 'Fizioterapija',
          icon: '/services/fizioterapija.svg',
          description: 'Rehabilitācijas un fizioterapijas pakalpojumi',
          href: '/fizioterapija',
          order: 5,
          isActive: true,
        },
        {
          id: 'skaistumkopsana',
          title: 'Skaistumkopšana',
          icon: '/services/skaistumkopsana.svg',
          description: 'Sejas un ķermeņa skaistumkopšanas procedūras',
          href: '/skaistumkopsana',
          order: 6,
          isActive: true,
        }
      ]
      setServices(fallbackServices)
      
      fallbackServices.forEach((_: any, index: number) => {
        setTimeout(() => {
          setVisibleIndexes(prev => [...prev, index])
        }, 150 * index)
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    services.forEach((_, index) => {
      setTimeout(() => {
        setVisibleIndexes(prev => [...prev, index])
      }, 150 * index)
    })
  }, [services])

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-[1250px] mx-auto px-4">

        <div className="text-center mb-6 md:mb-8">
          <div className="section-badge">
            <Sparkles />
            Mūsu pakalpojumi
          </div>
          <h2 className="section-heading">
            Izvēlies pakalpojumu
          </h2>
          <p className="section-subheading">
            Profesionāla medicīniskā aprūpe ar individuālu pieeju katram pacientam
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={service.href}
              className={clsx(
                "group block transition-all duration-700 ease-out",
                visibleIndexes.includes(index) 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-12"
              )}
            >
              <div className="relative bg-gradient-to-br from-white via-gray-50/30 to-white rounded-[12px] md:rounded-[20px] p-3 md:p-6 hover:shadow-xl hover:shadow-[#B7AB96]/10 transition-all duration-500 md:hover:-translate-y-1 border border-gray-100/50 group-hover:border-[#B7AB96]/20">

                <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-[#B7AB96]/5 rounded-full blur-2xl group-hover:bg-[#B7AB96]/10 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 md:w-20 md:h-20 bg-[#706152]/5 rounded-full blur-xl group-hover:bg-[#706152]/8 transition-all duration-500"></div>
                
                <div className="relative mb-2 md:mb-4 flex justify-start">
                  <div className="relative w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-[#B7AB96] to-[#9d9583] rounded-lg md:rounded-2xl flex items-center justify-center group-hover:scale-110 md:group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-[#B7AB96]/20 group-hover:shadow-xl group-hover:shadow-[#B7AB96]/30">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={16}
                      height={16}
                      className="w-4 h-4 md:w-8 md:h-8 brightness-0 invert transition-all duration-300"
                    />
                    {/* Icon Glow Effect */}
                    <div className="absolute inset-0 bg-white/20 rounded-lg md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                <div className="relative z-10 space-y-1 md:space-y-3">
                  <h3 className="text-xs md:text-lg font-bold text-[#706152] group-hover:text-[#B7AB96] transition-all duration-300 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-[#706152] leading-relaxed text-[10px] md:text-sm group-hover:text-[#706152] transition-colors">
                    {service.description}
                  </p>

                  <div className="pt-1 md:pt-3">
                    <div className="inline-flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-gradient-to-r from-[#B7AB96] to-[#a59885] text-white font-semibold rounded-full transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-xl text-[10px] md:text-sm">
                      <span>Uzzināt vairāk</span>
                      <ArrowRight size={10} className="md:w-3 md:h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-8 h-8 md:w-16 md:h-16 bg-gradient-to-bl from-[#B7AB96]/10 to-transparent rounded-bl-xl md:rounded-bl-3xl rounded-tr-[12px] md:rounded-tr-[20px]"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

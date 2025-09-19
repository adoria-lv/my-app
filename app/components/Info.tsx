'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Heart, Shield, Users, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface InfoHighlight {
  id: string
  icon: string
  title: string
  description: string
  order: number
  isActive: boolean
}

interface InfoSection {
  id: string
  title: string
  subtitle: string
  content: string
  isActive: boolean
  highlights: InfoHighlight[]
}

const iconMap = {
  Heart: Heart,
  Shield: Shield,
  Users: Users,
  Star: Star
}

// Default fallback data
const defaultData: InfoSection = {
  id: '',
  title: 'Veselības centrs Adoria – Jūsu veselībai un skaistumam',
  subtitle: 'Par mums',
  content: `<p class="font-medium text-[#706152]">Veselība - tā ir cilvēka vislielākā bagātība.</p>

<p>Mūsu veselības centrs Adoria atrodas Rīgas centrā, blakus Ziedondārzam. Mēs esam komanda, kas veidota no kompetentiem un zinošiem ārstniecības speciālistiem.</p>

<p class="font-semibold text-[#706152]">Centrs Adoria lepojas ar profesionāļiem, kuru mērķis ir sniegt kvalitatīvus pakalpojumus un būt pieejamiem maksimāli īsā laikā.</p>`,
  isActive: true,
  highlights: [
    {
      id: '1',
      icon: 'Heart',
      title: 'Rūpes par pacientiem',
      description: 'Individuāla pieeja un maksimāls komforts katram pacientam.',
      order: 0,
      isActive: true
    },
    {
      id: '2',
      icon: 'Shield',
      title: 'Augsta kvalitāte',
      description: 'Moderni aprīkojumi un metodes visaugstākai pakalpojumu kvalitātei.',
      order: 1,
      isActive: true
    },
    {
      id: '3',
      icon: 'Users',
      title: 'Ekspertu komanda',
      description: 'Kvalificēti speciālisti ar ilggadīgu pieredzi.',
      order: 2,
      isActive: true
    }
  ]
}

export default function Info() {
  const [infoData, setInfoData] = useState<InfoSection>(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInfoData()
  }, [])

  const fetchInfoData = async () => {
    try {
      const response = await fetch('/api/info')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setInfoData(data)
        }
      }
    } catch (error) {
      console.error('Error fetching info data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Heart
    return <IconComponent className="w-6 h-6" />
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-slate-50 via-white to-gray-50/30 relative overflow-hidden">
        <div className="max-w-[1250px] mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section
      className="py-8 md:py-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 25%, #f8f9fa 75%, #f1f3f4 100%)'
      }}
    >
      {/* Dynamic Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-[#B7AB96]/6 to-[#706152]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-[#706152]/4 to-[#B7AB96]/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#B7AB96]/3 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-[#706152]/3 rounded-full blur-2xl" />
      </div>

      <div className="max-w-[1250px] mx-auto px-4 relative z-10">

        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8">
          <div className="section-badge">
            <Heart />
            Par mums
          </div>
          <h2 className="section-heading">
            {(() => {
              const [before, after] = infoData.title.split(' – ')
              if (!after) return infoData.title
              return (
                <>
                  {before}
                  <span> – </span>
                  <span className="bg-gradient-to-r from-[#B7AB96] to-[#706152] bg-clip-text text-transparent">
                    {after}
                  </span>
                </>
              )
            })()}
          </h2>
          <p className="section-subheading">
            Mūsdienīgs veselības centrs ar individuālu pieeju katram pacientam
          </p>
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">

          {/* Left - Content */}
          <div className="space-y-4 md:space-y-6">

            {/* Main Content */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
              <div dangerouslySetInnerHTML={{ __html: infoData.content }}
                   className="text-[#706152] text-sm md:text-base leading-relaxed space-y-3 text-justify" />
            </div>
          </div>

          {/* Right - Highlights Grid */}
          <div className="grid gap-3 md:gap-4 lg:self-center">
            {infoData.highlights.map((highlight, index) => (
              <div
                key={highlight.id}
                className={clsx(
                  "group relative overflow-hidden rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-500",
                  "bg-white border border-gray-100 hover:border-[#B7AB96]/30 hover:shadow-xl hover:shadow-[#B7AB96]/10",
                  "md:hover:-translate-y-1"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >

                {/* Background decorations */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#B7AB96]/10 to-[#706152]/5 rounded-full blur-2xl opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-300" />

                <div className="flex items-start gap-3 md:gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-[#B7AB96] to-[#706152] text-white shadow-lg shadow-[#B7AB96]/20 group-hover:scale-110 transition-transform duration-300">
                    {getIconComponent(highlight.icon)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#706152] text-sm md:text-base mb-1 group-hover:text-[#B7AB96] transition-colors duration-300">
                      {highlight.title}
                    </h4>
                    <p className="text-[#706152]/80 text-xs md:text-sm leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button - Centered */}
        <div className="flex justify-center mt-8">
          <Link
            href="/par-mums"
            className="group relative inline-flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl hover:shadow-[#B7AB96]/20 transition-all duration-300 transform md:hover:-translate-y-1 md:hover:scale-105 overflow-hidden min-h-[40px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Uzzināt vairāk</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
}

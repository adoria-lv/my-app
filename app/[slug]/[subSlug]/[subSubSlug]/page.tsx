'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Breadcrumb from '@/app/components/Breadcrumb'
import { Clock, Users, Phone, Calendar, ArrowLeft, Heart, CheckCircle, Euro } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { parseServiceContentWithReadMore } from '@/lib/contentParser'
import AppointmentDialog from '@/app/components/AppointmentDialog'
import ContactForm from '@/app/components/ContactForm'
import FAQBlock from '@/app/components/FAQBlock'
import Gallery from '@/app/components/Gallery'

interface ServiceData {
  id: string
  title: string
  icon: string
  description: string
  href: string
}

interface SubServiceData {
  id: string
  title: string
  description: string
  href: string
  slug: string
  service: ServiceData
}

interface SubSubServiceData {
  id: string
  title: string
  description: string
  content?: string
  gallery1?: string
  gallery2?: string
  gallery3?: string
  gallery4?: string
  duration?: string
  price?: string
  slug: string
  isActive: boolean
  subService: SubServiceData
}

export default function SubSubServiceDetailPage() {
  const { slug, subSlug, subSubSlug } = useParams()
  const [subSubService, setSubSubService] = useState<SubSubServiceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug && subSlug && subSubSlug) {
      fetchSubSubService()
    }
  }, [slug, subSlug, subSubSlug])

  const fetchSubSubService = async () => {
    try {
      const response = await fetch(`/api/services/${slug}/${subSlug}/${subSubSlug}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubSubService(data)
      } else if (response.status === 404) {
        notFound()
      }
    } catch (error) {
      console.error('Error fetching sub-sub-service:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 overflow-x-hidden">
        <div className="max-w-[1250px] mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!subSubService) {
    return notFound()
  }

  const breadcrumbItems = [
    { label: subSubService.subService.service.title, href: subSubService.subService.service.href },
    { label: subSubService.subService.title, href: `${subSubService.subService.service.href}/${subSubService.subService.slug}` },
    { label: subSubService.title }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 overflow-x-hidden">
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden mb-8 sm:mb-12">
          <div className="bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

            <div className="relative z-10 grid lg:grid-cols-3 gap-6 sm:gap-8 items-start lg:items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Image
                      src={subSubService.subService.service.icon}
                      alt={subSubService.subService.service.title}
                      width={20}
                      height={20}
                      className="brightness-0 invert sm:w-6 sm:h-6"
                    />
                  </div>
                  <span className="text-xs sm:text-sm opacity-75">
                    {subSubService.subService.service.title} → {subSubService.subService.title}
                  </span>
                </div>

                <h1 className="services-heading">
                  {subSubService.title}
                </h1>

                <p className="text-base sm:text-lg opacity-90 mb-5 sm:mb-6 leading-relaxed">
                  {subSubService.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <AppointmentDialog defaultService={subSubService.title}>
                    <div className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-white text-[#706152] rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 cursor-pointer text-sm sm:text-base">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                      Pieteikt vizīti
                    </div>
                  </AppointmentDialog>
                  <Link
                    href={`${subSubService.subService.service.href}/${subSubService.subService.slug}`}
                    className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-bold hover:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    Atpakaļ uz {subSubService.subService.title}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-1 mt-6 lg:mt-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
                  <h3 className="font-bold mb-3 sm:mb-4 text-center text-sm sm:text-base">Pakalpojuma detaļas</h3>

                  <div className="space-y-3">
                    {subSubService.duration && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 opacity-75 flex-shrink-0" />
                        <div>
                          <div className="text-xs sm:text-sm opacity-75">Ilgums</div>
                          <div className="font-medium text-sm sm:text-base">{subSubService.duration}</div>
                        </div>
                      </div>
                    )}

                    {subSubService.price && (
                      <div className="flex items-center gap-3">
                        <Euro className="w-4 h-4 sm:w-5 sm:h-5 opacity-75 flex-shrink-0" />
                        <div>
                          <div className="text-xs sm:text-sm opacity-75">Cena</div>
                          <div className="font-medium text-sm sm:text-base">{subSubService.price}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 opacity-75 flex-shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm opacity-75">Pieejams</div>
                        <div className="font-medium text-sm sm:text-base">Ar pierakstu</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          </div>
        </div>

        {/* Contact Form & Gallery Side by Side */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-slate-50 via-white to-gray-50/30 relative overflow-hidden mb-8 sm:mb-12">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-8 left-4 sm:top-16 sm:left-8 lg:top-20 lg:left-20 w-24 h-24 sm:w-32 sm:h-32 lg:w-80 lg:h-80 bg-gradient-to-br from-[#B7AB96]/8 to-[#706152]/5 rounded-full blur-2xl lg:blur-3xl" />
            <div className="absolute bottom-8 right-4 sm:bottom-16 sm:right-8 lg:bottom-20 lg:right-20 w-28 h-28 sm:w-36 sm:h-36 lg:w-96 lg:h-96 bg-gradient-to-tl from-[#706152]/6 to-[#B7AB96]/8 rounded-full blur-2xl lg:blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-20 h-20 sm:w-24 sm:h-24 lg:w-64 lg:h-64 bg-[#B7AB96]/4 rounded-full blur-xl lg:blur-2xl" />
          </div>

          <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:items-start relative">
              {/* Vertical divider - hidden on mobile */}
              <div className="hidden lg:block absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

              {/* Gallery - Left Side */}
              <div className="order-2 lg:order-1 lg:pr-8">
                {(() => {
                  const galleryImages = [
                    ...(subSubService.gallery1 ? [{
                      id: '1',
                      src: subSubService.gallery1,
                      alt: `${subSubService.title} - attēls 1`,
                      title: subSubService.title
                    }] : []),
                    ...(subSubService.gallery2 ? [{
                      id: '2',
                      src: subSubService.gallery2,
                      alt: `${subSubService.title} - attēls 2`,
                      title: subSubService.title
                    }] : []),
                    ...(subSubService.gallery3 ? [{
                      id: '3',
                      src: subSubService.gallery3,
                      alt: `${subSubService.title} - attēls 3`,
                      title: subSubService.title
                    }] : []),
                    ...(subSubService.gallery4 ? [{
                      id: '4',
                      src: subSubService.gallery4,
                      alt: `${subSubService.title} - attēls 4`,
                      title: subSubService.title
                    }] : [])
                  ].filter(Boolean)

                  return galleryImages.length > 0 ? (
                    <Gallery
                      images={galleryImages}
                      title="Mūsu galerija"
                      className="py-0 bg-transparent"
                    />
                  ) : (
                    <div className="text-center py-8">
                      <div className="section-badge">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm sm:text-base">Galerija</span>
                      </div>
                      <h2 className="section-heading">Mūsu galerija</h2>
                      <div className="mt-6 p-8 bg-[#B7AB96]/5 border-2 border-dashed border-[#B7AB96]/30 rounded-xl">
                        <div className="w-16 h-16 mx-auto mb-4 bg-[#B7AB96]/10 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#B7AB96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-[#706152] text-lg font-medium">Nav pievienota bilde</p>
                        <p className="text-[#706152]/70 text-sm mt-1">Šim pakalpojumam vēl nav pievienoti attēli</p>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Contact Form - Right Side */}
              <div className="order-1 lg:order-2 lg:pl-8">
                <ContactForm
                  preselectedService={subSubService.title}
                  disableServiceSelection={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        {subSubService.content && (
          <div className="sm:bg-white sm:rounded-2xl sm:shadow-lg p-0 sm:p-6 lg:p-8 mb-8 sm:mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-sm sm:prose md:prose-lg mx-auto subServices-heading
                    [&_p]:text-[#706152] [&_p]:mt-3 [&_p]:mb-2 [&_p]:sm:mb-0 [&_p]:text-sm [&_p]:sm:text-base [&_p]:md:text-lg [&_p]:px-0 [&_p]:sm:px-6 [&_p]:lg:px-8
                    [&_li]:text-[#706152] [&_li]:text-sm [&_li]:sm:text-base [&_li]:md:text-lg [&_li]:px-0 [&_li]:sm:px-6 [&_li]:lg:px-8
                    [&_ul]:px-0 [&_ul]:sm:px-6 [&_ul]:lg:px-8 [&_ol]:px-0 [&_ol]:sm:px-6 [&_ol]:lg:px-8
                    [&_h1]:px-0 [&_h1]:sm:px-6 [&_h1]:lg:px-8 [&_h1]:text-lg [&_h1]:sm:text-xl [&_h1]:md:text-2xl [&_h1]:lg:text-3xl
                    [&_h2]:px-0 [&_h2]:sm:px-6 [&_h2]:lg:px-8 [&_h2]:text-base [&_h2]:sm:text-lg [&_h2]:md:text-xl [&_h2]:lg:text-2xl
                    [&_h3]:px-0 [&_h3]:sm:px-6 [&_h3]:lg:px-8 [&_h3]:pt-2 [&_h3]:text-sm [&_h3]:sm:text-base [&_h3]:md:text-lg [&_h3]:lg:text-xl
                    [&_a]:text-[#B7AB96] [&_a]:underline hover:[&_a]:text-[#706152] [&_a]:break-words
                    [&_p]:leading-relaxed [&_li]:mt-1 [&_li]:sm:mt-2 [&_li]:mb-2 [&_li]:sm:mb-2
                    [&_img]:rounded-lg [&_img]:shadow-sm [&_img]:max-w-full [&_img]:h-auto [&_img]:mx-auto
                    [&_table]:text-sm [&_table]:sm:text-base [&_table]:mx-auto
                    [&_*]:max-w-full [&_*]:overflow-hidden [&_*]:break-words"
              >
              {parseServiceContentWithReadMore(subSubService.content || '')}
              </div>
            </div>
          </div>
        )}

        <FAQBlock apiEndpoint={`/api/services/${slug}/${subSlug}/${subSubSlug}/faq`} />

        {/* Benefits/Features */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-12 mb-8 sm:mb-12">
          <h2 className="mb-6 sm:mb-8 text-center">
            Kāpēc izvēlēties mūs?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Pieredzējuši speciālisti</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Mūsu komandā ir kvalificēti ārsti ar daudzgadīgu pieredzi</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Mūsdienīgs aprīkojums</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Izmantojam jaunākās tehnoloģijas un aprīkojumu</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Individuāla pieeja</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Katram pacientam pielāgota ārstēšanas programma</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Ērta atrašanās vieta</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Centrs atrodas Rīgas centrā, viegli pieejams</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Elastīgs grafiks</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Piedāvājam dažādus vizīšu laikus</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 sm:col-span-2 lg:col-span-1">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Kvalitatīva aprūpe</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Garantējam augstu pakalpojumu kvalitāti</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] rounded-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

          <div className="relative z-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <h3 className="mb-2">
              Gatavs pieteikt vizīti?
            </h3>

            <p className="opacity-90 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
              Sazinieties ar mums, lai pieteiktu {subSubService.title.toLowerCase()} pakalpojumu
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="tel:+37167315000"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#706152] px-4 sm:px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                Zvanīt: 67 315 000
              </Link>
              <Link
                href={`${subSubService.subService.service.href}/${subSubService.subService.slug}`}
                className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/20 px-4 sm:px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors text-sm sm:text-base"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                Citi {subSubService.subService.title} pakalpojumi
              </Link>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        </div>
      </div>
    </div>
  )
}
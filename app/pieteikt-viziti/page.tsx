'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  User,
  Calendar,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Clock,
  Heart,
  Shield
} from 'lucide-react'

interface FormData {
  service: string
  name: string
  email: string
  phone: string
  message: string
}

interface ContactInfo {
  phone: string
  email: string
  address: string
}

interface ContactBenefit {
  id: string
  text: string
  order: number
}

export default function PieteiktViziti() {
  const [formData, setFormData] = useState<FormData>({
    service: 'Pieteikt vizīti',
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  // Data from database
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [benefits, setBenefits] = useState<ContactBenefit[]>([])

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0)
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    try {
      const [infoResponse, benefitsResponse] = await Promise.all([
        fetch('/api/contact-info'),
        fetch('/api/contact-benefits')
      ])

      if (infoResponse.ok) {
        const infoData = await infoResponse.json()
        setContactInfo(infoData)
      }

      if (benefitsResponse.ok) {
        const benefitsData = await benefitsResponse.json()
        setBenefits(benefitsData)
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
    }

    // Set fallback data if not already set
    if (!contactInfo) {
      setContactInfo({
        phone: '+371 67 315 000',
        email: 'info@adoria.lv',
        address: 'A. Čaka iela 70-3, Rīga'
      })
    }

    if (benefits.length === 0) {
      setBenefits([
        { id: '1', text: 'Pieredzējuši speciālisti', order: 1 },
        { id: '2', text: 'Moderna aprīkojuma izmantošana', order: 2 },
        { id: '3', text: 'Individuāla pieeja katram pacientam', order: 3 },
        { id: '4', text: 'Ērta pierakstīšanās sistēma', order: 4 },
        { id: '5', text: 'Kvalitatīva apkalpošana', order: 5 },
        { id: '6', text: 'Mājīga un drošāuma vide', order: 6 }
      ])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Form validation
  const isFormValid = formData.service && formData.name && formData.phone && formData.email

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Lūdzu ievadiet savu vārdu'
    } else if (formData.name.trim().length < 4) {
      newErrors.name = 'Vārdam jābūt vismaz 4 simboliem'
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Vārds nedrīkst būt garāks par 100 simboliem'
    } else if (!/^[a-zA-ZĀāČčĒēĢģĪīĶķĻļŅņŠšŪūŽž\s\-']+$/.test(formData.name.trim())) {
      newErrors.name = 'Vārds drīkst saturēt tikai burtus un atstarpes'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Lūdzu ievadiet tālruņa numuru'
    } else {
      // Noņemam visus simbolus, kas nav cipari
      const digitsOnly = formData.phone.replace(/\D/g, '')

      if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
        newErrors.phone = 'Tālruņa numurs drīkst saturēt tikai ciparus, +, -, ( ), un atstarpes'
      } else if (digitsOnly.length < 8) {
        newErrors.phone = 'Tālruņa numuram jābūt vismaz 8 cipariem'
      } else if (digitsOnly.length > 15) {
        newErrors.phone = 'Tālruņa numurs nedrīkst būt garāks par 15 cipariem'
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Lūdzu ievadiet e-pasta adresi'
    } else {
      const email = formData.email.trim().toLowerCase()

      // Stingrāka e-pasta validācija
      const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/

      if (!emailRegex.test(email)) {
        newErrors.email = 'Nederīga e-pasta adrese'
      } else if (email.length > 254) {
        newErrors.email = 'E-pasta adrese ir pārāk gara'
      } else if (email.split('@')[0].length > 64) {
        newErrors.email = 'E-pasta vārds ir pārāk garš'
      } else if (email.includes('..')) {
        newErrors.email = 'E-pasta adresē nedrīkst būt divas punkti pēc kārtas'
      } else if (/^[.-]|[.-]$|@[.-]|[.-]@/.test(email)) {
        newErrors.email = 'E-pasta adrese nedrīkst sākties vai beigties ar punktu vai defisi'
      }
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Radās kļūda')
      }

      // Success
      setIsSubmitted(true)

      // Clear form data
      setFormData({
        service: 'Pieteikt vizīti',
        name: '',
        email: '',
        phone: '',
        message: ''
      })

      setTimeout(() => setIsSubmitted(false), 5000)

    } catch (error) {
      console.error('Error submitting appointment form:', error)
      alert('Radās kļūda nosūtot pieteikumu. Lūdzu mēģiniet vēlreiz.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-8 left-4 sm:top-16 sm:left-8 lg:top-20 lg:left-20 w-24 h-24 sm:w-32 sm:h-32 lg:w-80 lg:h-80 bg-gradient-to-br from-[#B7AB96]/10 to-[#706152]/5 rounded-full blur-2xl lg:blur-3xl" />
        <div className="absolute bottom-8 right-4 sm:bottom-10 sm:right-10 lg:bottom-10 lg:right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-96 lg:h-96 bg-gradient-to-tl from-[#706152]/8 to-[#B7AB96]/6 rounded-full blur-2xl lg:blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-[#B7AB96]/4 rounded-full blur-xl lg:blur-2xl" />
      </div>

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="section-badge mb-6">
            <Calendar />
            <span className="text-sm sm:text-base">Pieteikt vizīti</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#706152] mb-4 leading-tight">
            Rezervējiet savu vizīti
            <br />
            <span className="bg-gradient-to-r from-[#B7AB96] to-[#706152] bg-clip-text text-transparent">
              ērti un ātri
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#706152]/80 max-w-2xl mx-auto leading-relaxed">
            Izvēlieties sev ērtāko laiku un mēs ar jums sazināsimies, lai apstiprinātu vizīti
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="relative group bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-200/50 hover:bg-white hover:shadow-lg hover:shadow-[#B7AB96]/10 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 md:w-7 md:h-7 text-[#B7AB96]" />
              </div>
              <h3 className="text-sm font-semibold text-[#706152] mb-1">Ātri un ērti</h3>
              <p className="text-xs text-[#706152]/70">Pieteikšanās 1 minūtes laikā</p>
            </div>
          </div>

          <div className="relative group bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-200/50 hover:bg-white hover:shadow-lg hover:shadow-[#B7AB96]/10 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 md:w-7 md:h-7 text-[#B7AB96]" />
              </div>
              <h3 className="text-sm font-semibold text-[#706152] mb-1">Rūpīga aprūpe</h3>
              <p className="text-xs text-[#706152]/70">Individuāla pieeja</p>
            </div>
          </div>

          <div className="relative group bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-200/50 hover:bg-white hover:shadow-lg hover:shadow-[#B7AB96]/10 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 md:w-7 md:h-7 text-[#B7AB96]" />
              </div>
              <h3 className="text-sm font-semibold text-[#706152] mb-1">Drošība</h3>
              <p className="text-xs text-[#706152]/70">Pilnīga konfidencialitāte</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-xl shadow-[#B7AB96]/10 border border-gray-200/50 relative">

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start relative">
            {/* Desktop vertical divider */}
            <div className="hidden lg:block absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

            {/* Benefits Section */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#B7AB96] via-[#a59885] to-[#706152] rounded-3xl flex items-center justify-center shadow-xl shadow-[#B7AB96]/30">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#706152]">
                    Kāpēc izvēlēties mūs?
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-[#B7AB96] to-[#706152] rounded-full mt-2" />
                </div>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white/50 to-gray-50/30 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-lg hover:shadow-[#B7AB96]/10 transition-all duration-500 hover:scale-105 hover:-translate-y-1 group/item"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-xl flex items-center justify-center text-white group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300 shadow-lg flex-shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[#706152] font-medium text-sm lg:text-base leading-relaxed group-hover/item:text-[#706152] transition-colors duration-300">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-8 p-6 bg-gradient-to-br from-[#B7AB96]/5 to-[#706152]/5 rounded-xl border border-[#B7AB96]/20">
                <h4 className="text-lg font-bold text-[#706152] mb-4 flex items-center gap-2">
                  Kontaktinformācija
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#B7AB96]" />
                    <a href={`tel:${contactInfo?.phone?.replace(/\s/g, '') || '+37167315000'}`}
                       className="text-[#706152] hover:text-[#B7AB96] transition-colors font-medium">
                      {contactInfo?.phone || '+371 67 315 000'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#B7AB96]" />
                    <a href={`mailto:${contactInfo?.email || 'info@adoria.lv'}`}
                       className="text-[#706152] hover:text-[#B7AB96] transition-colors font-medium">
                      {contactInfo?.email || 'info@adoria.lv'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#B7AB96]" />
                    <span className="text-[#706152] font-medium">
                      {contactInfo?.address || 'A. Čaka iela 70-3, Rīga'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Form Section */}
            <div className="order-1 lg:order-2">
              <div className="text-center mb-6 relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#B7AB96] via-[#a59885] to-[#706152] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#B7AB96]/20">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#706152] mb-2">
                  Pieteikt vizīti
                </h3>
                <p className="text-[#706152]/70 text-sm">
                  Aizpildiet formu un mēs ar jums sazināsimies 24 stundu laikā
                </p>
                <div className="h-1 w-16 bg-gradient-to-r from-[#B7AB96] to-[#706152] rounded-full mx-auto mt-3" />
              </div>

              {isSubmitted ? (
                <div className="text-center py-8 animate-fade-in">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-green-400/30 rounded-full animate-ping" />
                  </div>
                  <h4 className="text-2xl font-bold text-green-600 mb-3">
                    Paldies par pieteikumu!
                  </h4>
                  <p className="text-[#706152] text-lg mb-4">
                    Mēs sazināsimies ar jums tuvākajā laikā.
                  </p>
                  <p className="text-[#706152]/70 text-sm">
                    Ja jums ir steidzams jautājums, zvaniet: {contactInfo?.phone || '+371 67 315 000'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate suppressHydrationWarning>
                  {/* Service Selection - Pre-selected and disabled */}
                  <div className="relative group">
                    <div className="w-full p-4 border-2 border-gray-200/50 rounded-xl bg-gray-50/50 backdrop-blur-sm text-[#706152] font-medium text-base min-h-[48px] flex items-center gap-3 cursor-not-allowed opacity-75">
                      <Calendar className="w-5 h-5 text-[#B7AB96] flex-shrink-0" />
                      <span>Pieteikt vizīti</span>
                      <div className="ml-auto bg-[#B7AB96]/20 text-[#706152] text-xs px-2 py-1 rounded-full font-medium">
                        Izvēlēts
                      </div>
                    </div>
                    <input
                      type="hidden"
                      name="service"
                      value={formData.service}
                    />
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="relative group">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Jūsu vārds"
                          className={`w-full p-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-[#B7AB96]/10 outline-none transition-all duration-300 pl-12 hover:bg-white font-medium text-base min-h-[48px] ${
                            errors.name
                              ? 'border-red-300 focus:border-red-400 hover:border-red-400'
                              : 'border-gray-200/50 focus:border-[#B7AB96] hover:border-[#B7AB96]/50'
                          }`}
                          suppressHydrationWarning
                        />
                        <User className="w-5 h-5 text-[#706152] absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-[#B7AB96] transition-colors duration-300" />
                      </div>
                      <div className="min-h-[20px]">
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="relative group">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Tālruņa numurs"
                          className={`w-full p-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-[#B7AB96]/10 outline-none transition-all duration-300 pl-12 hover:bg-white font-medium text-base min-h-[48px] ${
                            errors.phone
                              ? 'border-red-300 focus:border-red-400 hover:border-red-400'
                              : 'border-gray-200/50 focus:border-[#B7AB96] hover:border-[#B7AB96]/50'
                          }`}
                          suppressHydrationWarning
                        />
                        <Phone className="w-5 h-5 text-[#706152] absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-[#B7AB96] transition-colors duration-300" />
                      </div>
                      <div className="min-h-[20px]">
                        {errors.phone && (
                          <p className="text-sm text-red-500">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="E-pasta adrese"
                        className={`w-full p-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-[#B7AB96]/10 outline-none transition-all duration-300 pl-12 hover:bg-white font-medium text-base min-h-[48px] ${
                          errors.email
                            ? 'border-red-300 focus:border-red-400 hover:border-red-400'
                            : 'border-gray-200/50 focus:border-[#B7AB96] hover:border-[#B7AB96]/50'
                        }`}
                        suppressHydrationWarning
                      />
                      <Mail className="w-5 h-5 text-[#706152] absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-[#B7AB96] transition-colors duration-300" />
                    </div>
                    <div className="min-h-[20px]">
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="relative group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Jūsu komentārs vai vēlamais vizītes laiks"
                      rows={4}
                      className="w-full p-4 border-2 border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#B7AB96] focus:ring-2 focus:ring-[#B7AB96]/10 outline-none transition-all duration-300 pl-12 resize-none hover:bg-white hover:border-[#B7AB96]/50 font-medium text-base"
                      suppressHydrationWarning
                    />
                    <MessageCircle className="w-5 h-5 text-[#706152] absolute left-4 top-4 group-hover:text-[#B7AB96] transition-colors duration-300" />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={clsx(
                      "group relative w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-base shadow-xl transition-all duration-300 transform overflow-hidden min-h-[56px] bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] text-white",
                      !isFormValid || isSubmitting
                        ? "cursor-not-allowed opacity-70"
                        : "hover:shadow-2xl hover:shadow-[#B7AB96]/30 hover:-translate-y-1 hover:scale-105"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Nosūta pieteikumu...</span>
                      </div>
                    ) : (
                      <>
                        <span className="relative z-10">Pieteikt vizīti</span>
                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#B7AB96]/15 to-[#706152]/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tl from-[#706152]/15 to-[#B7AB96]/10 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  )
}
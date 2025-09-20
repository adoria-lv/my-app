'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import {
  Phone,
  Mail,
  CheckCircle,
  User,
  Calendar,
  MessageCircle,
  ArrowRight
} from 'lucide-react'

interface FormData {
  service: string
  name: string
  email: string
  phone: string
  message: string
}

interface ContactService {
  id: string
  name: string
  order: number
}

interface ContactFormProps {
  preselectedService?: string
  disableServiceSelection?: boolean
}

export default function ContactForm({ preselectedService, disableServiceSelection = false }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    service: preselectedService || '',
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [services, setServices] = useState<ContactService[]>([
    { id: '1', name: 'Ārstniecība', order: 1 },
    { id: '2', name: 'Ginekoloģija', order: 2 },
    { id: '3', name: 'Zobārstniecība', order: 3 },
    { id: '4', name: 'Acu protezēšana', order: 4 },
    { id: '5', name: 'Fizioterapija', order: 5 },
    { id: '6', name: 'Skaistumkopšana', order: 6 },
    { id: '7', name: 'Izmeklējumi', order: 7 },
    { id: '8', name: 'E-pakalpojumi', order: 8 }
  ])

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/contact-services')
      if (response.ok) {
        const servicesData = await response.json()
        setServices(servicesData)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const isFormValid = (formData.service || preselectedService) && formData.name && formData.phone && formData.email

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}

    if (!formData.service.trim() && !preselectedService) {
      newErrors.service = 'Lūdzu izvēlieties pakalpojumu'
    }

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
      const submitData = {
        ...formData,
        service: formData.service || preselectedService || ''
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Radās kļūda')
      }

      setIsSubmitted(true)

      setFormData({
        service: preselectedService || '',
        name: '',
        email: '',
        phone: '',
        message: ''
      })

      setTimeout(() => setIsSubmitted(false), 5000)

    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('Radās kļūda nosūtot ziņojumu. Lūdzu mēģiniet vēlreiz.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
        <div className="text-center mb-6 md:mb-8">
          <div className="section-badge">
            <Phone />
            <span className="text-sm sm:text-base">Sazinieties ar mums</span>
          </div>
          <h2 className="section-heading">
            Pieteikt vizīti
          </h2>
        </div>

        <div className="p-4 md:p-6 transition-all duration-500 relative overflow-hidden">

          {isSubmitted ? (
            <div className="text-center py-6 md:py-8 animate-fade-in">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-green-400/30 rounded-full animate-ping" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-green-600 mb-2 sm:mb-3">
                Paldies par pieteikumu!
              </h4>
              <p className="text-[#706152] text-base sm:text-lg">
                Mēs sazināsimies ar jums tuvākajā laikā.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-1 md:space-y-1" noValidate suppressHydrationWarning>
              <div className="space-y-1">
                <div className="relative group">
                  {(disableServiceSelection && preselectedService) || (preselectedService && formData.service) ? (
                    <div className="w-full p-3 md:p-4 border-2 border-gray-200/50 rounded-xl bg-gray-50/50 backdrop-blur-sm text-[#706152] font-medium text-sm md:text-base min-h-[40px] flex items-center gap-3 cursor-not-allowed opacity-75">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#B7AB96] flex-shrink-0" />
                      <span>{preselectedService || formData.service}</span>
                      <div className="ml-auto bg-[#B7AB96]/20 text-[#706152] text-xs px-2 py-1 rounded-full font-medium">
                        Izvēlēts
                      </div>
                      <input
                        type="hidden"
                        name="service"
                        value={preselectedService || formData.service}
                      />
                    </div>
                  ) : (
                    <>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className={`w-full p-3 md:p-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm text-[#706152] focus:ring-2 focus:ring-[#B7AB96]/10 outline-none transition-all duration-300 appearance-none pr-10 hover:bg-white font-medium text-sm md:text-base min-h-[40px] ${
                          errors.service
                            ? 'border-red-300 focus:border-red-400 hover:border-red-400'
                            : 'border-gray-200/50 focus:border-[#B7AB96] hover:border-[#B7AB96]/50'
                        }`}
                        suppressHydrationWarning
                      >
                        <option value="" disabled hidden>
                          Izvēlieties pakalpojumu
                        </option>
                        {services.map((service) => (
                          <option key={service.id} value={service.name}>{service.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-[#B7AB96] transition-colors duration-300">
                        <svg width="20" height="20" fill="currentColor" className="text-[#706152]">
                          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      </div>
                    </>
                  )}
                </div>
                {/* Error message container with consistent height */}
                <div className="min-h-[20px]">
                  {errors.service && !preselectedService && (
                    <p className="text-sm text-red-500">{errors.service}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1">
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jūsu vārds"
                      className={`w-full p-3 md:p-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-[#B7AB96]/10 outline-none transition-all duration-300 pl-10 md:pl-12 hover:bg-white font-medium text-sm md:text-base min-h-[40px] autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] autofill:text-[#706152] ${
                        errors.name
                          ? 'border-red-300 focus:border-red-400 hover:border-red-400'
                          : 'border-gray-200/50 focus:border-[#B7AB96] hover:border-[#B7AB96]/50'
                      }`}
                      suppressHydrationWarning
                    />
                    <User className="w-4 h-4 md:w-5 md:h-5 text-[#706152] absolute left-3 md:left-4 top-1/2 -translate-y-1/2 group-hover:text-[#B7AB96] transition-colors duration-300" />
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
                      placeholder="Telefons"
                      className={`w-full p-3 md:p-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-[#B7AB96]/10 outline-none transition-all duration-300 pl-10 md:pl-12 hover:bg-white font-medium text-sm md:text-base min-h-[40px] autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] autofill:text-[#706152] ${
                        errors.phone
                          ? 'border-red-300 focus:border-red-400 hover:border-red-400'
                          : 'border-gray-200/50 focus:border-[#B7AB96] hover:border-[#B7AB96]/50'
                      }`}
                      suppressHydrationWarning
                    />
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-[#706152] absolute left-3 md:left-4 top-1/2 -translate-y-1/2 group-hover:text-[#B7AB96] transition-colors duration-300" />
                  </div>
                  <div className="min-h-[20px]">
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E-pasta adrese"
                    className={`w-full p-3 md:p-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-[#B7AB96]/10 outline-none transition-all duration-300 pl-10 md:pl-12 hover:bg-white font-medium text-sm md:text-base min-h-[40px] autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] autofill:text-[#706152] ${
                      errors.email
                        ? 'border-red-300 focus:border-red-400 hover:border-red-400'
                        : 'border-gray-200/50 focus:border-[#B7AB96] hover:border-[#B7AB96]/50'
                    }`}
                    suppressHydrationWarning
                  />
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#706152] absolute left-3 md:left-4 top-1/2 -translate-y-1/2 group-hover:text-[#B7AB96] transition-colors duration-300" />
                </div>
                <div className="min-h-[20px]">
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="relative group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Jūsu komentārs"
                  rows={4}
                  className="w-full p-3 md:p-4 border-2 border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#B7AB96] focus:ring-2 focus:ring-[#B7AB96]/10 outline-none transition-all duration-300 pl-10 md:pl-12 resize-none hover:bg-white hover:border-[#B7AB96]/50 font-medium text-sm md:text-base autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] autofill:text-[#706152]"
                  suppressHydrationWarning
                />
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-[#706152] absolute left-3 md:left-4 top-4 md:top-5 group-hover:text-[#B7AB96] transition-colors duration-300" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={clsx(
                  "group relative w-full inline-flex items-center justify-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-base shadow-lg transition-all duration-300 transform overflow-hidden min-h-[40px] bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] text-white",
                  isSubmitting
                    ? "cursor-not-allowed opacity-70"
                    : "hover:shadow-xl hover:shadow-[#B7AB96]/20 md:hover:-translate-y-1 md:hover:scale-105"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Nosūta...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Nosūtīt pieteikumu</span>
                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>
    </div>
  )
}

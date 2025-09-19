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
  Sparkles
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

interface ContactService {
  id: string
  name: string
  order: number
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    service: '',
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
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    try {
      const [infoResponse, benefitsResponse, servicesResponse] = await Promise.all([
        fetch('/api/contact-info'),
        fetch('/api/contact-benefits'),
        fetch('/api/contact-services')
      ])

      if (infoResponse.ok) {
        const infoData = await infoResponse.json()
        setContactInfo(infoData)
      }

      if (benefitsResponse.ok) {
        const benefitsData = await benefitsResponse.json()
        console.log('Benefits data from API:', benefitsData)
        setBenefits(benefitsData)
      } else {
        console.log('Benefits API failed, using fallback data')
      }

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json()
        setServices(servicesData)
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
        { id: '1', text: 'Augsti kvalificēti speciālisti', order: 1 },
        { id: '2', text: 'Mājīga vide', order: 2 },
        { id: '3', text: 'Ērta atrašanās vieta', order: 3 },
        { id: '4', text: 'Sadarbība ar citām klīnikām', order: 4 },
        { id: '5', text: 'Palīdzība akūtās situācijās', order: 5 },
        { id: '6', text: 'Pakalpojumi visai ģimenei', order: 6 }
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

    if (!formData.service.trim()) {
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
        service: '',
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
    <section className="py-8 md:py-12 bg-gradient-to-br from-slate-50 via-white to-gray-50/30 relative overflow-hidden">
      {/* Mobile-optimized Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-8 left-4 sm:top-16 sm:left-8 lg:top-20 lg:left-20 w-24 h-24 sm:w-32 sm:h-32 lg:w-80 lg:h-80 bg-gradient-to-br from-[#B7AB96]/10 to-[#706152]/5 rounded-full blur-2xl lg:blur-3xl" />
        <div className="absolute bottom-8 right-4 sm:bottom-10 sm:right-10 lg:bottom-10 lg:right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-96 lg:h-96 bg-gradient-to-tl from-[#706152]/8 to-[#B7AB96]/6 rounded-full blur-2xl lg:blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-[#B7AB96]/4 rounded-full blur-xl lg:blur-2xl" />
      </div>
  
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile-optimized Header */}
        <div className="text-center mb-6 md:mb-8">
        <div className="section-badge">
            <Phone />
            <span className="text-sm sm:text-base">Sazinieties ar mums</span>
          </div>
          <h2 className="section-heading">
            Esam šeit, lai palīdzētu
          </h2>
          <p className="section-subheading">
            Izvēlieties sev ērtāko veidu, kā ar mums sazināties. Mēs atbildēsim pēc iespējas ātrāk!
          </p>
        </div>
  
        {/* Mobile-optimized Contact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Phone Card - Mobile optimized */}
          <div className="relative group bg-gradient-to-br from-[#B7AB96] via-[#a59885] to-[#706152] rounded-lg md:rounded-xl p-3 md:p-4 text-white overflow-hidden md:hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 md:mb-3 mx-auto group-hover:scale-110 transition-all duration-300">
                <Phone className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-xs font-medium mb-1 md:mb-2 text-white/90">Zvaniet tūlīt</div>
              <a
                href={`tel:${contactInfo?.phone?.replace(/\s/g, '') || '+37167315000'}`}
                className="text-sm md:text-base font-bold hover:text-white/80 transition-colors flex items-center gap-1 md:gap-2 justify-center min-h-[36px]">
                {contactInfo?.phone || '+371 67 315 000'}
                <ArrowRight size={14} className="md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 md:w-12 md:h-12 bg-white/10 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500" />
          </div>
  
          {/* Location Card - Mobile optimized */}
          <div className="relative group bg-white/90 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200/50 hover:bg-white hover:shadow-md hover:shadow-[#B7AB96]/10 transition-all duration-300 md:hover:scale-105">
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-xl flex items-center justify-center mb-2 md:mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#B7AB96]" />
              </div>
              <div className="text-xs font-medium text-[#706152] mb-1 md:mb-2">Atrašanās vieta</div>
              <p className="text-xs md:text-sm text-[#706152] font-semibold leading-relaxed">{contactInfo?.address || 'A. Čaka iela 70-3, Rīga'}</p>
            </div>
            <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-1">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#B7AB96] rounded-full" />
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#706152] rounded-full" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Mobile-optimized Main content block */}
        <div className="bg-white/90 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg shadow-[#B7AB96]/10 border border-gray-200/50 hover:shadow-xl hover:shadow-[#B7AB96]/15 transition-all duration-500 relative overflow-hidden">
          
          {/* Mobile: Single column, Desktop: Grid layout */}
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start relative">
            {/* Desktop vertical divider - hidden on mobile */}
            <div className="hidden lg:block absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
            
            {/* Benefits Section - Mobile optimized */}
            <div className="order-2 lg:order-1 lg:flex lg:items-center lg:justify-center lg:h-full">
              <div className="w-full">
                {/* Mobile-optimized Benefits Header */}
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[#B7AB96] via-[#a59885] to-[#706152] rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-xl shadow-[#B7AB96]/30">
                      <Sparkles className="w-6 h-6 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#706152]">
                      Kāpēc izvēlēties mūs?
                    </h3>
                    <div className="h-0.5 sm:h-1 w-12 sm:w-16 bg-gradient-to-r from-[#B7AB96] to-[#706152] rounded-full mt-1 sm:mt-2" />
                  </div>
                </div>
              
                {/* Mobile-optimized Benefits Grid */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={benefit.id}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-3 rounded-xl bg-gradient-to-r from-white/50 to-gray-50/30 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:shadow-lg hover:shadow-[#B7AB96]/10 transition-all duration-500 hover:scale-105 hover:-translate-y-1 group/item"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-xl flex items-center justify-center text-white group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300 shadow-lg flex-shrink-0">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[#706152] font-medium text-sm sm:text-sm lg:text-sm leading-relaxed group-hover/item:text-[#706152] transition-colors duration-300">
                        {benefit.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Contact Form Section - Mobile optimized */}
            <div className="order-1 lg:order-2">
              {/* Mobile-optimized Form Header */}
              <div className="text-center mb-4 md:mb-6 relative">
                <div className="relative mx-auto mb-3 md:mb-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#B7AB96] via-[#a59885] to-[#706152] rounded-xl md:rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#B7AB96]/20">
                    <Calendar className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#706152] mb-2">
                  Pieteikt vizīti šeit
                </h3>
                <p className="text-[#706152] text-xs md:text-sm">
                  vai apmeklējiet <span className="text-[#B7AB96] font-semibold">kontaktu sadaļu</span>
                </p>
                <div className="h-0.5 w-12 md:w-16 bg-gradient-to-r from-[#B7AB96] to-[#706152] rounded-full mx-auto mt-2 md:mt-3 transition-all duration-300" />
              </div>
  
              {isSubmitted ? (
                /* Mobile-optimized Success Message */
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
                /* Mobile-optimized Contact Form */
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4" noValidate suppressHydrationWarning>
                  {/* Mobile-optimized Service Selection */}
                  <div className="relative group">
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
                    {errors.service && (
                      <p className="mt-1 text-sm text-red-500">{errors.service}</p>
                    )}
                  </div>
  
                  {/* Mobile-optimized Name & Phone */}
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
                          placeholder="Tālruņa numurs"
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
  
                  {/* Mobile-optimized Email */}
                  <div className="space-y-1">
                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="E-pasta adrese"
                        className={`w-full p-4 sm:p-5 border-2 rounded-2xl bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-[#B7AB96]/10 outline-none transition-all duration-300 pl-12 sm:pl-14 hover:bg-white group-hover:shadow-lg font-medium text-base min-h-[44px] autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] autofill:text-[#706152] ${
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
  
                  {/* Mobile-optimized Message */}
                  <div className="relative group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Jūsu komentārs"
                      rows={4}
                      className="w-full p-4 sm:p-5 border-2 border-gray-200/50 rounded-2xl bg-white/50 backdrop-blur-sm focus:border-[#B7AB96] focus:ring-4 focus:ring-[#B7AB96]/10 outline-none transition-all duration-300 pl-12 sm:pl-14 resize-none hover:bg-white hover:border-[#B7AB96]/50 group-hover:shadow-lg font-medium text-base autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] autofill:text-[#706152]"
                      suppressHydrationWarning
                    />
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-[#706152] absolute left-3 md:left-4 top-4 md:top-5 group-hover:text-[#B7AB96] transition-colors duration-300" />
                  </div>
  
                  {/* Mobile-optimized Submit Button */}
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={clsx(
                      "group relative w-full inline-flex items-center justify-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-base shadow-lg transition-all duration-300 transform overflow-hidden min-h-[40px] bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] text-white",
                      !isFormValid || isSubmitting
                        ? "cursor-not-allowed"
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
  
          {/* Mobile-optimized Decorative elements */}
          <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-[#B7AB96]/15 to-[#706152]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-tl from-[#706152]/15 to-[#B7AB96]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute top-1/4 -left-2 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-[#B7AB96]/10 rounded-full blur-xl" />
          <div className="absolute bottom-1/4 -right-2 sm:-right-4 w-14 h-14 sm:w-20 sm:h-20 bg-[#706152]/10 rounded-full blur-xl" />
        </div>
      </div>
    </section>
  )
}
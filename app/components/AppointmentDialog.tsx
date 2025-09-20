'use client'

import { useState } from 'react'
import { Calendar, User, Phone, Mail, MessageCircle, X, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { clsx } from 'clsx'

interface AppointmentDialogProps {
  children: React.ReactNode
  defaultService?: string
}

const services = [
  'Vispārējā ārstniecība',
  'Ginekoloģija',
  'Zobārstniecība',
  'Acu protezēšana',
  'Fizioterapija',
  'Skaistumkopšana',
  'Izmeklējumi',
  'E-pakalpojumi'
]


const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30'
]

export default function AppointmentDialog({ children, defaultService }: AppointmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: defaultService || '',
    date: '',
    time: '',
    message: '',
    contactPreferences: {
      phone: false,
      email: false
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Merge defaultService if not already in services
  const allServices = (defaultService && !services.includes(defaultService))
    ? [defaultService, ...services]
    : services

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleContactPreferenceChange = (type: 'phone' | 'email', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      contactPreferences: {
        ...prev.contactPreferences,
        [type]: checked
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/appointment', {
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

      // Reset form and close dialog
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: defaultService || '',
        date: '',
        time: '',
        message: '',
        contactPreferences: {
          phone: false,
          email: false
        }
      })
      setIsOpen(false)
      
      // Show success message
      toast.success('Jūsu pieteikums ir nosūtīts! Mēs ar jums sazināsimies tuvākajā laikā.', {
        duration: 5000
      })

    } catch (error) {
      console.error('Error submitting appointment:', error)
      toast.error('Radās kļūda nosūtot pieteikumu. Lūdzu mēģiniet vēlreiz.', {
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.phone && formData.email && formData.service && formData.date && formData.time

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent
        className="w-full !max-w-[800px] max-h-[90vh] bg-white/98 backdrop-blur-xl border-2 border-gray-200/50 shadow-2xl shadow-[#B7AB96]/20 sm:rounded-3xl rounded-2xl overflow-hidden flex flex-col"
        showCloseButton={false}
      >
        {/* DialogHeader with custom close button and new structure */}
        <DialogHeader className="flex-shrink-0 text-center px-2 sm:px-6 pb-6 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B7AB96]/8 to-transparent rounded-full blur-2xl z-0"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-[#706152]/8 to-transparent rounded-full blur-xl z-0"></div>
          {/* Custom Close Button (top-right) */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#B7AB96]/10 hover:bg-[#B7AB96]/20 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg focus:outline-none focus:ring-0"
            aria-label="Aizvērt"
            type="button"
          >
            <X className="w-6 h-6 text-[#706152]" />
          </button>
          {/* Calendar icon centered */}
          <div className="mx-auto mb-2 flex items-center justify-center relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#B7AB96] via-[#a59885] to-[#706152] rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          {/* Title and subtitle centered */}
          <DialogTitle className="relative z-10 text-3xl sm:text-4xl font-bold text-[#706152] mb-1 text-center">
            Pieteikt vizīti
          </DialogTitle>
          <div className="relative z-10 text-lg sm:text-xl font-semibold text-[#B7AB96] text-center">
            Veselības centrs Adoria
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-3 sm:px-6">
          {/* Separator Line */}
          <div className="border-t border-gradient-to-r from-[#B7AB96]/30 via-[#B7AB96]/20 to-[#B7AB96]/30 mb-6"></div>

          {/* Form Instruction */}
          <div className="text-left mb-8">
            <p className="relative z-10 text-[#706152]/80 text-base sm:text-lg leading-relaxed">
              Aizpildiet pieteikuma formu un mēs ar jums sazināsimies <span className="text-[#B7AB96] font-semibold">tuvākajā</span> laikā,
              lai apstiprinātu vizītes laiku.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 py-6 sm:py-8 w-full overflow-hidden">
          {/* Personal Information */}
          <div className="space-y-4 sm:space-y-6 relative">
            {/* Decorative line */}
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#B7AB96] to-[#706152] rounded-full opacity-30"></div>
            
            <h3 className="text-xl font-bold text-[#706152] flex items-center gap-3 pl-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/20 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 text-[#706152]" />
              </div>
              Personālā informācija
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-end">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-[#706152]">
                  Vārds un uzvārds *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Jūsu vārds un uzvārds"
                  className="border border-[#B7AB96] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none h-10 sm:h-12 rounded-lg sm:rounded-xl focus:border-[#B7AB96] transition-all duration-300 bg-gray-50/50 focus:bg-white hover:bg-white shadow-sm hover:shadow-md text-sm sm:text-base autofill:shadow-[inset_0_0_0px_1000px_rgb(249,250,251)] autofill:text-[#B7AB96]"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-[#706152]">
                  Tālrunis *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+371 xxxxxxxx"
                  className="border border-[#B7AB96]/30 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none h-10 sm:h-12 rounded-lg sm:rounded-xl focus:border-[#B7AB96] transition-all duration-300 bg-[#B7AB96]/5 focus:bg-white hover:bg-white shadow-sm hover:shadow-md text-sm sm:text-base autofill:shadow-[inset_0_0_0px_1000px_rgb(249,248,246)] autofill:text-[#706152]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#706152]">
                E-pasts
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="JanisBerzins@adoria.lv"
                className="border border-[#B7AB96]/30 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none h-10 sm:h-12 rounded-lg sm:rounded-xl focus:border-[#B7AB96] transition-all duration-300 bg-[#B7AB96]/5 focus:bg-white hover:bg-white shadow-sm hover:shadow-md text-sm sm:text-base autofill:shadow-[inset_0_0_0px_1000px_rgb(249,248,246)] autofill:text-[#706152]"
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4 sm:space-y-6 relative">
            {/* Decorative line */}
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#B7AB96] to-[#706152] rounded-full opacity-30"></div>
            
            <h3 className="text-xl font-bold text-[#706152] flex items-center gap-3 pl-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#706152]" />
              </div>
              Vizītes informācija
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="service" className="text-sm font-medium text-[#706152]">
                  Pakalpojums *
                </Label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                  <SelectTrigger className="border border-[#B7AB96]/30 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none h-10 sm:h-12 rounded-lg sm:rounded-xl focus:border-[#B7AB96] transition-all duration-300 bg-[#B7AB96]/5 focus:bg-white hover:bg-white shadow-sm hover:shadow-md text-sm sm:text-base">
                    <SelectValue placeholder="Izvēlieties pakalpojumu" />
                  </SelectTrigger>
                  <SelectContent>
                    {allServices.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="time" className="text-sm font-medium text-[#706152]">
                  Vēlamais laiks *
                </Label>
                <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                  <SelectTrigger className="border border-[#B7AB96]/30 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none h-10 sm:h-12 rounded-lg sm:rounded-xl focus:border-[#B7AB96] transition-all duration-300 bg-[#B7AB96]/5 focus:bg-white hover:bg-white shadow-sm hover:shadow-md text-sm sm:text-base">
                    <SelectValue placeholder="Izvēlieties laiku" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-[#706152]">
                  Vēlamais datums *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="border border-[#B7AB96]/30 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none h-10 sm:h-12 rounded-lg sm:rounded-xl focus:border-[#B7AB96] transition-all duration-300 bg-[#B7AB96]/5 focus:bg-white hover:bg-white shadow-sm hover:shadow-md text-sm sm:text-base autofill:shadow-[inset_0_0_0px_1000px_rgb(249,248,246)] autofill:text-[#706152]"
                  required
                />
              </div>
                  
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-[#706152]">
                Papildu informācija
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Norādiet papildu informāciju par vizīti, simptomus vai jautājumus..."
                className="border border-[#B7AB96]/30 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none min-h-[80px] sm:min-h-[100px] rounded-lg sm:rounded-xl focus:border-[#B7AB96] resize-none transition-all duration-300 bg-[#B7AB96]/5 focus:bg-white hover:bg-white shadow-sm hover:shadow-md text-sm sm:text-base"
                rows={4}
              />
            </div>

            

            {/* Contact Preferences */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#706152]">
                Kā vēlaties saņemt atbildi?
              </Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.contactPreferences.phone}
                      onChange={() => setFormData(prev => ({
                        ...prev,
                        contactPreferences: { phone: true, email: false }
                      }))}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                      formData.contactPreferences.phone
                        ? 'border-[#B7AB96] bg-[#B7AB96]'
                        : 'border-[#B7AB96]/40'
                    }`}>
                      {formData.contactPreferences.phone && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-[#706152] flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#B7AB96]" />
                    Telefoniski
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.contactPreferences.email}
                      onChange={() => setFormData(prev => ({
                        ...prev,
                        contactPreferences: { phone: false, email: true }
                      }))}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                      formData.contactPreferences.email
                        ? 'border-[#B7AB96] bg-[#B7AB96]'
                        : 'border-[#B7AB96]/40'
                    }`}>
                      {formData.contactPreferences.email && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-[#706152] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#B7AB96]" />
                    E-pastā
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          {(formData.date || formData.time || formData.service) && (
            <div className="bg-gradient-to-r from-[#B7AB96]/5 to-[#706152]/5 rounded-2xl p-6 border border-[#B7AB96]/20">
              <h4 className="text-lg font-semibold text-[#706152] mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#B7AB96]" />
                Jūsu izvēle
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                {formData.service && (
                  <div className="flex flex-col">
                    <span className="text-[#B7AB96] font-medium mb-1">Pakalpojums</span>
                    <span className="text-[#706152] font-semibold">{formData.service}</span>
                  </div>
                )}
                {formData.date && (
                  <div className="flex flex-col">
                    <span className="text-[#B7AB96] font-medium mb-1">Datums</span>
                    <span className="text-[#706152] font-semibold">
                      {new Date(formData.date + 'T00:00:00').toLocaleDateString('en-GB')}
                    </span>
                  </div>
                )}
                {formData.time && (
                  <div className="flex flex-col">
                    <span className="text-[#B7AB96] font-medium mb-1">Laiks</span>
                    <span className="text-[#706152] font-semibold">{formData.time}</span>
                  </div>
                )}
              </div>
            </div>
          )}

            <p className="relative z-10">
              <small className="text-red-700">
                * Pirms došanās pie speciālista sagaidiet apstiprinājuma zvanu vai e-pastu no administrācijas.
              </small>
            </p>
          
          <div className="pt-6 border-t border-gradient-to-r from-[#B7AB96]/30 via-[#B7AB96]/20 to-[#B7AB96]/30 relative">
            
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={clsx(
                "w-full h-10 sm:h-12 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-500 transform relative overflow-hidden shadow-lg",
                isFormValid && !isSubmitting
                  ? "bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] hover:from-[#a59885] hover:via-[#9d9583] hover:to-[#5f5449] text-white hover:shadow-2xl hover:shadow-[#B7AB96]/30 hover:-translate-y-1 hover:scale-105"
                  : "bg-[#B7AB96]/30 text-[#706152]/60 cursor-not-allowed"
              )}
            >

              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {isSubmitting ? (
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Nosūta pieteikumu...</span>
                </div>
              ) : (
                <span className="relative z-10">Pieteikt vizīti</span>
              )}
            </Button>
          </div>

          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
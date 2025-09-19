'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Phone, Mail, MapPin, CheckCircle, Eye, EyeOff } from 'lucide-react'

interface ContactInfoData {
  id?: string
  phone: string
  email: string
  address: string
  isActive: boolean
}

interface ContactBenefitData {
  id?: string
  text: string
  order: number
  isActive: boolean
}

interface ContactServiceData {
  id?: string
  name: string
  order: number
  isActive: boolean
}

export default function ContactAdmin() {
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null)
  const [benefits, setBenefits] = useState<ContactBenefitData[]>([])
  const [services, setServices] = useState<ContactServiceData[]>([])
  const [loading, setLoading] = useState(true)

  const [editingInfo, setEditingInfo] = useState<ContactInfoData | null>(null)
  const [editingBenefit, setEditingBenefit] = useState<ContactBenefitData | null>(null)
  const [editingService, setEditingService] = useState<ContactServiceData | null>(null)

  const [showInfoForm, setShowInfoForm] = useState(false)
  const [showBenefitForm, setShowBenefitForm] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
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
        setBenefits(benefitsData)
      }

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json()
        setServices(servicesData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveContactInfo = async (data: ContactInfoData) => {
    try {
      const method = data.id ? 'PUT' : 'POST'
      const response = await fetch('/api/contact-info', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Kontaktu informācija saglabāta!')
        fetchData()
        setEditingInfo(null)
        setShowInfoForm(false)
      } else {
        toast.error('Kļūda saglabājot')
      }
    } catch (error) {
      console.error('Error saving contact info:', error)
      toast.error('Kļūda saglabājot')
    }
  }

  const saveBenefit = async (data: ContactBenefitData) => {
    try {
      const method = data.id ? 'PUT' : 'POST'
      const response = await fetch('/api/contact-benefits', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Priekšrocība saglabāta!')
        fetchData()
        setEditingBenefit(null)
        setShowBenefitForm(false)
      } else {
        toast.error('Kļūda saglabājot')
      }
    } catch (error) {
      console.error('Error saving benefit:', error)
      toast.error('Kļūda saglabājot')
    }
  }

  const saveService = async (data: ContactServiceData) => {
    try {
      const method = data.id ? 'PUT' : 'POST'
      const response = await fetch('/api/contact-services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Pakalpojums saglabāts!')
        fetchData()
        setEditingService(null)
        setShowServiceForm(false)
      } else {
        toast.error('Kļūda saglabājot')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('Kļūda saglabājot')
    }
  }

  const deleteBenefit = async (id: string) => {
    if (!confirm('Vai tiešām dzēst šo priekšrocību?')) return

    try {
      const response = await fetch(`/api/contact-benefits?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Priekšrocība dzēsta!')
        fetchData()
      } else {
        toast.error('Kļūda dzēšot')
      }
    } catch (error) {
      console.error('Error deleting benefit:', error)
      toast.error('Kļūda dzēšot')
    }
  }

  const deleteService = async (id: string) => {
    if (!confirm('Vai tiešām dzēst šo pakalpojumu?')) return

    try {
      const response = await fetch(`/api/contact-services?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Pakalpojums dzēsts!')
        fetchData()
      } else {
        toast.error('Kļūda dzēšot')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Kļūda dzēšot')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#706152]">Kontaktu sadaļas iestatījumi</h1>
          <p className="mt-1 text-sm text-[#706152]/80">
            Šeit var rediģēt kontaktu informāciju, priekšrocības un pakalpojumus.
          </p>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[#706152]">Kontaktu informācija</h2>
          <button
            onClick={() => {
              setEditingInfo(contactInfo)
              setShowInfoForm(true)
            }}
            className="bg-[#B7AB96] hover:bg-[#706152] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
          >
            <Edit size={16} />
            {contactInfo ? 'Rediģēt' : 'Pievienot'} informāciju
          </button>
        </div>

        {contactInfo ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 border border-[#B7AB96]/20 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-xl flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <div>
                <div className="font-medium text-[#706152]">Telefons</div>
                <div className="text-sm text-[#706152]/60">{contactInfo.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-[#B7AB96]/20 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-xl flex items-center justify-center">
                <Mail size={20} className="text-white" />
              </div>
              <div>
                <div className="font-medium text-[#706152]">E-pasts</div>
                <div className="text-sm text-[#706152]/60">{contactInfo.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-[#B7AB96]/20 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-white" />
              </div>
              <div>
                <div className="font-medium text-[#706152]">Adrese</div>
                <div className="text-sm text-[#706152]/60">{contactInfo.address}</div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[#706152]/60">Nav pievienota kontaktu informācija</p>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-[#706152]">Priekšrocības</h2>
          <button
            onClick={() => setShowBenefitForm(true)}
            className="bg-[#B7AB96] hover:bg-[#706152] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Pievienot priekšrocību
          </button>
        </div>

        <div className="grid gap-4">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="flex items-center justify-between p-4 border border-[#B7AB96]/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-lg flex items-center justify-center">
                  <CheckCircle size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-medium text-[#706152]">{benefit.text}</div>
                  <div className="text-sm text-[#706152]/60">Secība: {benefit.order}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {benefit.isActive ? (
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Eye size={12} />
                    Aktīvs
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <EyeOff size={12} />
                    Neaktīvs
                  </div>
                )}
                <button
                  onClick={() => setEditingBenefit(benefit)}
                  className="p-2 text-[#B7AB96] hover:text-[#706152] transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteBenefit(benefit.id!)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {benefits.length === 0 && (
            <p className="text-center py-8 text-[#706152]/60">Nav pievienota neviena priekšrocība</p>
          )}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-[#706152]">Kontaktformas pakalpojumi</h2>
          <button
            onClick={() => setShowServiceForm(true)}
            className="bg-[#B7AB96] hover:bg-[#706152] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Pievienot pakalpojumu
          </button>
        </div>

        <div className="grid gap-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-4 border border-[#B7AB96]/20 rounded-lg">
              <div>
                <div className="font-medium text-[#706152]">{service.name}</div>
                <div className="text-sm text-[#706152]/60">Secība: {service.order}</div>
              </div>
              <div className="flex items-center gap-2">
                {service.isActive ? (
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Eye size={12} />
                    Aktīvs
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <EyeOff size={12} />
                    Neaktīvs
                  </div>
                )}
                <button
                  onClick={() => setEditingService(service)}
                  className="p-2 text-[#B7AB96] hover:text-[#706152] transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteService(service.id!)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {services.length === 0 && (
            <p className="text-center py-8 text-[#706152]/60">Nav pievienots neviens pakalpojums</p>
          )}
        </div>
      </div>

      {/* Contact Info Form Modal */}
      {(showInfoForm || editingInfo) && (
        <ContactInfoForm
          contactInfo={editingInfo}
          onSave={saveContactInfo}
          onCancel={() => {
            setEditingInfo(null)
            setShowInfoForm(false)
          }}
        />
      )}

      {/* Benefit Form Modal */}
      {(showBenefitForm || editingBenefit) && (
        <BenefitForm
          benefit={editingBenefit}
          onSave={saveBenefit}
          onCancel={() => {
            setEditingBenefit(null)
            setShowBenefitForm(false)
          }}
        />
      )}

      {/* Service Form Modal */}
      {(showServiceForm || editingService) && (
        <ServiceForm
          service={editingService}
          onSave={saveService}
          onCancel={() => {
            setEditingService(null)
            setShowServiceForm(false)
          }}
        />
      )}
    </div>
  )
}

// Contact Info Form Component
function ContactInfoForm({
  contactInfo,
  onSave,
  onCancel
}: {
  contactInfo: ContactInfoData | null
  onSave: (data: ContactInfoData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<ContactInfoData>({
    phone: contactInfo?.phone || '+371 67 315 000',
    email: contactInfo?.email || 'info@adoria.lv',
    address: contactInfo?.address || 'A. Čaka iela 70-3, Rīga',
    isActive: contactInfo?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: contactInfo?.id,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-[#706152] mb-6">
          {contactInfo ? 'Rediģēt kontaktu informāciju' : 'Pievienot kontaktu informāciju'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Telefons *
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              E-pasts *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Adrese *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="bg-[#B7AB96] hover:bg-[#706152] text-white px-6 py-2 rounded-md transition-colors flex-1"
            >
              Saglabāt
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
            >
              Atcelt
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Benefit Form Component
function BenefitForm({
  benefit,
  onSave,
  onCancel
}: {
  benefit: ContactBenefitData | null
  onSave: (data: ContactBenefitData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<ContactBenefitData>({
    text: benefit?.text || '',
    order: benefit?.order || 0,
    isActive: benefit?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: benefit?.id,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-[#706152] mb-6">
          {benefit ? 'Rediģēt priekšrocību' : 'Pievienot priekšrocību'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Teksts *
            </label>
            <input
              type="text"
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Secība
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                  formData.isActive
                    ? 'border-[#B7AB96] bg-[#B7AB96]'
                    : 'border-[#B7AB96]/30'
                }`}>
                  {formData.isActive && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-[#706152] text-sm">
                Aktīvs
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="bg-[#B7AB96] hover:bg-[#706152] text-white px-6 py-2 rounded-md transition-colors flex-1"
            >
              Saglabāt
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
            >
              Atcelt
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Service Form Component
function ServiceForm({
  service,
  onSave,
  onCancel
}: {
  service: ContactServiceData | null
  onSave: (data: ContactServiceData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<ContactServiceData>({
    name: service?.name || '',
    order: service?.order || 0,
    isActive: service?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: service?.id,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-[#706152] mb-6">
          {service ? 'Rediģēt pakalpojumu' : 'Pievienot pakalpojumu'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Nosaukums *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Secība
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                  formData.isActive
                    ? 'border-[#B7AB96] bg-[#B7AB96]'
                    : 'border-[#B7AB96]/30'
                }`}>
                  {formData.isActive && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-3 text-[#706152] text-sm">
                Aktīvs
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="bg-[#B7AB96] hover:bg-[#706152] text-white px-6 py-2 rounded-md transition-colors flex-1"
            >
              Saglabāt
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
            >
              Atcelt
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
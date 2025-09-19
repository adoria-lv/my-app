'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import S3Upload from '@/app/components/ui/S3Upload'

interface ServiceData {
  id?: string
  title: string
  icon: string
  backgroundImage?: string
  titleColor?: string
  description: string
  href: string
  order: number
  isActive: boolean
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<ServiceData | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveService = async (service: ServiceData) => {
    try {
      const method = service.id ? 'PUT' : 'POST'
      const response = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      })

      if (response.ok) {
        toast.success('Pakalpojums saglabāts!')
        fetchServices()
        setEditingService(null)
        setShowAddForm(false)
      } else {
        toast.error('Kļūda saglabājot')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('Kļūda saglabājot')
    }
  }

  const deleteService = async (id: string) => {
    if (!confirm('Vai tiešām dzēst šo pakalpojumu?')) return

    try {
      const response = await fetch(`/api/services?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Pakalpojums dzēsts!')
        fetchServices()
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#706152]">Pakalpojumu iestatījumi</h1>
          <p className="mt-1 text-sm text-[#706152]/80">
            Šeit var labot/pievienot pakalpojumus, kas tiek parādīti sākumlapā
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#B7AB96] hover:bg-[#706152] text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2"
        >
          <Plus size={16} />
          Pievienot pakalpojumu
        </button>
      </div>

      <div className="grid gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20 p-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#B7AB96] to-[#9d9583] rounded-xl flex items-center justify-center">
                {service.icon ? (
                  service.icon.includes('amazonaws.com') ? (
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={32}
                      height={32}
                      className="w-8 h-8 brightness-0 invert"
                    />
                  ) : (
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={32}
                      height={32}
                      className="w-8 h-8 brightness-0 invert"
                    />
                  )
                ) : (
                  <div className="w-8 h-8 bg-white/20 rounded-lg" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-[#706152]">{service.title}</h3>
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
                        <span className="text-xs text-[#706152]/60 bg-gray-100 px-2 py-1 rounded-full">
                          #{service.order}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#706152]/80 mb-2">{service.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-[#706152]/60">
                      <a
                        href={service.href}
                        className="flex items-center gap-1 text-[#B7AB96] hover:text-[#706152]"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {service.href}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/admin/services/${service.id}/faq`}
                      className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                      title="Pārvaldīt FAQ"
                    >
                      <HelpCircle size={16} />
                    </Link>
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
              </div>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-[#B7AB96]/20">
            <p className="text-[#706152]/60 mb-4">Nav pievienoti pakalpojumi</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-[#B7AB96] hover:text-[#706152] transition-colors font-medium"
            >
              Pievienot pirmo pakalpojumu
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddForm || editingService) && (
        <ServiceForm
          service={editingService}
          onSave={saveService}
          onCancel={() => {
            setEditingService(null)
            setShowAddForm(false)
          }}
        />
      )}
    </div>
  )
}

// Service Form Component
function ServiceForm({
  service,
  onSave,
  onCancel
}: {
  service: ServiceData | null
  onSave: (service: ServiceData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<ServiceData>({
    title: service?.title || '',
    icon: service?.icon || '',
    backgroundImage: service?.backgroundImage || '',
    titleColor: service?.titleColor || 'white',
    description: service?.description || '',
    href: service?.href || '',
    order: service?.order || 0,
    isActive: service?.isActive ?? true,
  })

  const generateSlugFromTitle = (title: string) => {
    if (!title.trim()) return ''
    return title.toLowerCase()
      .replace(/ā/g, 'a')
      .replace(/č/g, 'c')
      .replace(/ē/g, 'e')
      .replace(/ģ/g, 'g')
      .replace(/ī/g, 'i')
      .replace(/ķ/g, 'k')
      .replace(/ļ/g, 'l')
      .replace(/ņ/g, 'n')
      .replace(/š/g, 's')
      .replace(/ū/g, 'u')
      .replace(/ž/g, 'z')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    const autoGeneratedHref = generateSlugFromTitle(title) ? `/${generateSlugFromTitle(title)}` : ''

    // Check if current href matches what would be auto-generated from current title
    const currentAutoHref = generateSlugFromTitle(formData.title) ? `/${generateSlugFromTitle(formData.title)}` : ''
    const isCurrentlyAutoGenerated = formData.href === currentAutoHref

    setFormData({
      ...formData,
      title,
      href: isCurrentlyAutoGenerated ? autoGeneratedHref : formData.href
    })
  }

  const handleHrefChange = (href: string) => {
    setFormData({
      ...formData,
      href
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.icon) {
      toast.error('Lūdzu, pievienojiet ikonu')
      return
    }
    onSave({
      ...formData,
      id: service?.id,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-[#706152] mb-6">
          {service ? 'Rediģēt pakalpojumu' : 'Pievienot pakalpojumu'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Icon Upload */}
          <S3Upload
            currentImage={formData.icon}
            onImageChange={(url) => setFormData({...formData, icon: url || ''})}
            folder="services"
            label="Pakalpojuma ikona"
            accept="image/*,.svg"
          />

          {/* Background Image Upload */}
          <S3Upload
            currentImage={formData.backgroundImage}
            onImageChange={(url) => setFormData({...formData, backgroundImage: url || ''})}
            folder="services"
            label="Fona attēls (header blokam)"
            accept="image/*"
          />

          {/* Title Color Selection */}
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Virsraksta krāsa (gaišām bildēm)
            </label>
            <select
              value={formData.titleColor || 'white'}
              onChange={(e) => setFormData({...formData, titleColor: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7AB96]/50 focus:border-[#B7AB96]"
            >
              <option value="white">Balta krāsa</option>
              <option value="dark">Tumša krāsa</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Izvēlieties tumšu krāsu, ja fona attēls ir gaišs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                Nosaukums *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
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
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Apraksts *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Saite (href) *
            </label>
            <input
              type="text"
              value={formData.href}
              onChange={(e) => handleHrefChange(e.target.value)}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              placeholder="/arstnieciba"
              required
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

'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import S3Upload from '@/app/components/ui/S3Upload'

interface SlideData {
  id?: string
  title: string
  subtitle?: string
  image: string
  mobileImage?: string
  ctaText?: string
  ctaLink?: string
  order: number
  isActive: boolean
}

export default function SliderAdmin() {
  const [slides, setSlides] = useState<SlideData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSlide, setEditingSlide] = useState<SlideData | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/slider')
      if (response.ok) {
        const data = await response.json()
        setSlides(data)
      }
    } catch (error) {
      console.error('Error fetching slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSlide = async (slide: SlideData) => {
    try {
      const method = slide.id ? 'PUT' : 'POST'
      const response = await fetch('/api/slider', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide),
      })

      if (response.ok) {
        toast.success('Slaids saglabāts!')
        fetchSlides()
        setEditingSlide(null)
        setShowAddForm(false)
      } else {
        toast.error('Kļūda saglabājot')
      }
    } catch (error) {
      console.error('Error saving slide:', error)
      toast.error('Kļūda saglabājot')
    }
  }

  const deleteSlide = async (id: string) => {
    if (!confirm('Vai tiešām dzēst šo slaidu?')) return

    try {
      const response = await fetch(`/api/slider?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Slaids dzēsts!')
        fetchSlides()
      } else {
        toast.error('Kļūda dzēšot')
      }
    } catch (error) {
      console.error('Error deleting slide:', error)
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
          <h1 className="text-2xl font-bold text-[#706152]">Slider iestatījumi</h1>
          <p className="mt-1 text-sm text-[#706152]/80">
            Šeit var labot/pievienot sākumlapas attēlu slaideri.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#B7AB96] hover:bg-[#706152] text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2"
        >
          <Plus size={16} />
          Pievienot slaidu
        </button>
      </div>

      <div className="grid gap-6">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Image Preview */}
              <div className="lg:w-1/3 h-48 lg:h-auto relative bg-gray-100">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  {slide.isActive ? (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Eye size={12} />
                      Aktīvs
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <EyeOff size={12} />
                      Neaktīvs
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-2/3 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-[#706152] mb-2">{slide.title}</h3>
                    {slide.subtitle && (
                      <p className="text-sm text-[#706152]/80 mb-2">{slide.subtitle}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-[#706152]/60">
                      <span>Secība: {slide.order}</span>
                      {slide.ctaText && (
                        <span>Pogas teksts: {slide.ctaText}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setEditingSlide(slide)}
                      className="p-2 text-[#B7AB96] hover:text-[#706152] transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteSlide(slide.id!)}
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

        {slides.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-[#B7AB96]/20">
            <p className="text-[#706152]/60">Nav pievienoti slaidi</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 text-[#B7AB96] hover:text-[#706152] transition-colors"
            >
              Pievienot pirmo slaidu
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddForm || editingSlide) && (
        <SlideForm
          slide={editingSlide}
          onSave={saveSlide}
          onCancel={() => {
            setEditingSlide(null)
            setShowAddForm(false)
          }}
        />
      )}
    </div>
  )
}

// Slide Form Component
function SlideForm({
  slide,
  onSave,
  onCancel
}: {
  slide: SlideData | null
  onSave: (slide: SlideData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<SlideData>({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    image: slide?.image || '',
    mobileImage: slide?.mobileImage || '',
    ctaText: slide?.ctaText || '',
    ctaLink: slide?.ctaLink || '',
    order: slide?.order || 0,
    isActive: slide?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image) {
      toast.error('Lūdzu, pievienojiet attēlu')
      return
    }
    onSave({
      ...formData,
      id: slide?.id,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-[#706152] mb-6">
          {slide ? 'Rediģēt slaidu' : 'Pievienot slaidu'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Desktop Image */}
          <S3Upload
            currentImage={formData.image}
            onImageChange={(url) => setFormData({...formData, image: url || ''})}
            folder="slider"
            label="Galvenais attēls (Desktop)"
          />

          {/* Mobile Image */}
          <S3Upload
            currentImage={formData.mobileImage}
            onImageChange={(url) => setFormData({...formData, mobileImage: url || ''})}
            folder="slider/mobile"
            label="Mobilais attēls (nav obligāti)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                Virsraksts *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
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
              Apakšvirsraksts
            </label>
            <textarea
              value={formData.subtitle}
              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
              rows={2}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                CTA teksts
              </label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                placeholder="Pieteikt vizīti"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                CTA saite
              </label>
              <input
                type="text"
                value={formData.ctaLink}
                onChange={(e) => setFormData({...formData, ctaLink: e.target.value})}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                placeholder="/pieteikt-viziti"
              />
            </div>
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

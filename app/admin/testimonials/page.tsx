'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, User } from 'lucide-react'
import Image from 'next/image'
import S3Upload from '@/app/components/ui/S3Upload'

interface TestimonialData {
  id?: string
  name: string
  text: string
  rating: number
  avatar?: string
  service?: string
  date: string
  order: number
  isActive: boolean
}

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveTestimonial = async (testimonial: TestimonialData) => {
    try {
      const method = testimonial.id ? 'PUT' : 'POST'
      const response = await fetch('/api/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonial),
      })

      if (response.ok) {
        toast.success('Atsauksme saglabāta!')
        fetchTestimonials()
        setEditingTestimonial(null)
        setShowAddForm(false)
      } else {
        toast.error('Kļūda saglabājot')
      }
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast.error('Kļūda saglabājot')
    }
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Vai tiešām dzēst šo atsauksmi?')) return

    try {
      const response = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Atsauksme dzēsta!')
        fetchTestimonials()
      } else {
        toast.error('Kļūda dzēšot')
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast.error('Kļūda dzēšot')
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
          />
        ))}
      </div>
    )
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
          <h1 className="text-2xl font-bold text-[#706152]">Atsauksmju iestatījumi</h1>
          <p className="mt-1 text-sm text-[#706152]/80">
            Šeit var pievienot/labot atsauksmes, kas tiek parādītas sākumlapā
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#B7AB96] hover:bg-[#706152] text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2"
        >
          <Plus size={16} />
          Pievienot atsauksmi
        </button>
      </div>

      <div className="grid gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20 p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {testimonial.avatar ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B7AB96] to-[#706152] flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-medium text-[#706152]">{testimonial.name}</h3>
                      <div className="flex items-center gap-2">
                        {testimonial.isActive ? (
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
                          #{testimonial.order}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(testimonial.rating)}
                      {testimonial.service && (
                        <span className="text-sm text-[#B7AB96] bg-[#B7AB96]/10 px-2 py-1 rounded-full">
                          {testimonial.service}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setEditingTestimonial(testimonial)}
                      className="p-2 text-[#B7AB96] hover:text-[#706152] transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteTestimonial(testimonial.id!)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[#706152]/80 mb-2 line-clamp-3">{testimonial.text}</p>
                
                <div className="text-xs text-[#706152]/60">
                  {new Date(testimonial.date).toLocaleDateString('lv-LV', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-[#B7AB96]/20">
            <User className="w-12 h-12 text-[#706152]/40 mx-auto mb-4" />
            <p className="text-[#706152]/60 mb-4">Nav pievienotas atsauksmes</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-[#B7AB96] hover:text-[#706152] transition-colors font-medium"
            >
              Pievienot pirmo atsauksmi
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddForm || editingTestimonial) && (
        <TestimonialForm
          testimonial={editingTestimonial}
          onSave={saveTestimonial}
          onCancel={() => {
            setEditingTestimonial(null)
            setShowAddForm(false)
          }}
        />
      )}
    </div>
  )
}

function TestimonialForm({
  testimonial,
  onSave,
  onCancel,
}: {
  testimonial: TestimonialData | null
  onSave: (testimonial: TestimonialData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<TestimonialData>({
    name: testimonial?.name || '',
    text: testimonial?.text || '',
    rating: testimonial?.rating || 5,
    avatar: testimonial?.avatar || '',
    service: testimonial?.service || '',
    date: testimonial?.date || '',
    order: testimonial?.order || 0,
    isActive: testimonial?.isActive ?? true,
  })

  const services = [
    'Ārstniecība',
    'Ginekoloģija',
    'Zobārstniecība',
    'Bērnu zobārstniecība',
    'Acu protezēšana',
    'Fizioterapija',
    'Skaistumkopšana',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: testimonial?.id,
      // Ja vajag, pārveidojiet datumu atpakaļ uz ISO string
      date: formData.date, // jau ir YYYY-MM-DD formātā
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-[#706152] mb-6">
          {testimonial ? 'Rediģēt atsauksmi' : 'Pievienot atsauksmi'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <S3Upload
            currentImage={formData.avatar}
            onImageChange={(url) => setFormData({...formData, avatar: url || ''})}
            folder="testimonials"
            label="Klienta attēls (nav obligāti)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                Vārds *
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
                Pakalpojums
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              >
                <option value="">Izvēlieties pakalpojumu</option>
                {services.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Atsauksmes teksts *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              rows={4}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                Novērtējums
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] appearance-none bg-white cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23B7AB96' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} {rating === 1 ? 'zvaigzne' : 'zvaigznes'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                Datums
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#706152] pointer-events-none z-10">
                  {formData.date ?
                    new Date(formData.date + 'T00:00:00').toLocaleDateString('lv-LV') :
                    <span className="text-[#706152]/40">Izvēlieties datumu</span>
                  }
                </span>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  onClick={(e) => e.currentTarget.showPicker()}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] text-transparent cursor-pointer"
                />
              </div>
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

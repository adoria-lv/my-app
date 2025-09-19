'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import QuillEditor from '@/components/QuillEditor'
import S3Upload from '@/app/components/ui/S3Upload'
import { parseServiceContentWithReadMore } from '@/lib/contentParser'

interface Service {
  id: string
  title: string
  href: string
}

interface SubService {
  id: string
  title: string
  description: string
  gallery1?: string
  gallery2?: string
  gallery3?: string
  gallery4?: string
  duration?: string
  price?: string
  content?: string
  slug: string
  order: number
  isActive: boolean
  service: Service
  subSubServices?: SubSubService[]
}

interface SubSubService {
  id: string
  title: string
  description: string
  duration?: string
  price?: string
  content?: string
  slug: string
  order: number
  isActive: boolean
}

export default function SubServicesAdmin() {
  const { data: session, status } = useSession()
  const [subServices, setSubServices] = useState<SubService[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showSubSubForm, setShowSubSubForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingSubSubId, setEditingSubSubId] = useState<string | null>(null)
  const [expandedContent, setExpandedContent] = useState<string | null>(null)
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set())

  // Add refs for form inputs to prevent state loss
  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const slugRef = useRef<HTMLInputElement>(null)
  const durationRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const serviceIdRef = useRef<HTMLSelectElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gallery1: '',
    gallery2: '',
    gallery3: '',
    gallery4: '',
    duration: '',
    price: '',
    content: '',
    slug: '',
    serviceId: '',
    order: 0,
    isActive: true
  })

  const [subSubFormData, setSubSubFormData] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    content: '',
    slug: '',
    subServiceId: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/admin/login')
    }
  }, [status])

  useEffect(() => {
    if (session) {
      fetchSubServices()
      fetchServices()
    }
  }, [session])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchSubServices = async () => {
    try {
      const response = await fetch('/api/sub-services?includeSubSub=true')
      if (response.ok) {
        const data = await response.json()
        setSubServices(data)
      }
    } catch (error) {
      console.error('Error fetching sub-services:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      gallery1: '',
      gallery2: '',
      gallery3: '',
      gallery4: '',
      duration: '',
      price: '',
      content: '',
      slug: '',
      serviceId: '',
      order: 0,
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  const resetSubSubForm = () => {
    setSubSubFormData({
      title: '',
      description: '',
      duration: '',
      price: '',
      content: '',
      slug: '',
      subServiceId: '',
      order: 0,
      isActive: true
    })
    setEditingSubSubId(null)
    setShowSubSubForm(false)
  }

  // Memoized callback for QuillEditor to prevent unnecessary re-renders
  const handleQuillChange = useCallback((content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }))
  }, [])

  const handleSubSubQuillChange = useCallback((content: string) => {
    setSubSubFormData(prev => ({
      ...prev,
      content
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Preserve current form values from refs in case of state loss
    const currentFormData = {
      ...formData,
      title: titleRef.current?.value || formData.title,
      description: descriptionRef.current?.value || formData.description,
      slug: slugRef.current?.value || formData.slug,
      duration: durationRef.current?.value || formData.duration,
      price: priceRef.current?.value || formData.price,
      serviceId: serviceIdRef.current?.value || formData.serviceId,
    }

    try {
      const url = editingId ? `/api/sub-services/${editingId}` : '/api/sub-services'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentFormData),
      })

      if (response.ok) {
        await fetchSubServices()
        resetForm()
        toast.success(editingId ? 'Apakšpakalpojums veiksmīgi atjaunināts!' : 'Apakšpakalpojums veiksmīgi pievienots!')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const data = await response.json()
        toast.error(data.error || 'Kļūda saglabājot datus')
      }
    } catch (error) {
      console.error('Error saving sub-service:', error)
      toast.error('Kļūda saglabājot datus')
    }
  }

  const handleEdit = (subService: SubService) => {
    setFormData({
      title: subService.title,
      description: subService.description,
      gallery1: subService.gallery1 || '',
      gallery2: subService.gallery2 || '',
      gallery3: subService.gallery3 || '',
      gallery4: subService.gallery4 || '',
      duration: subService.duration || '',
      price: subService.price || '',
      content: subService.content || '',
      slug: subService.slug,
      serviceId: subService.service.id,
      order: subService.order,
      isActive: subService.isActive
    })
    setEditingId(subService.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Vai tiešām vēlies dzēst šo apakšpakalpojumu?')) {
      try {
        const response = await fetch(`/api/sub-services/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchSubServices()
        } else {
          alert('Kļūda dzēšot apakšpakalpojumu')
        }
      } catch (error) {
        console.error('Error deleting sub-service:', error)
        alert('Kļūda dzēšot apakšpakalpojumu')
      }
    }
  }

  const handleSubSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingSubSubId ? `/api/sub-sub-services/${editingSubSubId}` : '/api/sub-sub-services'
      const method = editingSubSubId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subSubFormData),
      })

      if (response.ok) {
        await fetchSubServices()
        resetSubSubForm()
      } else {
        const data = await response.json()
        alert(data.error || 'Kļūda saglabājot datus')
      }
    } catch (error) {
      console.error('Error saving sub-sub-service:', error)
      alert('Kļūda saglabājot datus')
    }
  }

  const handleSubSubEdit = (subSubService: SubSubService, subServiceId: string) => {
    setSubSubFormData({
      title: subSubService.title,
      description: subSubService.description,
      duration: subSubService.duration || '',
      price: subSubService.price || '',
      content: subSubService.content || '',
      slug: subSubService.slug,
      subServiceId: subServiceId,
      order: subSubService.order,
      isActive: subSubService.isActive
    })
    setEditingSubSubId(subSubService.id)
    setShowSubSubForm(true)
  }

  const handleSubSubDelete = async (id: string) => {
    if (confirm('Vai tiešām vēlies dzēst šo apakš-apakšpakalpojumu?')) {
      try {
        const response = await fetch(`/api/sub-sub-services/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchSubServices()
        } else {
          alert('Kļūda dzēšot apakš-apakšpakalpojumu')
        }
      } catch (error) {
        console.error('Error deleting sub-sub-service:', error)
        alert('Kļūda dzēšot apakš-apakšpakalpojumu')
      }
    }
  }

  const toggleService = (serviceId: string) => {
    setExpandedServices(prev => {
      const newSet = new Set(prev)
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId)
      } else {
        newSet.add(serviceId)
      }
      return newSet
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[āàáâä]/g, 'a')
      .replace(/[ēèéêë]/g, 'e')
      .replace(/[īìíîï]/g, 'i')
      .replace(/[ōòóôö]/g, 'o')
      .replace(/[ūùúûü]/g, 'u')
      .replace(/[ņ]/g, 'n')
      .replace(/[ķ]/g, 'k')
      .replace(/[ģ]/g, 'g')
      .replace(/[ļ]/g, 'l')
      .replace(/[š]/g, 's')
      .replace(/[ž]/g, 'z')
      .replace(/[č]/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleSubSubTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setSubSubFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleAddSubSub = (subServiceId: string) => {
    setSubSubFormData(prev => ({
      ...prev,
      subServiceId
    }))
    setShowSubSubForm(true)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#706152]">Apakšpakalpojumu administrēšana</h1>
          <p className="mt-1 text-sm text-[#706152]/80">
            Pārvaldīt pakalpojumu apakškategorijas
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#B7AB96] hover:bg-[#706152] text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2"
        >
          <Plus size={16} />
          Pievienot apakšpakalpojumu
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-[#B7AB96]/20 p-6">
          <h2 className="text-lg font-semibold text-[#706152] mb-4">
            {editingId ? 'Rediģēt apakšpakalpojumu' : 'Pievienot jaunu apakšpakalpojumu'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pakalpojums *
                </label>
                <select
                  ref={serviceIdRef}
                  value={formData.serviceId}
                  onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  required
                >
                  <option value="">Izvēlies pakalpojumu</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nosaukums *
                </label>
                <input
                  ref={titleRef}
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  placeholder="Konsultācija"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL slug *
                </label>
                <input
                  ref={slugRef}
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  placeholder="konsultacija"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ilgums
                </label>
                <input
                  ref={durationRef}
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  placeholder="30 min"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cena
                </label>
                <input
                  ref={priceRef}
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  placeholder="€50"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secība
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  min="0"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apraksts *
              </label>
              <textarea
                ref={descriptionRef}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                placeholder="Īss apakšpakalpojuma apraksts..."
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detalizēts saturs (HTML)
              </label>
              <QuillEditor
                key={`quill-${editingId || 'new'}`}
                value={formData.content}
                onChange={handleQuillChange}
                placeholder="Detalizēts apraksts..."
                className="border border-[#B7AB96]/30 rounded-md focus-within:ring-[#B7AB96] focus-within:border-[#B7AB96]"
              />
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Galerijas attēli (līdz 4 attēliem)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Attēls 1</label>
                  <S3Upload
                    currentImage={formData.gallery1}
                    onImageChange={(url) => setFormData({...formData, gallery1: url || ''})}
                    folder="gallery"
                    label=""
                    className="h-32"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Attēls 2</label>
                  <S3Upload
                    currentImage={formData.gallery2}
                    onImageChange={(url) => setFormData({...formData, gallery2: url || ''})}
                    folder="gallery"
                    label=""
                    className="h-32"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Attēls 3</label>
                  <S3Upload
                    currentImage={formData.gallery3}
                    onImageChange={(url) => setFormData({...formData, gallery3: url || ''})}
                    folder="gallery"
                    label=""
                    className="h-32"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Attēls 4</label>
                  <S3Upload
                    currentImage={formData.gallery4}
                    onImageChange={(url) => setFormData({...formData, gallery4: url || ''})}
                    folder="gallery"
                    label=""
                    className="h-32"
                  />
                </div>
              </div>
            </div>

            {/* Is Active */}
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="rounded border-[#B7AB96]/30 text-[#B7AB96] focus:ring-[#B7AB96]"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Aktīvs
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#B7AB96] text-white px-4 py-2 rounded-md hover:bg-[#a59885] transition-colors"
              >
                <Save size={16} />
                {editingId ? 'Atjaunināt' : 'Saglabāt'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                <X size={16} />
                Atcelt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add/Edit Sub-Sub-Service Form */}
      {showSubSubForm && (
        <div className="bg-white rounded-lg border border-[#B7AB96]/20 p-6">
          <h2 className="text-lg font-semibold text-[#706152] mb-4">
            {editingSubSubId ? 'Rediģēt apakš-apakšpakalpojumu' : 'Pievienot jaunu apakš-apakšpakalpojumu'}
          </h2>

          <form onSubmit={handleSubSubSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sub-Service Selection (read-only when adding) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apakšpakalpojums
                </label>
                <select
                  value={subSubFormData.subServiceId}
                  onChange={(e) => setSubSubFormData({...subSubFormData, subServiceId: e.target.value})}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  required
                  disabled={!editingSubSubId}
                >
                  <option value="">Izvēlies apakšpakalpojumu</option>
                  {subServices.map(subService => (
                    <option key={subService.id} value={subService.id}>
                      {subService.service.title} → {subService.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nosaukums *
                </label>
                <input
                  type="text"
                  value={subSubFormData.title}
                  onChange={handleSubSubTitleChange}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  placeholder="Zobu balināšana ar Flash"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL slug *
                </label>
                <input
                  type="text"
                  value={subSubFormData.slug}
                  onChange={(e) => setSubSubFormData({...subSubFormData, slug: e.target.value})}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  placeholder="zobu-balinasana-ar-flash"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ilgums
                </label>
                <input
                  type="text"
                  value={subSubFormData.duration}
                  onChange={(e) => setSubSubFormData({...subSubFormData, duration: e.target.value})}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  placeholder="45 min"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cena
                </label>
                <input
                  type="text"
                  value={subSubFormData.price}
                  onChange={(e) => setSubSubFormData({...subSubFormData, price: e.target.value})}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  placeholder="€80"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secība
                </label>
                <input
                  type="number"
                  value={subSubFormData.order}
                  onChange={(e) => setSubSubFormData({...subSubFormData, order: parseInt(e.target.value) || 0})}
                  className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                  min="0"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apraksts *
              </label>
              <textarea
                value={subSubFormData.description}
                onChange={(e) => setSubSubFormData({...subSubFormData, description: e.target.value})}
                rows={3}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                placeholder="Īss apakš-apakšpakalpojuma apraksts..."
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detalizēts saturs (HTML)
              </label>
              <QuillEditor
                key={`quill-sub-${editingSubSubId || 'new'}`}
                value={subSubFormData.content}
                onChange={handleSubSubQuillChange}
                placeholder="Detalizēts apraksts..."
                className="border border-[#B7AB96]/30 rounded-md focus-within:ring-[#B7AB96] focus-within:border-[#B7AB96]"
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="subSubIsActive"
                checked={subSubFormData.isActive}
                onChange={(e) => setSubSubFormData({...subSubFormData, isActive: e.target.checked})}
                className="rounded border-[#B7AB96]/30 text-[#B7AB96] focus:ring-[#B7AB96]"
              />
              <label htmlFor="subSubIsActive" className="ml-2 text-sm text-gray-700">
                Aktīvs
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#B7AB96] text-white px-4 py-2 rounded-md hover:bg-[#a59885] transition-colors"
              >
                <Save size={16} />
                {editingSubSubId ? 'Atjaunināt' : 'Saglabāt'}
              </button>
              <button
                type="button"
                onClick={resetSubSubForm}
                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                <X size={16} />
                Atcelt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-services List */}
      <div className="grid gap-6">
        {subServices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-[#B7AB96]/20">
            <p className="text-[#706152]/60 mb-4">Nav pievienoti apakšpakalpojumi</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-[#B7AB96] hover:text-[#706152] transition-colors font-medium"
            >
              Pievienot pirmo apakšpakalpojumu
            </button>
          </div>
        ) : (
          <>
            {/* Group sub-services by service */}
            {services.map((service) => {
              const serviceSubServices = subServices
                .filter(subService => subService.service.id === service.id)
                .sort((a, b) => a.order - b.order)

              if (serviceSubServices.length === 0) return null

              return (
                <div key={service.id} className="bg-white rounded-lg border border-[#B7AB96]/20 overflow-hidden">
                  {/* Service Header */}
                  <button
                    onClick={() => toggleService(service.id)}
                    className="w-full bg-gradient-to-r from-[#B7AB96]/10 to-[#706152]/5 px-4 py-3 border-b border-gray-200 hover:from-[#B7AB96]/15 hover:to-[#706152]/8 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#706152]">
                        {service.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {serviceSubServices.length} apakšpakalpojumi
                        </span>
                        {expandedServices.has(service.id) ? (
                          <ChevronUp size={20} className="text-[#706152]" />
                        ) : (
                          <ChevronDown size={20} className="text-[#706152]" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Sub-services */}
                  {expandedServices.has(service.id) && (
                    <div className="divide-y divide-gray-100">
                      {serviceSubServices.map((subService) => (
                        <div
                          key={subService.id}
                          className="p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-[#706152] truncate">
                                  {subService.title}
                                </h4>
                                {subService.isActive ? (
                                  <span className="flex items-center gap-1 text-xs text-green-600">
                                    <Eye size={12} />
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <EyeOff size={12} />
                                  </span>
                                )}
                              </div>

                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {subService.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  /{subService.slug}
                                </span>
                                {subService.duration && (
                                  <span className="bg-blue-50 px-2 py-1 rounded text-blue-700">
                                    {subService.duration}
                                  </span>
                                )}
                                {subService.price && (
                                  <span className="bg-green-50 px-2 py-1 rounded text-green-700">
                                    {subService.price}
                                  </span>
                                )}
                                <span className="bg-purple-50 px-2 py-1 rounded text-purple-700">
                                  #{subService.order}
                                </span>
                              </div>

                              {subService.content && (
                                <div className="mt-2">
                                  <button
                                    onClick={() => setExpandedContent(
                                      expandedContent === subService.id ? null : subService.id
                                    )}
                                    className="flex items-center gap-1 text-xs text-[#B7AB96] hover:text-[#706152] transition-colors"
                                  >
                                    {expandedContent === subService.id ? (
                                      <>
                                        <ChevronUp size={14} />
                                        Paslēpt
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown size={14} />
                                        Saturs
                                      </>
                                    )}
                                  </button>
                                  {expandedContent === subService.id && (
                                    <div className="mt-2 p-2 bg-white rounded border text-xs">
                                      {parseServiceContentWithReadMore(subService.content || '')}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1 ml-3">
                              <button
                                onClick={() => handleAddSubSub(subService.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Pievienot apakš-apakšpakalpojumu"
                              >
                                <Plus size={14} />
                              </button>
                              <Link
                                href={`/admin/sub-services/${subService.id}/faq`}
                                className="p-1.5 text-[#B7AB96] hover:bg-[#B7AB96]/10 rounded transition-colors"
                                title="Pārvaldīt FAQ"
                              >
                                <HelpCircle size={14} />
                              </Link>
                              <button
                                onClick={() => handleEdit(subService)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Rediģēt"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(subService.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Dzēst"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Sub-Sub-Services */}
                          {subService.subSubServices && subService.subSubServices.length > 0 && (
                            <div className="ml-6 mt-3 border-l-2 border-gray-200 pl-4">
                              <div className="text-xs text-gray-500 mb-2 font-medium">
                                Apakš-apakšpakalpojumi:
                              </div>
                              <div className="space-y-2">
                                {subService.subSubServices
                                  .sort((a, b) => a.order - b.order)
                                  .map((subSubService) => (
                                    <div
                                      key={subSubService.id}
                                      className="p-2 bg-gray-50 rounded border"
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h5 className="text-sm font-medium text-[#706152] truncate">
                                              {subSubService.title}
                                            </h5>
                                            {subSubService.isActive ? (
                                              <span className="flex items-center gap-1 text-xs text-green-600">
                                                <Eye size={10} />
                                              </span>
                                            ) : (
                                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                                <EyeOff size={10} />
                                              </span>
                                            )}
                                          </div>

                                          <p className="text-gray-600 text-xs mb-1 line-clamp-1">
                                            {subSubService.description}
                                          </p>

                                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                            <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">
                                              /{subSubService.slug}
                                            </span>
                                            {subSubService.duration && (
                                              <span className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-700 text-xs">
                                                {subSubService.duration}
                                              </span>
                                            )}
                                            {subSubService.price && (
                                              <span className="bg-green-100 px-1.5 py-0.5 rounded text-green-700 text-xs">
                                                {subSubService.price}
                                              </span>
                                            )}
                                            <span className="bg-purple-100 px-1.5 py-0.5 rounded text-purple-700 text-xs">
                                              #{subSubService.order}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1 ml-2">
                                          <Link
                                            href={`/admin/sub-sub-services/${subSubService.id}/faq`}
                                            className="p-1 text-[#B7AB96] hover:bg-[#B7AB96]/10 rounded transition-colors"
                                            title="Pārvaldīt FAQ"
                                          >
                                            <HelpCircle size={12} />
                                          </Link>
                                          <button
                                            onClick={() => handleSubSubEdit(subSubService, subService.id)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="Rediģēt"
                                          >
                                            <Pencil size={12} />
                                          </button>
                                          <button
                                            onClick={() => handleSubSubDelete(subSubService.id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Dzēst"
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

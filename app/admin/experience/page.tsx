// app/admin/experience/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import S3Upload from '@/app/components/ui/S3Upload'

interface StatData {
  id?: string
  title: string
  number: number
  suffix: string
  label: string
  iconType: string
  color: string
  order: number
  isActive: boolean
}

interface ContentData {
  id?: string
  headerTitle: string
  headerSubtitle: string
  description: string
  companyName: string
  image: string
  rating: string
  address: string
  email: string
  phone: string
  isActive: boolean
}

export default function ExperienceAdmin() {
  const [stats, setStats] = useState<StatData[]>([])
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingStat, setEditingStat] = useState<StatData | null>(null)
  const [editingContent, setEditingContent] = useState<ContentData | null>(null)
  const [showAddStatForm, setShowAddStatForm] = useState(false)
  const [showContentForm, setShowContentForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsResponse, contentResponse] = await Promise.all([
        fetch('/api/experience-stats'),
        fetch('/api/experience-content')
      ])
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
      
      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setContent(contentData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveStat = async (stat: StatData) => {
    try {
      const method = stat.id ? 'PUT' : 'POST'
      const response = await fetch('/api/experience-stats', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stat),
      })

      if (response.ok) {
        toast.success('Statistika saglabāta!')
        fetchData()
        setEditingStat(null)
        setShowAddStatForm(false)
      } else {
        toast.error('Kļūda saglabājot')
      }
    } catch (error) {
      console.error('Error saving stat:', error)
      toast.error('Kļūda saglabājot')
    }
  }

  const saveContent = async (contentData: ContentData) => {
    try {
      const method = contentData.id ? 'PUT' : 'POST'
      const response = await fetch('/api/experience-content', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData),
      })

      if (response.ok) {
        toast.success('Saturs saglabāts!')
        fetchData()
        setEditingContent(null)
        setShowContentForm(false)
      } else {
        toast.error('Kļūda saglabājot')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error('Kļūda saglabājot')
    }
  }

  const deleteStat = async (id: string) => {
    if (!confirm('Vai tiešām dzēst šo statistiku?')) return

    try {
      const response = await fetch(`/api/experience-stats?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Statistika dzēsta!')
        fetchData()
      } else {
        toast.error('Kļūda dzēšot')
      }
    } catch (error) {
      console.error('Error deleting stat:', error)
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
          <h1 className="text-2xl font-bold text-[#706152]">Statistikas iestatījumi</h1>
          <p className="mt-1 text-sm text-[#706152]/80">
            Šeit var labot/pievienot sākumlapas bloka "Kāpēc izvēlēties Adoria?" saturu.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[#706152]">Galvenais saturs</h2>
          <button
            onClick={() => {
              setEditingContent(content)
              setShowContentForm(true)
            }}
            className="bg-[#B7AB96] hover:bg-[#706152] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
          >
            <Edit size={16} />
            {content ? 'Rediģēt' : 'Pievienot'} saturu
          </button>
        </div>

        {content ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#706152] mb-2">{content.headerTitle}</h3>
              <p className="text-sm text-[#706152]/80 mb-4">{content.headerSubtitle}</p>
              <div className="space-y-2 text-sm text-[#706152]/80">
                <p><strong className="text-[#706152]">Apraksts:</strong> {content.description}</p>
                <p><strong className="text-[#706152]">Reitings:</strong> {content.rating}</p>
                <p><strong className="text-[#706152]">Adrese:</strong> {content.address}</p>
                <p><strong className="text-[#706152]">E-pasts:</strong> {content.email}</p>
                <p><strong className="text-[#706152]">Telefons:</strong> {content.phone}</p>
              </div>
            </div>
            {content.image && (
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={content.image}
                  alt="Experience"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-[#706152]/60">Nav pievienots saturs</p>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-[#706152]">Statistika</h2>
          <button
            onClick={() => setShowAddStatForm(true)}
            className="bg-[#B7AB96] hover:bg-[#706152] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Pievienot statistiku
          </button>
        </div>

        <div className="grid gap-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex items-center justify-between p-4 border border-[#B7AB96]/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}>
                  {stat.number}
                </div>
                <div>
                  <h3 className="font-medium text-[#706152]">{stat.label}</h3>
                  <p className="text-sm text-[#706152]/60">
                    {stat.number}{stat.suffix} • Secība: {stat.order} • Ikona: {stat.iconType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stat.isActive ? (
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
                  onClick={() => setEditingStat(stat)}
                  className="p-2 text-[#B7AB96] hover:text-[#706152] transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteStat(stat.id!)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {stats.length === 0 && (
            <p className="text-center py-8 text-[#706152]/60">Nav pievienota statistika</p>
          )}
        </div>
      </div>

      {/* Stat Form Modal */}
      {(showAddStatForm || editingStat) && (
        <StatForm
          stat={editingStat}
          onSave={saveStat}
          onCancel={() => {
            setEditingStat(null)
            setShowAddStatForm(false)
          }}
        />
      )}

      {/* Content Form Modal */}
      {showContentForm && (
        <ContentForm
          content={editingContent}
          onSave={saveContent}
          onCancel={() => {
            setEditingContent(null)
            setShowContentForm(false)
          }}
        />
      )}
    </div>
  )
}

// Stat Form Component
function StatForm({
  stat,
  onSave,
  onCancel
}: {
  stat: StatData | null
  onSave: (stat: StatData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<StatData>({
    title: stat?.title || '',
    number: stat?.number || 0,
    suffix: stat?.suffix || '+',
    label: stat?.label || '',
    iconType: stat?.iconType || 'experience',
    color: stat?.color || 'from-blue-500 to-blue-600',
    order: stat?.order || 0,
    isActive: stat?.isActive ?? true,
  })

  const iconTypes = [
    { value: 'experience', label: 'Pieredze' },
    { value: 'patients', label: 'Pacienti' },
    { value: 'specialists', label: 'Speciālisti' },
    { value: 'services', label: 'Pakalpojumi' },
  ]

  const colors = [
    { value: 'from-blue-500 to-blue-600', label: 'Zils' },
    { value: 'from-rose-500 to-rose-600', label: 'Rozā' },
    { value: 'from-green-500 to-green-600', label: 'Zaļš' },
    { value: 'from-purple-500 to-purple-600', label: 'Violets' },
    { value: 'from-orange-500 to-orange-600', label: 'Oranžs' },
    { value: 'from-teal-500 to-teal-600', label: 'Teal' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: stat?.id,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-[#706152] mb-6">
          {stat ? 'Rediģēt statistiku' : 'Pievienot statistiku'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Nosaukums (Šeit var rakstīt jebko)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value, label: formData.label || e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Galvenais teksts
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({...formData, label: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              placeholder={formData.title}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                Skaitlis *
              </label>
              <input
                type="number"
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: parseInt(e.target.value) || 0})}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                Sufikss (var lietot arī citus simbolus)
              </label>
              <input
                type="text"
                value={formData.suffix}
                onChange={(e) => setFormData({...formData, suffix: e.target.value})}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                placeholder="+"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Ikonas tips
            </label>
            <select
              value={formData.iconType}
              onChange={(e) => setFormData({...formData, iconType: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
            >
              {iconTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Krāsa (Būs redzama tikai admina panelī)
            </label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
            >
              {colors.map((color) => (
                <option key={color.value} value={color.value}>{color.label}</option>
              ))}
            </select>
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

// Content Form Component
function ContentForm({
  content,
  onSave,
  onCancel
}: {
  content: ContentData | null
  onSave: (content: ContentData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<ContentData>({
    headerTitle: content?.headerTitle || 'Kāpēc izvēlēties Adoria?',
    headerSubtitle: content?.headerSubtitle || 'Ar 15+ gadu pieredzi veselības aprūpē, mēs esam kļuvuši par uzticamu partneri jūsu un jūsu ģimenes veselības jautājumos',
    description: content?.description || 'ir ar pretīmnākošu attieksmi pret klientu un sniedz augstas kvalitātes medicīniskos pakalpojumus, pašā Rīgas centrā',
    companyName: content?.companyName || 'Veselības un skaistuma centrs Adoria',
    image: content?.image || '',
    rating: content?.rating || '4.6',
    address: content?.address || 'A. Čaka iela 70-3',
    email: content?.email || 'info@adoria.lv',
    phone: content?.phone || '+371 67 315 000',
    isActive: content?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image) {
      toast.error('Lūdzu, pievienojiet attēlu')
      return
    }
    onSave({
      ...formData,
      id: content?.id,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-[#706152] mb-6">
          {content ? 'Rediģēt saturu' : 'Pievienot saturu'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <S3Upload
            currentImage={formData.image}
            onImageChange={(url) => setFormData({...formData, image: url || ''})}
            folder="experience"
            label="Experience attēls"
          />

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Galvenais virsraksts *
            </label>
            <input
              type="text"
              value={formData.headerTitle}
              onChange={(e) => setFormData({...formData, headerTitle: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Apakšvirsraksts *
            </label>
            <textarea
              value={formData.headerSubtitle}
              onChange={(e) => setFormData({...formData, headerSubtitle: e.target.value})}
              rows={3}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Apakšējais virsraksts *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Apakšējais apraksts *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={2}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                Reitings
              </label>
              <input
                type="text"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
                placeholder="4.6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                Adrese
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                E-pasts
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#706152] mb-1">
                Telefons
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              />
            </div>
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

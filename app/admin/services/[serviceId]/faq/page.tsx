'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Save, X, HelpCircle, Clock, MessageCircle, Sparkles, Heart, Eye, EyeOff, Euro, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface ServiceFAQ {
  id: string
  question: string
  answer: string
  icon: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Service {
  id: string
  title: string
  href: string
}

interface FAQFormData {
  question: string
  answer: string
  icon: string
  order: number
  isActive: boolean
}

const iconOptions = [
  { value: 'HelpCircle', label: 'Palīdzība', icon: HelpCircle },
  { value: 'Clock', label: 'Laiks', icon: Clock },
  { value: 'MessageCircle', label: 'Ziņa', icon: MessageCircle },
  { value: 'Sparkles', label: 'Spīdums', icon: Sparkles },
  { value: 'Heart', label: 'Sirds', icon: Heart },
  { value: 'Euro', label: 'Euro', icon: Euro },
]

export default function ServiceFAQAdmin() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params?.serviceId as string

  const [service, setService] = useState<Service | null>(null)
  const [faqs, setFaqs] = useState<ServiceFAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [editingFaq, setEditingFaq] = useState<ServiceFAQ | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FAQFormData>({
    question: '',
    answer: '',
    icon: 'HelpCircle',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    if (serviceId) {
      fetchService()
      fetchFAQs()
    }
  }, [serviceId])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`)
      if (response.ok) {
        const data = await response.json()
        setService(data)
      } else {
        toast.error('Pakalpojums nav atrasts')
        router.push('/admin/services')
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      toast.error('Kļūda ielādējot pakalpojumu')
    }
  }

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}/faq`)
      if (response.ok) {
        const data = await response.json()
        setFaqs(data)
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      toast.error('Kļūda ielādējot FAQ')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = `/api/admin/services/${serviceId}/faq`
      const method = editingFaq ? 'PUT' : 'POST'
      const data = editingFaq ? { ...formData, id: editingFaq.id } : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success(editingFaq ? 'FAQ atjaunināts!' : 'FAQ izveidots!')
        fetchFAQs()
        resetForm()
      } else {
        toast.error('Kļūda saglabājot FAQ')
      }
    } catch (error) {
      console.error('Error saving FAQ:', error)
      toast.error('Kļūda saglabājot FAQ')
    }
  }

  const deleteFaq = async (id: string) => {
    if (!confirm('Vai tiešām vēlaties dzēst šo FAQ?')) return

    try {
      const response = await fetch(`/api/admin/services/${serviceId}/faq`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        toast.success('FAQ dzēsts!')
        fetchFAQs()
      } else {
        toast.error('Kļūda dzēšot FAQ')
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      toast.error('Kļūda dzēšot FAQ')
    }
  }

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      icon: 'HelpCircle',
      order: 0,
      isActive: true
    })
    setEditingFaq(null)
    setShowForm(false)
  }

  const editFaq = (faq: ServiceFAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      icon: faq.icon,
      order: faq.order,
      isActive: faq.isActive
    })
    setEditingFaq(faq)
    setShowForm(true)
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName)
    if (iconOption) {
      const IconComponent = iconOption.icon
      return <IconComponent className="w-5 h-5" />
    }
    return <HelpCircle className="w-5 h-5" />
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B7AB96] mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Atpakaļ uz pakalpojumiem
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              FAQ: {service?.title}
            </h1>
            <p className="text-gray-600">Pārvaldīt pakalpojuma specifiskos FAQ jautājumus</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#B7AB96] text-white px-4 py-2 rounded-lg hover:bg-[#706152] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Pievienot FAQ
          </button>
        </div>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jautājums
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ikona
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kārtība
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Darbības
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {faqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 line-clamp-2">
                      {faq.question}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {faq.answer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getIconComponent(faq.icon)}
                      <span className="text-sm text-gray-600">{faq.icon}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {faq.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      faq.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {faq.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {faq.isActive ? 'Aktīvs' : 'Neaktīvs'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editFaq(faq)}
                        className="text-[#B7AB96] hover:text-[#706152] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteFaq(faq.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {faqs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nav FAQ jautājumu</h3>
            <p className="text-gray-600 mb-4">Pievienojiet FAQ jautājumus šim pakalpojumam</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#B7AB96] text-white px-4 py-2 rounded-lg hover:bg-[#706152] transition-colors"
            >
              Pievienot pirmo FAQ
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingFaq ? 'Rediģēt FAQ' : 'Pievienot FAQ'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jautājums *
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B7AB96]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Atbilde *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B7AB96]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ikona
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B7AB96]"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kārtība
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B7AB96]"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-[#B7AB96] focus:ring-[#B7AB96] border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Aktīvs
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Atcelt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B7AB96] text-white rounded-md hover:bg-[#706152] transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingFaq ? 'Atjaunināt' : 'Izveidot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
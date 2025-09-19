'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, HelpCircle, Clock, MessageCircle, Sparkles, Heart, Eye, EyeOff, Euro } from 'lucide-react'
import toast from 'react-hot-toast'

interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  icon: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface FAQFormData {
  question: string
  answer: string
  category: string
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

const categoryOptions = [
  'Pieteikšanās',
  'Pieejamība',
  'Konsultācijas',
  'Apmaksa',
  'Bērnu aprūpe',
  'Pakalpojumi',
  'Cita'
]

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FAQFormData>({
    question: '',
    answer: '',
    category: '',
    icon: 'HelpCircle',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/faq')
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
      const url = editingFaq ? '/api/faq' : '/api/faq'
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

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || '',
      icon: faq.icon,
      order: faq.order,
      isActive: faq.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Vai tiešām vēlaties dzēst šo FAQ?')) return

    try {
      const response = await fetch(`/api/faq?id=${id}`, {
        method: 'DELETE'
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

  const toggleActive = async (faq: FAQ) => {
    try {
      const response = await fetch('/api/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...faq,
          isActive: !faq.isActive
        })
      })

      if (response.ok) {
        toast.success('FAQ statuss mainīts!')
        fetchFAQs()
      } else {
        toast.error('Kļūda mainot statusu')
      }
    } catch (error) {
      console.error('Error toggling FAQ status:', error)
      toast.error('Kļūda mainot statusu')
    }
  }

  const resetForm = () => {
    setEditingFaq(null)
    setShowForm(false)
    setFormData({
      question: '',
      answer: '',
      category: '',
      icon: 'HelpCircle',
      order: 0,
      isActive: true
    })
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName)
    if (iconOption) {
      const IconComponent = iconOption.icon
      return <IconComponent size={20} />
    }
    return <HelpCircle size={20} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#706152] mb-2">FAQ Pārvaldība</h1>
              <p className="text-[#706152] opacity-75">Pārvaldiet biežāk uzdotos jautājumus</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#B7AB96] hover:bg-[#a59885] text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <Plus size={20} />
              Pievienot FAQ
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#706152]">
                  {editingFaq ? 'Rediģēt FAQ' : 'Pievienot FAQ'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-[#706152] hover:text-[#706152]"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#706152] mb-2">
                    Jautājums *
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7AB96]/50 focus:border-[#B7AB96] resize-none"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#706152] mb-2">
                    Atbilde *
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7AB96]/50 focus:border-[#B7AB96] resize-none"
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#706152] mb-2">
                      Kategorija
                    </label>
                    <div className="space-y-2">
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            // Don't change formData yet, wait for custom input
                            return
                          }
                          setFormData(prev => ({ ...prev, category: e.target.value }))
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7AB96]/50 focus:border-[#B7AB96]"
                      >
                        <option value="">Nav kategorijas</option>
                        {categoryOptions.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                        <option value="custom">+ Izveidot jaunu kategoriju</option>
                      </select>

                      {/* Custom category input that appears when "custom" is selected or when typing */}
                      <input
                        type="text"
                        placeholder="Ievadiet jaunu kategoriju vai izvēlieties no saraksta"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7AB96]/50 focus:border-[#B7AB96] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#706152] mb-2">
                      Ikona
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7AB96]/50 focus:border-[#B7AB96]"
                    >
                      {iconOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#706152] mb-2">
                      Kārtas numurs
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7AB96]/50 focus:border-[#B7AB96]"
                      min="0"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="w-5 h-5 text-[#B7AB96] border-gray-300 rounded focus:ring-[#B7AB96]"
                      />
                      <span className="text-sm font-medium text-[#706152]">Aktīvs</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#B7AB96] hover:bg-[#a59885] text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <Save size={20} />
                    {editingFaq ? 'Atjaunināt' : 'Saglabāt'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-[#706152] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Atcelt
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#706152]">
              FAQ Saraksts ({faqs.length})
            </h2>
          </div>

          {faqs.length === 0 ? (
            <div className="p-12 text-center">
              <HelpCircle size={48} className="mx-auto text-[#706152] mb-4" />
              <h3 className="text-lg font-medium text-[#706152] mb-2">Nav FAQ ierakstu</h3>
              <p className="text-[#706152] mb-6">Pievienojiet pirmo FAQ, lai sāktu</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#B7AB96] hover:bg-[#a59885] text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Pievienot FAQ
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${!faq.isActive ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        faq.isActive
                          ? 'bg-gradient-to-br from-[#B7AB96] to-[#706152] text-white'
                          : 'bg-gray-200 text-[#706152]'
                      }`}>
                        {getIconComponent(faq.icon)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-lg font-semibold text-[#706152] leading-tight">
                          {faq.question}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => toggleActive(faq)}
                            className={`p-2 rounded-lg transition-colors ${
                              faq.isActive
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-[#706152] hover:bg-[#706152]'
                            }`}
                            title={faq.isActive ? 'Deaktivizēt' : 'Aktivizēt'}
                          >
                            {faq.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button
                            onClick={() => handleEdit(faq)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Rediģēt"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Dzēst"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <p className="text-[#706152] opacity-75 mb-3 leading-relaxed">
                        {faq.answer}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-[#706152]">
                        {faq.category && (
                          <span className="px-2 py-1 bg-[#B7AB96]/10 text-[#706152] rounded-md font-medium">
                            {faq.category}
                          </span>
                        )}
                        <span>Kārtas nr: {faq.order}</span>
                        <span>#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
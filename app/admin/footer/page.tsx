'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Save, X, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface SocialLink {
  id: string
  name: string
  href: string
  icon: string
  order: number
  isActive: boolean
}

interface QuickLink {
  id: string
  label: string
  href: string
  order: number
  isActive: boolean
}

interface FooterSettings {
  id: string
  logoPath: string
  companyDescription: string
  phone: string
  email: string
  address: string
  showServices: boolean
  isActive: boolean
}

export default function FooterAdmin() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([])
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null)
  const [editingQuickLink, setEditingQuickLink] = useState<QuickLink | null>(null)
  const [newSocialLink, setNewSocialLink] = useState({
    name: '',
    href: '',
    icon: '',
    order: 0,
    isActive: true
  })
  const [newQuickLink, setNewQuickLink] = useState({
    label: '',
    href: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch social links
      const socialResponse = await fetch('/api/social-links')
      if (socialResponse.ok) {
        const socialData = await socialResponse.json()
        setSocialLinks(socialData)
      }

      // Fetch quick links
      const quickResponse = await fetch('/api/quick-links')
      if (quickResponse.ok) {
        const quickData = await quickResponse.json()
        setQuickLinks(quickData)
      }

      // Fetch footer settings
      const footerResponse = await fetch('/api/footer-settings')
      if (footerResponse.ok) {
        const footerData = await footerResponse.json()
        if (footerData.length > 0) {
          setFooterSettings(footerData[0])
        }
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching footer data:', error)
      toast.error('Kļūda ielādējot datus')
      setLoading(false)
    }
  }

  const handleSaveSocialLink = async () => {
    try {
      const response = await fetch('/api/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSocialLink)
      })

      if (response.ok) {
        toast.success('Sociālā saite saglabāta!')
        setNewSocialLink({ name: '', href: '', icon: '', order: 0, isActive: true })
        fetchData()
      } else {
        throw new Error('API error')
      }
    } catch (error) {
      toast.error('Kļūda saglabājot sociālo saiti')
    }
  }

  const handleSaveQuickLink = async () => {
    try {
      const response = await fetch('/api/quick-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuickLink)
      })

      if (response.ok) {
        toast.success('Ātrā saite saglabāta!')
        setNewQuickLink({ label: '', href: '', order: 0, isActive: true })
        fetchData()
      } else {
        throw new Error('API error')
      }
    } catch (error) {
      toast.error('Kļūda saglabājot ātro saiti')
    }
  }

  const handleDeleteSocialLink = async (id: string) => {
    if (!confirm('Vai tiešām vēlaties dzēst šo sociālo saiti?')) return

    try {
      const response = await fetch(`/api/social-links?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Sociālā saite dzēsta!')
        fetchData()
      } else {
        throw new Error('API error')
      }
    } catch (error) {
      toast.error('Kļūda dzēšot sociālo saiti')
    }
  }

  const handleDeleteQuickLink = async (id: string) => {
    if (!confirm('Vai tiešām vēlaties dzēst šo ātro saiti?')) return

    try {
      const response = await fetch(`/api/quick-links?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Ātrā saite dzēsta!')
        fetchData()
      } else {
        throw new Error('API error')
      }
    } catch (error) {
      toast.error('Kļūda dzēšot ātro saiti')
    }
  }

  const handleEditSocialLink = (link: SocialLink) => {
    setEditingSocialLink({ ...link })
    setEditingId(link.id)
  }

  const handleEditQuickLink = (link: QuickLink) => {
    setEditingQuickLink({ ...link })
    setEditingId(link.id)
  }

  const handleUpdateSocialLink = async () => {
    if (!editingSocialLink) return

    try {
      const response = await fetch('/api/social-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSocialLink)
      })

      if (response.ok) {
        toast.success('Sociālā saite atjaunināta!')
        setEditingSocialLink(null)
        setEditingId(null)
        fetchData()
      } else {
        throw new Error('API error')
      }
    } catch (error) {
      toast.error('Kļūda atjauninot sociālo saiti')
    }
  }

  const handleUpdateQuickLink = async () => {
    if (!editingQuickLink) return

    try {
      const response = await fetch('/api/quick-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingQuickLink)
      })

      if (response.ok) {
        toast.success('Ātrā saite atjaunināta!')
        setEditingQuickLink(null)
        setEditingId(null)
        fetchData()
      } else {
        throw new Error('API error')
      }
    } catch (error) {
      toast.error('Kļūda atjauninot ātro saiti')
    }
  }

  const handleCancelEdit = () => {
    setEditingSocialLink(null)
    setEditingQuickLink(null)
    setEditingId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
      </div>
    )
  }

  const handleUpdateFooterSettings = async () => {
    if (!footerSettings) return

    try {
      const response = await fetch('/api/footer-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footerSettings)
      })

      if (response.ok) {
        toast.success('Footer iestatījumi atjaunināti!')
        fetchData()
      } else {
        throw new Error('API error')
      }
    } catch (error) {
      toast.error('Kļūda atjauninot Footer iestatījumus')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#706152]">Footer pārvaldība</h1>
      </div>

      {/* Footer Settings Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

        {footerSettings ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#706152] mb-2">
                  Logo ceļš
                </label>
                <input
                  type="text"
                  value={footerSettings.logoPath}
                  onChange={(e) => setFooterSettings(prev => prev ? { ...prev, logoPath: e.target.value } : null)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
                  placeholder="/footer-logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#706152] mb-2">
                  Telefons
                </label>
                <input
                  type="text"
                  value={footerSettings.phone}
                  onChange={(e) => setFooterSettings(prev => prev ? { ...prev, phone: e.target.value } : null)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
                  placeholder="+371 67 315 000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#706152] mb-2">
                  E-pasts
                </label>
                <input
                  type="email"
                  value={footerSettings.email}
                  onChange={(e) => setFooterSettings(prev => prev ? { ...prev, email: e.target.value } : null)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
                  placeholder="info@adoria.lv"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#706152] mb-2">
                  Adrese
                </label>
                <input
                  type="text"
                  value={footerSettings.address}
                  onChange={(e) => setFooterSettings(prev => prev ? { ...prev, address: e.target.value } : null)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
                  placeholder="A. Čaka iela 70-3, Rīga"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#706152] mb-2">
                Uzņēmuma apraksts
              </label>
              <textarea
                value={footerSettings.companyDescription}
                onChange={(e) => setFooterSettings(prev => prev ? { ...prev, companyDescription: e.target.value } : null)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
                placeholder="Veselības un skaistuma centrs Adoria sniedz kvalitatīvus medicīniskos pakalpojumus visai ģimenei Rīgas centrā."
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={footerSettings.showServices}
                  onChange={(e) => setFooterSettings(prev => prev ? { ...prev, showServices: e.target.checked } : null)}
                  className="mr-2"
                />
                <span className="text-sm text-[#706152]">Rādīt pakalpojumus</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={footerSettings.isActive}
                  onChange={(e) => setFooterSettings(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                  className="mr-2"
                />
                <span className="text-sm text-[#706152]">Aktīvs</span>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleUpdateFooterSettings}
                className="bg-[#B7AB96] text-white px-6 py-2 rounded-md hover:bg-[#a59885] transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Saglabāt iestatījumus
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">Nav footer iestatījumu</div>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/footer-settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      logoPath: '/footer-logo.png',
                      companyDescription: 'Veselības un skaistuma centrs Adoria sniedz kvalitatīvus medicīniskos pakalpojumus visai ģimenei Rīgas centrā.',
                      phone: '+371 67 315 000',
                      email: 'info@adoria.lv',
                      address: 'A. Čaka iela 70-3, Rīga',
                      showServices: true,
                      isActive: true
                    })
                  })
                  if (response.ok) {
                    toast.success('Footer iestatījumi izveidoti!')
                    fetchData()
                  } else {
                    throw new Error('API error')
                  }
                } catch (error) {
                  toast.error('Kļūda izveidojot footer iestatījumus')
                }
              }}
              className="bg-[#B7AB96] text-white px-6 py-2 rounded-md hover:bg-[#a59885] transition-colors"
            >
              Izveidot footer iestatījumus
            </button>
          </div>
        )}
      </div>

      {/* Social Links Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-[#706152] mb-6">Sociālās saites</h2>

        {/* Add New Social Link */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-[#706152] mb-4">Pievienot jaunu sociālo saiti</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Nosaukums (Facebook)"
              value={newSocialLink.name}
              onChange={(e) => setNewSocialLink(prev => ({ ...prev, name: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
            />
            <input
              type="url"
              placeholder="Saite (https://...)"
              value={newSocialLink.href}
              onChange={(e) => setNewSocialLink(prev => ({ ...prev, href: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Ikona (faila nosaukums)"
              value={newSocialLink.icon}
              onChange={(e) => setNewSocialLink(prev => ({ ...prev, icon: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Kārta"
              value={newSocialLink.order}
              onChange={(e) => setNewSocialLink(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
            />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newSocialLink.isActive}
                onChange={(e) => setNewSocialLink(prev => ({ ...prev, isActive: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Aktīvs</span>
            </label>
            <button
              onClick={handleSaveSocialLink}
              className="bg-[#B7AB96] text-white px-4 py-2 rounded-md hover:bg-[#a59885] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Pievienot
            </button>
          </div>
        </div>

        {/* Social Links List */}
        <div className="space-y-4">
          {socialLinks.map((link) => (
            <div key={link.id} className="p-4 border border-gray-200 rounded-lg">
              {editingId === link.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Nosaukums"
                      value={editingSocialLink?.name || ''}
                      onChange={(e) => setEditingSocialLink(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
                    />
                    <input
                      type="url"
                      placeholder="Saite"
                      value={editingSocialLink?.href || ''}
                      onChange={(e) => setEditingSocialLink(prev => prev ? { ...prev, href: e.target.value } : null)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Ikona"
                      value={editingSocialLink?.icon || ''}
                      onChange={(e) => setEditingSocialLink(prev => prev ? { ...prev, icon: e.target.value } : null)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
                    />
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingSocialLink?.isActive || false}
                          onChange={(e) => setEditingSocialLink(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Aktīvs</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleUpdateSocialLink}
                      className="bg-[#B7AB96] text-white px-4 py-2 rounded-md hover:bg-[#a59885] transition-colors flex items-center gap-2"
                    >
                      <Save size={16} />
                      Saglabāt
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-[#706152] text-white px-4 py-2 rounded-md hover:bg-[#5f5449] transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Atcelt
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <div className="font-medium">{link.name}</div>
                      <div className="text-gray-500 flex items-center gap-2">
                        <ExternalLink size={14} />
                        {link.href}
                      </div>
                      <div className="text-gray-400">Ikona: {link.icon}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${link.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {link.isActive ? 'Aktīvs' : 'Neaktīvs'}
                    </span>
                    <button
                      onClick={() => handleEditSocialLink(link)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSocialLink(link.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-[#706152] mb-6">Ātrās saites</h2>

        {/* Add New Quick Link */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-[#706152] mb-4">Pievienot jaunu ātro saiti</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nosaukums"
              value={newQuickLink.label}
              onChange={(e) => setNewQuickLink(prev => ({ ...prev, label: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Saite (/par-mums)"
              value={newQuickLink.href}
              onChange={(e) => setNewQuickLink(prev => ({ ...prev, href: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Kārta"
              value={newQuickLink.order}
              onChange={(e) => setNewQuickLink(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
            />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newQuickLink.isActive}
                onChange={(e) => setNewQuickLink(prev => ({ ...prev, isActive: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Aktīvs</span>
            </label>
            <button
              onClick={handleSaveQuickLink}
              className="bg-[#B7AB96] text-white px-4 py-2 rounded-md hover:bg-[#a59885] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Pievienot
            </button>
          </div>
        </div>

        {/* Quick Links List */}
        <div className="space-y-4">
          {quickLinks.map((link) => (
            <div key={link.id} className="p-4 border border-gray-200 rounded-lg">
              {editingId === link.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Nosaukums"
                      value={editingQuickLink?.label || ''}
                      onChange={(e) => setEditingQuickLink(prev => prev ? { ...prev, label: e.target.value } : null)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Saite"
                      value={editingQuickLink?.href || ''}
                      onChange={(e) => setEditingQuickLink(prev => prev ? { ...prev, href: e.target.value } : null)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent"
                    />
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingQuickLink?.isActive || false}
                          onChange={(e) => setEditingQuickLink(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Aktīvs</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleUpdateQuickLink}
                      className="bg-[#B7AB96] text-white px-4 py-2 rounded-md hover:bg-[#a59885] transition-colors flex items-center gap-2"
                    >
                      <Save size={16} />
                      Saglabāt
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-[#706152] text-white px-4 py-2 rounded-md hover:bg-[#5f5449] transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Atcelt
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <div className="font-medium">{link.label}</div>
                      <div className="text-gray-500">{link.href}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${link.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {link.isActive ? 'Aktīvs' : 'Neaktīvs'}
                    </span>
                    <button
                      onClick={() => handleEditQuickLink(link)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteQuickLink(link.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
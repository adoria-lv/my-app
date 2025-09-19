'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface TopBarData {
  id: string
  email: string
  address: string
  hours: string
  instagram?: string
  facebook?: string
  whatsapp?: string
  twitter?: string
  showInstagram: boolean
  showFacebook: boolean
  showWhatsapp: boolean
  showTwitter: boolean
}

export default function TopBarAdmin() {
  const [data, setData] = useState<TopBarData>({
    id: '',
    email: 'adoria@adoria.lv',
    address: 'A. Čaka iela 70-3, Rīga',
    hours: 'P. - C. 08:00 - 19:00 / Pk., S. 10:00 - 17:00',
    instagram: '',
    facebook: '',
    whatsapp: '',
    twitter: '',
    showInstagram: true,
    showFacebook: true,
    showWhatsapp: true,
    showTwitter: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTopBarData()
  }, [])

  const fetchTopBarData = async () => {
    try {
      const response = await fetch('/api/topbar')
      if (response.ok) {
        const topbarData = await response.json()
        if (topbarData) {
          setData(topbarData)
        }
      }
    } catch (error) {
      console.error('Error fetching TopBar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const method = data.id ? 'PUT' : 'POST'
      const response = await fetch('/api/topbar', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setData(updatedData)
        toast.success('TopBar dati saglabāti!')
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      } else {
        toast.error('Kļūda saglabājot datus')
      }
    } catch (error) {
      console.error('Error saving TopBar data:', error)
      toast.error('Kļūda saglabājot datus')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof TopBarData, value: string | boolean) => {
    setData(prev => ({ ...prev, [field]: value }))
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
      <div>
        <h1 className="text-2xl font-bold text-[#706152]">TopBar iestatījumi</h1>
        <p className="mt-1 text-sm text-[#706152]/80">
          Šeit var labot TopBar informāciju, kas tiek parādīta pašā lapas augšā
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-[#706152] mb-4">Kontaktinformācija</h3>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#706152]">
                  E-pasts
                </label>
                <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1 block w-full border border-[#B7AB96]/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[#706152]">
                  Adrese
                </label>
                <input
                  type="text"
                  id="address"
                  value={data.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="mt-1 block w-full border border-[#B7AB96]/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="hours" className="block text-sm font-medium text-[#706152]">
                  Darba laiks
                </label>
                <input
                  type="text"
                  id="hours"
                  value={data.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  className="mt-1 block w-full border border-[#B7AB96]/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-[#706152] mb-4">Sociālie tīkli</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-[#706152]">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    id="instagram"
                    value={data.instagram || ''}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="mt-1 block w-full border border-[#B7AB96]/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] sm:text-sm"
                    placeholder="https://instagram.com/..."
                  />
                  <div className="mt-2 flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={data.showInstagram}
                          onChange={(e) => handleInputChange('showInstagram', e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                          data.showInstagram
                            ? 'border-[#B7AB96] bg-[#B7AB96]'
                            : 'border-[#B7AB96]/30'
                        }`}>
                          {data.showInstagram && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-[#706152] text-sm">
                        Rādīt Instagram ikonu lapā
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-[#706152]">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    id="facebook"
                    value={data.facebook || ''}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    className="mt-1 block w-full border border-[#B7AB96]/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] sm:text-sm"
                    placeholder="https://facebook.com/..."
                  />
                  <div className="mt-2 flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={data.showFacebook}
                          onChange={(e) => handleInputChange('showFacebook', e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                          data.showFacebook
                            ? 'border-[#B7AB96] bg-[#B7AB96]'
                            : 'border-[#B7AB96]/30'
                        }`}>
                          {data.showFacebook && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-[#706152] text-sm">
                        Rādīt Facebook ikonu lapā
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-[#706152]">
                    WhatsApp URL
                  </label>
                  <input
                    type="url"
                    id="whatsapp"
                    value={data.whatsapp || ''}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="mt-1 block w-full border border-[#B7AB96]/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] sm:text-sm"
                    placeholder="https://wa.me/..."
                  />
                  <div className="mt-2 flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={data.showWhatsapp}
                          onChange={(e) => handleInputChange('showWhatsapp', e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                          data.showWhatsapp
                            ? 'border-[#B7AB96] bg-[#B7AB96]'
                            : 'border-[#B7AB96]/30'
                        }`}>
                          {data.showWhatsapp && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-[#706152] text-sm">
                        Rādīt WhatsApp ikonu lapā
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-[#706152]">
                    X (Twitter) URL
                  </label>
                  <input
                    type="url"
                    id="twitter"
                    value={data.twitter || ''}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="mt-1 block w-full border border-[#B7AB96]/30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] sm:text-sm"
                    placeholder="https://x.com/..."
                  />
                  <div className="mt-2 flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={data.showTwitter}
                          onChange={(e) => handleInputChange('showTwitter', e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                          data.showTwitter
                            ? 'border-[#B7AB96] bg-[#B7AB96]'
                            : 'border-[#B7AB96]/30'
                        }`}>
                          {data.showTwitter && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-3 text-[#706152] text-sm">
                        Rādīt X (Twitter) ikonu lapā
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#B7AB96] hover:bg-[#706152] text-white font-medium py-2 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B7AB96] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {saving ? 'Saglabā...' : 'Saglabāt'}
          </button>
        </div>
      </form>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Save, Plus, Trash2, Heart, Shield, Users, Star, ChevronDown, Sparkles, Edit3 } from 'lucide-react'
import { clsx } from 'clsx'

interface InfoHighlight {
  id?: string
  icon: string
  title: string
  description: string
  order: number
  isActive: boolean
}

interface InfoSection {
  id?: string
  title: string
  subtitle: string
  content: string
  isActive: boolean
  highlights: InfoHighlight[]
}

const iconOptions = [
  { value: 'Heart', label: 'Sirds', component: Heart },
  { value: 'Shield', label: 'Aizsardzība', component: Shield },
  { value: 'Users', label: 'Lietotāji', component: Users },
  { value: 'Star', label: 'Zvaigzne', component: Star }
]

export default function InfoAdmin() {
  const [infoSection, setInfoSection] = useState<InfoSection>({
    title: '',
    subtitle: '',
    content: '',
    isActive: true,
    highlights: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isMainSectionOpen, setIsMainSectionOpen] = useState(false)
  const [isHighlightsSectionOpen, setIsHighlightsSectionOpen] = useState(false)
  const [originalInfoSection, setOriginalInfoSection] = useState<InfoSection | null>(null)

  useEffect(() => {
    fetchInfoSection()
  }, [])

  const fetchInfoSection = async () => {
    try {
      const response = await fetch('/api/info')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setInfoSection(data)
          setOriginalInfoSection(JSON.parse(JSON.stringify(data))) // Deep copy
        } else {
          // No info section exists, set default values
          setInfoSection({
            title: 'Veselības centrs Adoria – Jūsu veselībai un skaistumam',
            subtitle: 'Par mums',
            content: `<p class="font-medium text-[#706152]">Veselība - tā ir cilvēka vislielākā bagātība.</p>

<p>Atbilstošas un regulāras fiziskās aktivitātes, veselīgs un vitamīniem bagāts uzturs, pietiekama ūdens lietošana ikdienā, kvalitatīvs miegs un spēja pārvarēt ikdienas stresu, – tas viss veido mūsu organisma un ķermeņa vispārējo veselību, labsajūtu un vitalitāti.</p>

<p>Un tieši tik pat svarīgi kā rūpēties par savu veselību katru dienu, ir atrast zinošus un uzticamus ārstniecības speciālistus, kam ikdienā uzticēt rūpes par savu veselību.</p>

<p>Mūsu veselības centrs Adoria, kas atrodas pašā Rīgas centrā, blakus Ziedondārzam, ir vieta, kur vienotā komandā strādā kompetenti, zinoši, augstas klases ārstniecības profesionāli.</p>

<p class="font-semibold text-[#706152]">Veselības un skaistuma Centrs Adoria patiesi lepojas ar saviem speciālistiem, kas ir savas jomas profesionāli, kuru sirds aicinājums ir palīdzēt ikvienam pacientam, sniegt pakalpojumus visaugstākajā līmenī un būt pieejamiem maksimāli ātrā laikā!</p>`,
            isActive: true,
            highlights: [
              {
                icon: 'Heart',
                title: 'Rūpes par pacientiem',
                description: 'Mūsu komanda vienmēr rūpējas par katru pacientu, nodrošinot individuālu pieeju un maksimālu komfortu.',
                order: 0,
                isActive: true
              },
              {
                icon: 'Shield',
                title: 'Augsta kvalitāte',
                description: 'Mēs izmantojam tikai modernākos aprīkojumu un metodes, lai nodrošinātu visaugstāko pakalpojumu kvalitāti.',
                order: 1,
                isActive: true
              },
              {
                icon: 'Users',
                title: 'Ekspertu komanda',
                description: 'Mūsu speciālisti ir augsti kvalificēti profesionāli ar daudzu gadu pieredzi savās jomās.',
                order: 2,
                isActive: true
              },
              {
                icon: 'Star',
                title: 'Pieredze un uzticamība',
                description: 'Gadu gaitā esam izveidojuši uzticamu reputāciju un ilgtermiņa attiecības ar pacientiem.',
                order: 3,
                isActive: true
              }
            ]
          })
          setOriginalInfoSection(null) // No original data for default values
        }
      }
    } catch (error) {
      console.error('Error fetching info section:', error)
      toast.error('Kļūda ielādējot informāciju')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const method = infoSection.id ? 'PUT' : 'POST'
      const response = await fetch('/api/info', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(infoSection)
      })

      if (response.ok) {
        const updatedSection = await response.json()
        setInfoSection(updatedSection)
        setOriginalInfoSection(JSON.parse(JSON.stringify(updatedSection))) // Update original after save
        toast.success('Informācija saglabāta!')
      } else {
        toast.error('Kļūda saglabājot')
      }
    } catch (error) {
      console.error('Error saving info section:', error)
      toast.error('Kļūda saglabājot')
    } finally {
      setSaving(false)
    }
  }

  const addHighlight = () => {
    setInfoSection(prev => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        {
          icon: 'Heart',
          title: '',
          description: '',
          order: prev.highlights.length,
          isActive: true
        }
      ]
    }))
  }

  const updateHighlight = (index: number, field: keyof InfoHighlight, value: any) => {
    setInfoSection(prev => ({
      ...prev,
      highlights: prev.highlights.map((highlight, i) =>
        i === index ? { ...highlight, [field]: value } : highlight
      )
    }))
  }

  const removeHighlight = (index: number) => {
    setInfoSection(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }))
  }

  const getIconComponent = (iconName: string) => {
    const icon = iconOptions.find(opt => opt.value === iconName)
    return icon ? icon.component : Heart
  }

  // Check if form has been modified
  const hasChanges = () => {
    if (!originalInfoSection) return true // Show save button for new data
    return JSON.stringify(infoSection) !== JSON.stringify(originalInfoSection)
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
          <h1 className="text-2xl font-bold text-[#706152]">Info sekcija</h1>
          <p className="mt-1 text-sm text-[#706152]/80">
            Pārvaldiet "Par mums" sekcijas saturu
          </p>
        </div>
{hasChanges() && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#B7AB96] hover:bg-[#706152] text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saglabā...' : 'Saglabāt'}
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-[#B7AB96]/30 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <button
          onClick={() => setIsMainSectionOpen(!isMainSectionOpen)}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-[#B7AB96]/5 hover:to-[#706152]/5 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#706152] group-hover:text-[#B7AB96] transition-colors duration-300">Pamatinformācija</h2>
              <p className="text-sm text-[#706152]/70">Virsraksts, apakšvirsraksts un saturs</p>
            </div>
          </div>
          <ChevronDown
            className={clsx(
              "w-6 h-6 text-[#B7AB96] transition-all duration-300 group-hover:text-[#706152] group-hover:scale-110",
              isMainSectionOpen && "rotate-180"
            )}
          />
        </button>

        {isMainSectionOpen && (
          <div className="px-6 pb-6 animate-fade-in">
            <div className="bg-gradient-to-r from-gray-50/50 to-transparent rounded-xl p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#706152] mb-2">
                  Virsraksts
                </label>
                <input
                  type="text"
                  value={infoSection.title}
                  onChange={(e) => setInfoSection(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-[#B7AB96] text-[#706152] bg-white/50 transition-all duration-200"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-[#706152] mb-2">
                  Apakšvirsraksts
                </label>
                <input
                  type="text"
                  value={infoSection.subtitle}
                  onChange={(e) => setInfoSection(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-[#B7AB96] text-[#706152] bg-white/50 transition-all duration-200"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-[#706152] mb-2">
                  Saturs (HTML)
                </label>
                <textarea
                  value={infoSection.content}
                  onChange={(e) => setInfoSection(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-[#B7AB96] text-[#706152] bg-white/50 transition-all duration-200 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Highlights */}
      <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-[#B7AB96]/30 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <button
          onClick={() => setIsHighlightsSectionOpen(!isHighlightsSectionOpen)}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-[#B7AB96]/5 hover:to-[#706152]/5 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#706152] to-[#B7AB96] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#706152] group-hover:text-[#B7AB96] transition-colors duration-300">Īpašības ({infoSection.highlights.length})</h2>
              <p className="text-sm text-[#706152]/70">Mūsu priekšrocību bloki</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              onClick={(e) => {
                e.stopPropagation()
                addHighlight()
                if (!isHighlightsSectionOpen) {
                  setIsHighlightsSectionOpen(true)
                }
              }}
              className="bg-gradient-to-r from-[#B7AB96] to-[#706152] hover:from-[#706152] hover:to-[#B7AB96] text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
            >
              <Plus size={16} />
              Pievienot
            </div>
            <ChevronDown
              className={clsx(
                "w-6 h-6 text-[#B7AB96] transition-all duration-300 group-hover:text-[#706152] group-hover:scale-110",
                isHighlightsSectionOpen && "rotate-180"
              )}
            />
          </div>
        </button>

        {isHighlightsSectionOpen && (
          <div className="px-6 pb-6 animate-fade-in">
            <div className="space-y-4">
              {infoSection.highlights.map((highlight, index) => {
                const IconComponent = getIconComponent(highlight.icon)
                return (
                  <div key={index} className="bg-gradient-to-r from-white to-gray-50/30 border-2 border-[#B7AB96]/20 rounded-2xl p-6 space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#B7AB96]/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                      {/* Icon */}
                      <div>
                        <label className="block text-sm font-medium text-[#706152] mb-2">
                          Ikona
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <IconComponent size={18} />
                          </div>
                          <select
                            value={highlight.icon}
                            onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-[#B7AB96] text-[#706152] bg-white/50 transition-all duration-200"
                          >
                            {iconOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-[#706152] mb-2">
                          Virsraksts
                        </label>
                        <input
                          type="text"
                          value={highlight.title}
                          onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-[#B7AB96] text-[#706152] bg-white/50 transition-all duration-200"
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2 lg:col-span-2">
                        <label className="block text-sm font-medium text-[#706152] mb-2">
                          Apraksts
                        </label>
                        <textarea
                          value={highlight.description}
                          onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-[#B7AB96] text-[#706152] bg-white/50 transition-all duration-200"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-end">
                        <button
                          onClick={() => removeHighlight(index)}
                          className="text-red-500 hover:text-white hover:bg-red-500 p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                          title="Dzēst"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {infoSection.highlights.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-[#B7AB96]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#706152] mb-2">Nav nevienas īpašības</h3>
                  <p className="text-[#706152]/60 mb-4">Pievienojiet jaunas īpašības, lai uzlabotu saturu!</p>
                  <div
                    onClick={addHighlight}
                    className="bg-gradient-to-r from-[#B7AB96] to-[#706152] hover:from-[#706152] hover:to-[#B7AB96] text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                  >
                    <Plus size={16} />
                    Izveidot pirmo īpašību
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
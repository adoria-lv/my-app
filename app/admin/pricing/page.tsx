'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Service {
  id: string
  title: string
  href: string
  isActive: boolean
}

interface PricingItem {
  id: string
  serviceName: string
  price: string
  description?: string
  order: number
  isActive: boolean
}

interface ServicePricing {
  id: string
  title: string
  serviceId: string
  order: number
  isActive: boolean
  service: {
    title: string
    href: string
  }
  pricingItems: PricingItem[]
}

export default function PricingAdminPage() {
  const [servicePricings, setServicePricings] = useState<ServicePricing[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [showServicePricingDialog, setShowServicePricingDialog] = useState(false)
  const [showPricingItemDialog, setShowPricingItemDialog] = useState(false)
  const [editingServicePricing, setEditingServicePricing] = useState<ServicePricing | null>(null)
  const [editingPricingItem, setEditingPricingItem] = useState<PricingItem | null>(null)
  const [selectedServicePricingId, setSelectedServicePricingId] = useState<string>('')

  // Form data
  const [servicePricingForm, setServicePricingForm] = useState({
    serviceId: '',
    title: '',
    order: 0,
    isActive: true
  })

  const [pricingItemForm, setPricingItemForm] = useState({
    servicePricingId: '',
    serviceName: '',
    price: '',
    description: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [pricingResponse, servicesResponse] = await Promise.all([
        fetch('/api/pricing'),
        fetch('/api/services')
      ])

      if (pricingResponse.ok) {
        const pricingData = await pricingResponse.json()
        setServicePricings(pricingData)
      }

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json()
        setServices(servicesData.filter((s: Service) => s.isActive))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Kļūda ielādējot datus')
    } finally {
      setLoading(false)
    }
  }

  const handleServicePricingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingServicePricing ? '/api/pricing' : '/api/pricing'
      const method = editingServicePricing ? 'PUT' : 'POST'
      const data = editingServicePricing
        ? { ...servicePricingForm, id: editingServicePricing.id }
        : servicePricingForm

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success(editingServicePricing ? 'Cenrādis atjaunināts' : 'Cenrādis izveidots')
        setShowServicePricingDialog(false)
        resetServicePricingForm()
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Kļūda saglabājot cenrādi')
      }
    } catch (error) {
      toast.error('Kļūda saglabājot cenrādi')
    }
  }

  const handlePricingItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = '/api/pricing/items'
      const method = editingPricingItem ? 'PUT' : 'POST'
      const data = editingPricingItem
        ? { ...pricingItemForm, id: editingPricingItem.id }
        : pricingItemForm

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success(editingPricingItem ? 'Cenas pozīcija atjaunināta' : 'Cenas pozīcija izveidota')
        setShowPricingItemDialog(false)
        resetPricingItemForm()
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Kļūda saglabājot cenas pozīciju')
      }
    } catch (error) {
      toast.error('Kļūda saglabājot cenas pozīciju')
    }
  }

  const deleteServicePricing = async (id: string) => {
    if (!confirm('Vai tiešām vēlaties dzēst šo cenrādi?')) return

    try {
      const response = await fetch(`/api/pricing?id=${id}`, { method: 'DELETE' })

      if (response.ok) {
        toast.success('Cenrādis dzēsts')
        fetchData()
      } else {
        toast.error('Kļūda dzēšot cenrādi')
      }
    } catch (error) {
      toast.error('Kļūda dzēšot cenrādi')
    }
  }

  const deletePricingItem = async (id: string) => {
    if (!confirm('Vai tiešām vēlaties dzēst šo cenas pozīciju?')) return

    try {
      const response = await fetch(`/api/pricing/items?id=${id}`, { method: 'DELETE' })

      if (response.ok) {
        toast.success('Cenas pozīcija dzēsta')
        fetchData()
      } else {
        toast.error('Kļūda dzēšot cenas pozīciju')
      }
    } catch (error) {
      toast.error('Kļūda dzēšot cenas pozīciju')
    }
  }

  const resetServicePricingForm = () => {
    setServicePricingForm({
      serviceId: '',
      title: '',
      order: 0,
      isActive: true
    })
    setEditingServicePricing(null)
  }

  const resetPricingItemForm = () => {
    setPricingItemForm({
      servicePricingId: '',
      serviceName: '',
      price: '',
      description: '',
      order: 0,
      isActive: true
    })
    setEditingPricingItem(null)
  }

  const openEditServicePricing = (pricing: ServicePricing) => {
    setServicePricingForm({
      serviceId: pricing.serviceId,
      title: pricing.title,
      order: pricing.order,
      isActive: pricing.isActive
    })
    setEditingServicePricing(pricing)
    setShowServicePricingDialog(true)
  }

  const openEditPricingItem = (item: PricingItem, servicePricingId: string) => {
    setPricingItemForm({
      servicePricingId,
      serviceName: item.serviceName,
      price: item.price,
      description: item.description || '',
      order: item.order,
      isActive: item.isActive
    })
    setEditingPricingItem(item)
    setShowPricingItemDialog(true)
  }

  const openAddPricingItem = (servicePricingId: string) => {
    setPricingItemForm({
      servicePricingId,
      serviceName: '',
      price: '',
      description: '',
      order: 0,
      isActive: true
    })
    setSelectedServicePricingId(servicePricingId)
    setShowPricingItemDialog(true)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Ielādē...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#706152]">Cenrāži pārvaldība</h1>
          <p className="text-sm text-[#706152]/70 mt-1">Pārvaldiet pakalpojumu cenas un cenrāžus</p>
        </div>
        <button
          onClick={() => setShowServicePricingDialog(true)}
          className="bg-[#B7AB96] hover:bg-[#a59885] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Jauns cenrādis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {servicePricings.map((pricing) => (
          <div key={pricing.id} className="bg-white rounded-xl border border-[#B7AB96]/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-[#B7AB96] to-[#a59885] p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{pricing.title}</h3>
                  <p className="text-white/80 text-sm">{pricing.service.title}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openAddPricingItem(pricing.id)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="Pievienot jaunu pozīciju"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditServicePricing(pricing)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="Rediģēt cenrādi"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteServicePricing(pricing.id)}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                    title="Dzēst cenrādi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              {pricing.pricingItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#B7AB96]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-8 h-8 text-[#B7AB96]" />
                  </div>
                  <p className="text-[#706152]/70 mb-3">Nav pievienotas cenas pozīcijas</p>
                  <button
                    onClick={() => openAddPricingItem(pricing.id)}
                    className="text-[#B7AB96] hover:text-[#a59885] font-medium text-sm transition-colors"
                  >
                    Pievienot pirmo pozīciju
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {pricing.pricingItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="group relative rounded-xl shadow-md hover:shadow-lg bg-white border border-[#B7AB96]/30 p-5 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="w-7 h-7 bg-[#B7AB96]/90 text-white font-semibold text-sm shadow-sm rounded-full flex items-center justify-center">
                              {index + 1}
                            </span>
                            <h4 className="text-lg font-bold text-[#706152] group-hover:text-[#B7AB96] transition-colors">
                              {item.serviceName}
                            </h4>
                          </div>
                          {item.description && (
                            <p className="text-sm text-[#706152]/70 mt-2 leading-relaxed ml-10">{item.description}</p>
                          )}
                          <div className="ml-10 flex items-center gap-4 mt-2">
                            <span className="text-lg font-bold text-[#706152] bg-[#B7AB96]/20 px-3 py-1 rounded-lg">
                              {item.price} €
                            </span>
                            {!item.isActive && (
                              <span className="ml-3 px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-md">
                                Neaktīvs
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditPricingItem(item, pricing.id)}
                            className="p-2 text-[#706152] hover:bg-[#B7AB96]/20 hover:text-[#B7AB96] rounded-lg transition-all"
                            title="Rediģēt pozīciju"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePricingItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                            title="Dzēst pozīciju"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {servicePricings.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-[#B7AB96]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-[#B7AB96]" />
          </div>
          <h3 className="text-lg font-semibold text-[#706152] mb-2">Nav izveidoti cenrāži</h3>
          <p className="text-[#706152]/70 mb-6 max-w-md mx-auto">Izveidojiet savu pirmo cenrādi, lai sāktu pārvaldīt pakalpojumu cenas</p>
          <button
            onClick={() => setShowServicePricingDialog(true)}
            className="bg-[#B7AB96] hover:bg-[#a59885] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Izveidot pirmo cenrādi
          </button>
        </div>
      )}

      {/* Service Pricing Dialog */}
      <Dialog open={showServicePricingDialog} onOpenChange={setShowServicePricingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingServicePricing ? 'Rediģēt cenrādi' : 'Jauns cenrādis'}
            </DialogTitle>
            <DialogDescription>
              {editingServicePricing ? 'Rediģējiet cenrāža informāciju' : 'Izveidojiet jaunu cenrādi pakalpojumam'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleServicePricingSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceId">Pakalpojums</Label>
                <select
                  id="serviceId"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={servicePricingForm.serviceId}
                  onChange={(e) => setServicePricingForm({ ...servicePricingForm, serviceId: e.target.value })}
                  required
                >
                  <option value="">Izvēlieties pakalpojumu</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Cenrāža nosaukums</Label>
                <Input
                  id="title"
                  value={servicePricingForm.title}
                  onChange={(e) => setServicePricingForm({ ...servicePricingForm, title: e.target.value })}
                  placeholder="piem. Skaistumkopšanas pakalpojumi"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order">Kārtība</Label>
                <Input
                  id="order"
                  type="number"
                  value={servicePricingForm.order}
                  onChange={(e) => setServicePricingForm({ ...servicePricingForm, order: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={servicePricingForm.isActive}
                  onChange={(e) => setServicePricingForm({ ...servicePricingForm, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isActive">Aktīvs</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowServicePricingDialog(false)
                  resetServicePricingForm()
                }}
                className="border-[#B7AB96] text-[#706152] hover:bg-[#B7AB96]/10"
              >
                Atcelt
              </Button>
              <Button
                type="submit"
                className="bg-[#B7AB96] hover:bg-[#a59885] text-white"
              >
                {editingServicePricing ? 'Atjaunināt' : 'Izveidot'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Pricing Item Dialog */}
      <Dialog open={showPricingItemDialog} onOpenChange={setShowPricingItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPricingItem ? 'Rediģēt cenas pozīciju' : 'Jauna cenas pozīcija'}
            </DialogTitle>
            <DialogDescription>
              {editingPricingItem ? 'Rediģējiet cenas pozīciju' : 'Pievienojiet jaunu cenas pozīciju'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePricingItemSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceName">Pakalpojuma nosaukums</Label>
                <Input
                  id="serviceName"
                  value={pricingItemForm.serviceName}
                  onChange={(e) => setPricingItemForm({ ...pricingItemForm, serviceName: e.target.value })}
                  placeholder="piem. Sejas tīrīšana"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Cena</Label>
                <Input
                  id="price"
                  value={pricingItemForm.price}
                  onChange={(e) => setPricingItemForm({ ...pricingItemForm, price: e.target.value })}
                  placeholder="piem. 45€"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Apraksts (nav obligāts)</Label>
                <Textarea
                  id="description"
                  value={pricingItemForm.description}
                  onChange={(e) => setPricingItemForm({ ...pricingItemForm, description: e.target.value })}
                  placeholder="Īss apraksts par pakalpojumu"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="itemOrder">Kārtība</Label>
                <Input
                  id="itemOrder"
                  type="number"
                  value={pricingItemForm.order}
                  onChange={(e) => setPricingItemForm({ ...pricingItemForm, order: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="itemActive"
                  checked={pricingItemForm.isActive}
                  onChange={(e) => setPricingItemForm({ ...pricingItemForm, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="itemActive">Aktīva</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPricingItemDialog(false)
                  resetPricingItemForm()
                }}
                className="border-[#B7AB96] text-[#706152] hover:bg-[#B7AB96]/10"
              >
                Atcelt
              </Button>
              <Button
                type="submit"
                className="bg-[#B7AB96] hover:bg-[#a59885] text-white"
              >
                {editingPricingItem ? 'Atjaunināt' : 'Pievienot'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
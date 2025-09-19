'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'
import S3Upload from '../../components/ui/S3Upload'

interface DropdownItem {
  id: string
  label: string
  href: string
  iconPath?: string
  order: number
  isActive: boolean
}

interface MenuItem {
  id: string
  label: string
  href?: string
  iconPath?: string
  order: number
  isActive: boolean
  dropdowns: DropdownItem[]
}

export default function MenuAdmin() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingDropdown, setEditingDropdown] = useState<{item: MenuItem, dropdown: DropdownItem | null}>({item: {} as MenuItem, dropdown: null})
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDropdownForm, setShowDropdownForm] = useState(false)

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu')
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data)
      }
    } catch (error) {
      console.error('Error fetching menu items:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveMenuItem = async (item: Partial<MenuItem>) => {
    try {
      const method = item.id ? 'PUT' : 'POST'
      const response = await fetch('/api/menu', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })

      if (response.ok) {
        toast.success('Menu saglabāts!')
        fetchMenuItems()
        setEditingItem(null)
        setShowAddForm(false)
      } else {
        toast.error('Kļūda saglabājot')
      }
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error('Kļūda saglabājot')
    }
  }

  const deleteMenuItem = async (id: string) => {
    if (!confirm('Vai tiešām dzēst šo menu punktu?')) return

    try {
      const response = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Menu dzēsts!')
        fetchMenuItems()
      } else {
        toast.error('Kļūda dzēšot')
      }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Kļūda dzēšot')
    }
  }

  const saveDropdownItem = async (menuId: string, dropdown: Partial<DropdownItem>) => {
    try {
      const method = dropdown.id ? 'PUT' : 'POST'
      const response = await fetch('/api/menu/dropdown', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dropdown, menuId }),
      })

      if (response.ok) {
        toast.success('Dropdown saglabāts!')
        fetchMenuItems()
        setShowDropdownForm(false)
        setEditingDropdown({item: {} as MenuItem, dropdown: null})
      } else {
        toast.error('Kļūda saglabājot')
      }
    } catch (error) {
      console.error('Error saving dropdown:', error)
      toast.error('Kļūda saglabājot')
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
          <h1 className="text-2xl font-bold text-[#706152]">Galvenā izvēlne</h1>
          <p className="mt-1 text-sm text-[#706152]/80">
            Šeit redzami visi izvēlnes linki/dropdown menu.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#B7AB96] hover:bg-[#706152] text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2"
        >
          <Plus size={16} />
          Pievienot jaunu linku
        </button>
      </div>

      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-[#706152]">{item.label}</h3>
                <p className="text-sm text-[#706152]/60">
                  {item.href || 'Ar dropdown menu'} • Secība: {item.order}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 text-[#B7AB96] hover:text-[#706152] transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteMenuItem(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-[#706152]">Dropdown elementi</h4>
                <button
                  onClick={() => {
                    setEditingDropdown({item, dropdown: null})
                    setShowDropdownForm(true)
                  }}
                  className="text-[#B7AB96] hover:text-[#706152] text-sm flex items-center gap-1"
                >
                  <Plus size={14} />
                  Pievienot
                </button>
              </div>
              {item.dropdowns.length > 0 ? (
                <div className="space-y-2">
                  {item.dropdowns.map((dropdown) => (
                    <div key={dropdown.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <span className="font-medium text-[#706152]">{dropdown.label}</span>
                        <span className="ml-2 text-sm text-[#706152]/60">{dropdown.href}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingDropdown({item, dropdown})
                            setShowDropdownForm(true)
                          }}
                          className="p-1 text-[#B7AB96] hover:text-[#706152]"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#706152]/60 italic p-3 bg-gray-50 rounded-md">
                  Nav pievienoti dropdown elementi
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Menu Item Modal */}
      {(showAddForm || editingItem) && (
        <MenuItemForm
          item={editingItem}
          onSave={saveMenuItem}
          onCancel={() => {
            setEditingItem(null)
            setShowAddForm(false)
          }}
        />
      )}

      {/* Add/Edit Dropdown Modal */}
      {showDropdownForm && (
        <DropdownForm
          menuItem={editingDropdown.item}
          dropdown={editingDropdown.dropdown}
          onSave={(dropdown) => saveDropdownItem(editingDropdown.item.id, dropdown)}
          onCancel={() => {
            setShowDropdownForm(false)
            setEditingDropdown({item: {} as MenuItem, dropdown: null})
          }}
        />
      )}
    </div>
  )
}

// Menu Item Form Component
function MenuItemForm({
  item,
  onSave,
  onCancel
}: {
  item: MenuItem | null
  onSave: (item: Partial<MenuItem>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    label: item?.label || '',
    href: item?.href || '',
    iconPath: item?.iconPath || '',
    order: item?.order || 0,
    isActive: item?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: item?.id,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-medium text-[#706152] mb-4">
          {item ? 'Rediģēt menu' : 'Pievienot menu'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Nosaukums
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({...formData, label: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Saite (nav obligāti, ja ir dropdown)
            </label>
            <input
              type="text"
              value={formData.href}
              onChange={(e) => setFormData({...formData, href: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              placeholder="/lapa"
            />
          </div>
          <div>
            <S3Upload
              currentImage={formData.iconPath}
              onImageChange={(url) => setFormData({...formData, iconPath: url || ''})}
              folder="menu"
              label="Menu ikona"
              accept="image/*"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Secība
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
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
              className="bg-[#B7AB96] hover:bg-[#706152] text-white px-4 py-2 rounded-md transition-colors flex-1"
            >
              Saglabāt
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              Atcelt
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Dropdown Form Component
function DropdownForm({
  menuItem,
  dropdown,
  onSave,
  onCancel
}: {
  menuItem: MenuItem
  dropdown: DropdownItem | null
  onSave: (dropdown: Partial<DropdownItem>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    label: dropdown?.label || '',
    href: dropdown?.href || '',
    iconPath: dropdown?.iconPath || '',
    order: dropdown?.order || 0,
    isActive: dropdown?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: dropdown?.id,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-medium text-[#706152] mb-4">
          {dropdown ? 'Rediģēt dropdown' : `Pievienot dropdown priekš "${menuItem.label}"`}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Nosaukums
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({...formData, label: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Saite
            </label>
            <input
              type="text"
              value={formData.href}
              onChange={(e) => setFormData({...formData, href: e.target.value})}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              placeholder="/arstnieciba"
              required
            />
          </div>
          <div>
            <S3Upload
              currentImage={formData.iconPath}
              onImageChange={(url) => setFormData({...formData, iconPath: url || ''})}
              folder="menu"
              label="Dropdown ikona"
              accept="image/*"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Secība
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
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
              className="bg-[#B7AB96] hover:bg-[#706152] text-white px-4 py-2 rounded-md transition-colors flex-1"
            >
              Saglabāt
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              Atcelt
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
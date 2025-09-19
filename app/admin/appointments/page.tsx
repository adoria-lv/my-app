'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Edit, Trash2, Phone, Mail, Calendar, Clock, MessageCircle, User, CheckCircle, X, AlertCircle, FileText, Bell } from 'lucide-react'

interface AppointmentData {
  id: string
  name: string
  phone: string
  email: string
  service: string
  date?: string
  time?: string
  message?: string
  contactPreferences?: {
    phone?: boolean
    email?: boolean
  }
  source: 'appointment' | 'contact'
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  emailSent: boolean
  reminderSent?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const statusLabels = {
  pending: 'Saņemts',
  confirmed: 'Apstiprināts',
  cancelled: 'Atcelts',
  completed: 'Pabeigts'
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700'
}

const sourceLabels = {
  appointment: 'Vizītes pieteikums',
  contact: 'Kontaktforma'
}

const sourceColors = {
  appointment: 'bg-blue-100 text-blue-700',
  contact: 'bg-purple-100 text-purple-700'
}

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState<AppointmentData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAppointment, setEditingAppointment] = useState<AppointmentData | null>(null)
  const [showDetails, setShowDetails] = useState<AppointmentData | null>(null)
  const [sourceFilter, setSourceFilter] = useState<'all' | 'appointment' | 'contact'>('all')
  const [reminderAppointment, setReminderAppointment] = useState<AppointmentData | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointment')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAppointment = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/appointment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes }),
      })

      if (response.ok) {
        toast.success('Pieteikums atjaunināts!')
        fetchAppointments()
        setEditingAppointment(null)
      } else {
        toast.error('Kļūda atjauninot')
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast.error('Kļūda atjauninot')
    }
  }

  const deleteAppointment = async (id: string) => {
    if (!confirm('Vai tiešām dzēst šo pieteikumu?')) return

    try {
      const response = await fetch(`/api/appointment?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Pieteikums dzēsts!')
        fetchAppointments()
      } else {
        toast.error('Kļūda dzēšot')
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
      toast.error('Kļūda dzēšot')
    }
  }

  const sendReminder = async (appointmentId: string, message: string) => {
    try {
      const response = await fetch('/api/appointment/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, message }),
      })

      if (response.ok) {
        toast.success('Atgādinājums nosūtīts!')
        setReminderAppointment(null)
      } else {
        toast.error('Kļūda nosūtot atgādinājumu')
      }
    } catch (error) {
      console.error('Error sending reminder:', error)
      toast.error('Kļūda nosūtot atgādinājumu')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      if (dateString.includes('T')) {
        return new Date(dateString).toLocaleDateString('lv-LV').replace(/\.$/, '')
      }
      return new Date(dateString + 'T00:00:00').toLocaleDateString('lv-LV').replace(/\.$/, '')
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('lv-LV')
  }

  const filteredAppointments = appointments.filter(appointment => {
    if (sourceFilter === 'all') return true
    return appointment.source === sourceFilter
  })

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
          <h1 className="text-2xl font-bold text-[#706152]">Pieteikumi</h1>
          <p className="mt-1 text-sm text-[#706152]/80">
            Visi klientu pieteikumi vizītēm un kontaktformas. Kopā: {appointments.length}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as any)}
            className="border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] text-sm"
          >
            <option value="all">Visi ({appointments.length})</option>
            <option value="appointment">Vizītes ({appointments.filter(a => a.source === 'appointment').length})</option>
            <option value="contact">Kontaktforma ({appointments.filter(a => a.source === 'contact').length})</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusLabels).map(([status, label]) => {
          const count = filteredAppointments.filter(app => app.status === status).length
          return (
            <div key={status} className="bg-white rounded-lg p-4 border border-[#B7AB96]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#706152]/60">{label}</p>
                  <p className="text-2xl font-bold text-[#706152]">{count}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  status === 'pending' ? 'bg-yellow-500' :
                  status === 'confirmed' ? 'bg-green-500' :
                  status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Appointments List */}
      <div className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20 overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center text-[#706152]/60">
            {sourceFilter === 'all' ? 'Nav neviena pieteikuma' :
             sourceFilter === 'appointment' ? 'Nav vizītes pieteikumu' :
             'Nav kontaktformas ziņojumu'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Klients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Pakalpojums
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Avots
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Datums/Laiks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Statuss
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Atgādinājums
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Sazināties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Darbības
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#706152]">{appointment.name}</div>
                        <div className="text-sm text-[#706152]/60">{appointment.phone}</div>
                        <div className="text-sm text-[#706152]/60">{appointment.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#706152]">{appointment.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sourceColors[appointment.source]}`}>
                        {sourceLabels[appointment.source]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.date && appointment.time ? (
                        <>
                          <div className="flex items-center gap-2 text-sm text-[#706152]">
                            <Calendar size={14} />
                            {formatDate(appointment.date)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#706152]/60">
                            <Clock size={14} />
                            {appointment.time}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-[#706152]/60">Nav norādīts</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[appointment.status]}`}>
                        {statusLabels[appointment.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {appointment.reminderSent ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={16} />
                            <span className="text-xs">Nosūtīts</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <X size={16} />
                            <span className="text-xs">Nav nosūtīts</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#706152]">
                      {appointment.contactPreferences?.phone && appointment.contactPreferences?.email ? (
                        <span className="flex items-center gap-2">
                          <Phone size={14} className="text-[#706152]" />
                          <Mail size={14} className="text-[#706152]" />
                          Telefoniski + E-pastā
                        </span>
                      ) : appointment.contactPreferences?.phone ? (
                        <span className="flex items-center gap-2">
                          <Phone size={14} className="text-[#706152]" />
                          Telefoniski
                        </span>
                      ) : appointment.contactPreferences?.email ? (
                        <span className="flex items-center gap-2">
                          <Mail size={14} className="text-[#706152]" />
                          E-pastā
                        </span>
                      ) : (
                        'Nav norādīts'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowDetails(appointment)}
                          className="text-[#B7AB96] hover:text-[#706152] transition-colors"
                          title="Skatīt detaļas"
                        >
                          <FileText size={16} />
                        </button>
                        {appointment.source === 'appointment' && appointment.date && appointment.time && (
                          <button
                            onClick={() => setReminderAppointment(appointment)}
                            className="text-[#B7AB96] hover:text-[#706152] transition-colors"
                            title="Nosūtīt atgādinājumu"
                          >
                            <Bell size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingAppointment(appointment)}
                          className="text-[#B7AB96] hover:text-[#706152] transition-colors"
                          title="Rediģēt"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Dzēst"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onSave={updateAppointment}
          onCancel={() => setEditingAppointment(null)}
        />
      )}

      {/* Details Modal */}
      {showDetails && (
        <AppointmentDetailsModal
          appointment={showDetails}
          onClose={() => setShowDetails(null)}
        />
      )}

      {/* Reminder Modal */}
      {reminderAppointment && (
        <ReminderModal
          appointment={reminderAppointment}
          onClose={() => setReminderAppointment(null)}
          onSend={sendReminder}
        />
      )}
    </div>
  )
}

// Edit Appointment Modal
function EditAppointmentModal({
  appointment,
  onSave,
  onCancel
}: {
  appointment: AppointmentData
  onSave: (id: string, status: string, notes?: string) => void
  onCancel: () => void
}) {
  const [status, setStatus] = useState(appointment.status)
  const [notes, setNotes] = useState(appointment.notes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(appointment.id, status, notes)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-[#706152] mb-6">
          Rediģēt pieteikumu - {appointment.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Statuss
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-1">
              Piezīmes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96]"
              placeholder="Pievienojiet piezīmes par šo pieteikumu..."
            />
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

// Appointment Details Modal
function AppointmentDetailsModal({
  appointment,
  onClose
}: {
  appointment: AppointmentData
  onClose: () => void
}) {
  const formatDate = (dateString: string) => {
    try {
      if (dateString.includes('T')) {
        return new Date(dateString).toLocaleDateString('lv-LV').replace(/\.$/, '')
      }
      return new Date(dateString + 'T00:00:00').toLocaleDateString('lv-LV').replace(/\.$/, '')
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('lv-LV')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-[#706152]">
            Pieteikuma detaļas
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-[#706152] mb-3 flex items-center gap-2">
              <User size={18} />
              Klienta informācija
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#706152]/60">Vārds:</span>
                <div className="font-medium text-[#706152]">{appointment.name}</div>
              </div>
              <div>
                <span className="text-[#706152]/60">Telefons:</span>
                <div className="font-medium text-[#706152]">{appointment.phone}</div>
              </div>
              <div>
                <span className="text-[#706152]/60">E-pasts:</span>
                <div className="font-medium text-[#706152]">{appointment.email}</div>
              </div>
              {appointment.source === 'appointment' && (
                <div>
                  <span className="text-[#706152]/60">Sazināties</span>
                  <div className="font-medium text-[#706152]">
                    {appointment.contactPreferences?.phone && appointment.contactPreferences?.email
                      ? 'Telefoniski + E-pastā'
                      : appointment.contactPreferences?.phone
                      ? 'Telefoniski'
                      : appointment.contactPreferences?.email
                      ? 'E-pastā'
                      : 'Nav norādīts'
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-[#706152] mb-3 flex items-center gap-2">
              <Calendar size={18} />
              {appointment.source === 'appointment' ? 'Vizītes informācija' : 'Pakalpojuma informācija'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#706152]/60">Izvēlētais pakalpojums:</span>
                <div className="font-medium text-[#706152]">{appointment.service}</div>
              </div>
              <div>
                <span className="text-[#706152]/60">Avots:</span>
                <div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sourceColors[appointment.source]}`}>
                    {sourceLabels[appointment.source]}
                  </span>
                </div>
              </div>
              {appointment.date && appointment.time && (
                <>
                  <div>
                    <span className="text-[#706152]/60">Datums:</span>
                    <div className="font-medium text-[#706152]">{formatDate(appointment.date)}</div>
                  </div>
                  <div>
                    <span className="text-[#706152]/60">Laiks:</span>
                    <div className="font-medium text-[#706152]">{appointment.time}</div>
                  </div>
                </>
              )}
              <div>
                <span className="text-[#706152]/60">Statuss:</span>
                <div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[appointment.status]}`}>
                    {statusLabels[appointment.status]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {appointment.message && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-[#706152] mb-3 flex items-center gap-2">
                <MessageCircle size={18} />
                Ziņojums
              </h3>
              <p className="text-sm text-[#706152] leading-relaxed">{appointment.message}</p>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-[#706152] mb-3 flex items-center gap-2">
                <FileText size={18} />
                Piezīmes
              </h3>
              <p className="text-sm text-[#706152] leading-relaxed">{appointment.notes}</p>
            </div>
          )}

          {/* System Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-[#706152] mb-3 flex items-center gap-2">
              <AlertCircle size={18} />
              Papildus informācija
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#706152]/60">E-pasts nosūtīts:</span>
                <div className="font-medium text-[#706152]">
                  {appointment.emailSent ? 'Jā' : 'Nē'}
                </div>
              </div>
              <div>
                <span className="text-[#706152]/60">Izveidots:</span>
                <div className="font-medium text-[#706152]">{formatDateTime(appointment.createdAt)}</div>
              </div>
              <div>
                <span className="text-[#706152]/60">Atjaunināts:</span>
                <div className="font-medium text-[#706152]">{formatDateTime(appointment.updatedAt)}</div>
              </div>
              <div>
                <span className="text-[#706152]/60">ID:</span>
                <div className="font-medium text-[#706152] font-mono text-xs">{appointment.id}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="bg-[#B7AB96] hover:bg-[#706152] text-white px-6 py-2 rounded-md transition-colors"
          >
            Aizvērt
          </button>
        </div>
      </div>
    </div>
  )
}

// Reminder Modal
function ReminderModal({
  appointment,
  onClose,
  onSend
}: {
  appointment: AppointmentData
  onClose: () => void
  onSend: (appointmentId: string, message: string) => void
}) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      if (dateString.includes('T')) {
        return new Date(dateString).toLocaleDateString('lv-LV').replace(/\.$/, '')
      }
      return new Date(dateString + 'T00:00:00').toLocaleDateString('lv-LV').replace(/\.$/, '')
    } catch {
      return dateString
    }
  }

  // Default reminder message
  const defaultMessage = `Labdien,

atgādinam, ka Jums paredzēta vizīte ${formatDate(appointment.date || '')} plkst. ${appointment.time}.

Ja neparedzētu apstākļu dēļ nevarēsiet ierasties, lūdzam par to paziņot vismaz 24 stundas pirms vizītes.

Ar cieņu,
Veselības centrs "Adoria"`

  useEffect(() => {
    setMessage(defaultMessage)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSend(appointment.id, message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-[#706152] flex items-center gap-2">
            <Bell size={20} />
            Nosūtīt atgādinājumu - {appointment.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-[#706152] mb-2">Vizītes informācija:</h3>
            <div className="text-sm text-[#706152]/80">
              <p><strong>Klients:</strong> {appointment.name}</p>
              <p><strong>E-pasts:</strong> {appointment.email}</p>
              <p><strong>Pakalpojums:</strong> {appointment.service}</p>
              <p><strong>Datums:</strong> {formatDate(appointment.date || '')}</p>
              <p><strong>Laiks:</strong> {appointment.time}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#706152] mb-2">
              Atgādinājuma teksts:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] text-sm"
              placeholder="Ievadiet atgādinājuma tekstu..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#B7AB96] hover:bg-[#706152] disabled:bg-[#B7AB96]/50 text-white px-6 py-2 rounded-md transition-colors flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Nosūta...
                </>
              ) : (
                <>
                  <Bell size={16} />
                  Nosūtīt atgādinājumu
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
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
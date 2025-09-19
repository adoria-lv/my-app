'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Stethoscope,
  FileText,
  HelpCircle,
  Calendar,
  Users,
  Settings,
  Plus,
  Activity,
  ArrowUpRight,
  Clock
} from 'lucide-react'

interface DashboardStats {
  services: number
  subServices: number
  subSubServices: number
  blogPosts: number
  faqs: number
  appointments: number
  recentAppointments: number
}

interface RecentAppointment {
  id: string
  name: string
  service: string
  date: string
  time: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    services: 0,
    subServices: 0,
    subSubServices: 0,
    blogPosts: 0,
    faqs: 0,
    appointments: 0,
    recentAppointments: 0
  })
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, appointmentsResponse] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/admin/dashboard/recent-appointments')
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json()
        setRecentAppointments(appointmentsData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `Pirms ${diffDays} ${diffDays === 1 ? 'dienas' : 'dienām'}`
    } else if (diffHours > 0) {
      return `Pirms ${diffHours} ${diffHours === 1 ? 'stundas' : 'stundām'}`
    } else {
      return 'Tikko'
    }
  }

  const quickActions = [
    {
      title: 'Pievienot pakalpojumu',
      description: 'Izveidot jaunu pakalpojumu',
      href: '/admin/services',
      icon: Plus,
      color: 'from-[#B7AB96] to-[#a59885]'
    },
    {
      title: 'Rakstīt rakstu',
      description: 'Pievienot jaunu blog ierakstu',
      href: '/admin/jaunumi/new',
      icon: FileText,
      color: 'from-[#706152] to-[#5f5449]'
    },
    {
      title: 'FAQ pārvaldība',
      description: 'Pārvaldīt bieži uzdotos jautājumus',
      href: '/admin/faq',
      icon: HelpCircle,
      color: 'from-[#B7AB96] to-[#706152]'
    },
    {
      title: 'Apskatīt pierakstus',
      description: 'Pārvaldīt klientu pierakstus',
      href: '/admin/appointments',
      icon: Calendar,
      color: 'from-[#a59885] to-[#706152]'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#706152] to-[#B7AB96] bg-clip-text text-transparent">
            Administrācijas CP
          </h1>
          <p className="mt-2 text-lg text-[#706152]/70">
            Pārvaldiet saturu vienkārši un efektīvi
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className="relative p-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#706152] mb-2 group-hover:text-[#B7AB96] transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-[#706152]/70 mb-3">
                  {action.description}
                </p>
                <ArrowUpRight className="w-5 h-5 text-[#B7AB96] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#706152]">Jaunākie pieraksti</h2>
              <Link
                href="/admin/appointments"
                className="text-[#B7AB96] hover:text-[#706152] transition-colors flex items-center gap-1"
              >
                Apskatīt visus
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {recentAppointments.length > 0 ? (
              recentAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#B7AB96] to-[#a59885] rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#706152]">{appointment.name}</p>
                        <p className="text-sm text-[#706152]/70">{appointment.service}</p>
                        {appointment.date && appointment.time && (
                          <p className="text-xs text-[#706152]/50">
                            {appointment.date} {appointment.time}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.status === 'pending'
                          ? 'bg-yellow-100 text-gray-800'
                          : appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-green-100 text-gray-800'
                      }`}>
                        {appointment.status === 'pending' ? 'Gaida' : 'Apstiprināts'}
                      </span>
                      <p className="text-xs text-[#706152]/50 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(appointment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#706152] mb-2">Nav jaunu pierakstu</h3>
                <p className="text-[#706152]/70">Jauni pieraksti parādīsies šeit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

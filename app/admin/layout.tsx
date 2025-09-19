'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/sign-in')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
      </div>
    )
  }

  if (!session?.user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <h1 className="adminHeading">
                Adoria CMS
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/sign-in' })}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Iziet
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Sidebar */}
      <div className="flex relative">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-sm min-h-screen transition-transform duration-300 ease-in-out
          ${!sidebarOpen ? 'lg:w-16' : 'lg:w-64'}
        `}>
          {/* Sidebar Toggle Button */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full p-2 rounded-md text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <nav className="mt-4 px-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Sākums</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">S</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/topbar"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>TopBar</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">T</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/menu"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Galvenā izvēlne</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">G</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/slider"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Slaideris</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">S</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/services"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Pakalpojumi</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">P</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/sub-services"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Apakšpakalpojumi</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">A</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/experience"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Statistika</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">S</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/info"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Par mums</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">P</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/testimonials"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Atsauksmes</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">A</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/contact"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Kontakti</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">K</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/appointments"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Pieteikumi</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">P</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/jaunumi"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Jaunumi</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">J</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/faq"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>FAQ</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">F</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/pricing"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Cenrādis</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">C</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/footer"
                  className="text-[#5A4F42] hover:text-[#5A4F42] hover:bg-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <span className={`${!sidebarOpen ? 'lg:sr-only' : ''}`}>Footeris</span>
                  {!sidebarOpen && <span className="hidden lg:block text-xs">F</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-8 transition-all duration-300 ${!sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}>
          {children}
        </main>
      </div>

      {/* Toast notifications for admin */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 6000,
          style: {
            maxWidth: '400px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(183, 171, 150, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
            style: {
              backgroundColor: '#F0FDF4',
              color: '#065F46',
              border: '1px solid #10B981',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
            style: {
              backgroundColor: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #EF4444',
            },
          },
        }}
      />
    </div>
  )
}
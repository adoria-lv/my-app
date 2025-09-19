'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Edit, Trash2, Plus, Eye, EyeOff, Calendar, User } from 'lucide-react'
import Link from 'next/link'

interface JaunumuPost {
  id: string
  title: string
  slug: string
  content: string
  image?: string
  author: string
  published: boolean
  publishedAt?: string
  views: number
  tags: string[]
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
}

export default function JaunumuAdmin() {
  const [posts, setPosts] = useState<JaunumuPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/jaunumi')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Kļūda ielādējot rakstus')
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Vai tiešām dzēst šo rakstu?')) return

    try {
      const response = await fetch(`/api/jaunumi?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Raksts dzēsts!')
        fetchPosts()
      } else {
        toast.error('Kļūda dzēšot')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Kļūda dzēšot')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lv-LV')
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
          <h1 className="text-2xl font-bold text-[#706152]">Jaunumu raksti</h1>
          <p className="mt-1 text-sm text-[#706152]/80">
            Pārvaldiet blog saturu. Kopā: {posts.length}
          </p>
        </div>
        <Link
          href="/admin/jaunumi/new"
          className="bg-[#B7AB96] hover:bg-[#706152] text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Jauns raksts
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-[#B7AB96]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#706152]/60">Kopā rakstu</p>
              <p className="text-2xl font-bold text-[#706152]">{posts.length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-[#B7AB96]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#706152]/60">Publicēti</p>
              <p className="text-2xl font-bold text-[#706152]">{posts.filter(p => p.published).length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-[#B7AB96]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#706152]/60">Melnraksti</p>
              <p className="text-2xl font-bold text-[#706152]">{posts.filter(p => !p.published).length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-[#B7AB96]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#706152]/60">Kopā skatījumi</p>
              <p className="text-2xl font-bold text-[#706152]">{posts.reduce((sum, p) => sum + p.views, 0)}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white shadow-lg rounded-lg border border-[#B7AB96]/20 overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-[#706152]/60">
            Nav neviena blog raksta
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Raksts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Autors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Statuss
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Skatījumi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Datums
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#706152] uppercase tracking-wider">
                    Darbības
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-12 h-12 rounded-lg object-cover mr-4 flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-[#706152] truncate">{post.title}</div>
                          <div className="text-sm text-[#B7AB96] truncate">/{post.slug}</div>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1 max-w-xs">
                              {post.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[#B7AB96]/20 text-[#706152] whitespace-nowrap">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-[#706152]">
                        <User size={14} />
                        {post.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        post.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {post.published ? 'Publicēts' : 'Melnraksts'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#706152]">
                      {post.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-[#706152]">
                        <Calendar size={14} />
                        {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/jaunumi/edit/${post.id}`}
                          className="text-[#B7AB96] hover:text-[#706152] transition-colors"
                          title="Rediģēt"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => deletePost(post.id)}
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

    </div>
  )
}
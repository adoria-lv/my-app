'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, User, Eye, Tag, Search, ArrowRight, ArrowLeft, Home } from 'lucide-react'

interface JaunumuPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image?: string
  author: string
  published: boolean
  publishedAt?: string
  views: number
  tags: string[]
  createdAt: string
}

export default function JaunumuPage() {
  const [posts, setPosts] = useState<JaunumuPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/jaunumi?published=true')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lv-LV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '')
  }

  const getAllTags = () => {
    const allTags = posts.flatMap(post => post.tags)
    return [...new Set(allTags)].sort()
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(post.content).toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag = selectedTag === '' || post.tags.includes(selectedTag)

    return matchesSearch && matchesTag
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-x-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-x-hidden">
      {/* Hero/Breadcrumb Section */}
      <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-white border-b border-gray-200/50">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-[#B7AB96]/5 via-transparent to-[#706152]/5"></div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#706152] hover:text-[#B7AB96] font-medium transition-all duration-300 hover:gap-3 group"
            >
              <Home size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm">Sākums</span>
            </Link>
          </div>

          {/* Title Section */}
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#706152] leading-tight mb-6">
              Jaunumi
            </h1>

            <p className="text-lg text-[#706152] leading-relaxed">
              Lasiet mūsu eksperta padomus par skaistumu, veselību un labsajūtu
            </p>
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152]" />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Meklēt rakstus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B7AB96] focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Tags Filter */}
          {getAllTags().length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === ''
                    ? 'bg-[#B7AB96] text-white shadow-lg'
                    : 'bg-white text-[#706152] border border-gray-200 hover:border-[#B7AB96] hover:text-[#B7AB96]'
                }`}
              >
                Visi raksti
              </button>
              {getAllTags().map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-[#B7AB96] text-white shadow-lg'
                      : 'bg-white text-[#706152] border border-gray-200 hover:border-[#B7AB96] hover:text-[#B7AB96]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Jaunumu Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-[#706152] mb-2">
              {searchTerm || selectedTag ? 'Nav atrasti raksti' : 'Nav publicētu rakstu'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedTag
                ? 'Mēģiniet mainīt meklēšanas kritērijus'
                : 'Drīzumā šeit parādīsies jauni raksti'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <Link href={`/jaunumi/${post.slug}`} className="absolute inset-0 z-10" />

                {post.image && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                <div className="p-6 relative z-20">
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[#B7AB96]/10 text-[#706152] rounded-full text-xs font-medium"
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-[#706152] mb-3 line-clamp-2 group-hover:text-[#B7AB96] transition-colors">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      {post.views}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <div className="text-sm text-gray-500">
              Rāda {filteredPosts.length} no {posts.length} rakstiem
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
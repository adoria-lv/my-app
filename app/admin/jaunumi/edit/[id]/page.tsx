'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import QuillEditor from '@/components/QuillEditor'
import S3Upload from '../../../../components/ui/S3Upload'

interface JaunumuPost {
  id: string
  title: string
  slug: string
  content: string
  image?: string
  author: string
  published: boolean
  tags: string[]
  metaTitle?: string
  metaDescription?: string
}

export default function EditJaunumuPost() {
  const { id } = useParams()
  const router = useRouter()
  const [post, setPost] = useState<JaunumuPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    image: '',
    author: 'Adoria komanda',
    tags: '',
    metaTitle: '',
    metaDescription: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await fetch('/api/jaunumi')
      if (response.ok) {
        const allPosts = await response.json()
        const foundPost = allPosts.find((p: JaunumuPost) => p.id === id)

        if (foundPost) {
          setPost(foundPost)
          setFormData({
            title: foundPost.title,
            slug: foundPost.slug,
            content: foundPost.content,
            image: foundPost.image || '',
            author: foundPost.author,
            tags: foundPost.tags.join(', '),
            metaTitle: foundPost.metaTitle || '',
            metaDescription: foundPost.metaDescription || ''
          })
        } else {
          toast.error('Raksts nav atrasts')
          router.push('/admin/jaunumi')
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Kļūda ielādējot rakstu')
      router.push('/admin/jaunumi')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string = formData.title) => {
    const slug = title
      .toLowerCase()
      .replace(/[ā]/g, 'a')
      .replace(/[č]/g, 'c')
      .replace(/[ē]/g, 'e')
      .replace(/[ģ]/g, 'g')
      .replace(/[ī]/g, 'i')
      .replace(/[ķ]/g, 'k')
      .replace(/[ļ]/g, 'l')
      .replace(/[ņ]/g, 'n')
      .replace(/[š]/g, 's')
      .replace(/[ū]/g, 'u')
      .replace(/[ž]/g, 'z')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')

    return slug
  }

  const handleTitleChange = (newTitle: string) => {
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: generateSlug(newTitle)
    }))
  }

  const handleSave = async (published: boolean) => {
    if (!formData.title || !formData.content) {
      toast.error('Virsraksts un saturs ir obligāti')
      return
    }

    setIsLoading(true)

    try {
      const data = {
        ...formData,
        id: post?.id,
        published,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      const response = await fetch('/api/jaunumi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Raksts atjaunināts!')
        router.push('/admin/jaunumi')
      } else {
        toast.error('Kļūda atjauninot rakstu')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Kļūda atjauninot rakstu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Vai tiešām dzēst šo rakstu?')) return

    try {
      const response = await fetch(`/api/jaunumi?id=${post?.id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Raksts dzēsts!')
        router.push('/admin/jaunumi')
      } else {
        toast.error('Kļūda dzēšot rakstu')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Kļūda dzēšot rakstu')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#706152] mb-4">Raksts nav atrasts</h1>
          <Link
            href="/admin/jaunumi"
            className="text-[#B7AB96] hover:text-[#706152]"
          >
            Atgriezties pie blog saraksta
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/jaunumi"
              className="flex items-center gap-2 text-[#B7AB96] hover:text-[#706152] transition-colors"
            >
              <ArrowLeft size={20} />
              Atpakaļ
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h3 className="text-md font-bold text-[#706152]">{post.title}</h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              <Trash2 size={16} />
              Dzēst
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white transition-colors"
            >
              <Save size={16} />
              {isLoading ? 'Saglabā...' : 'Saglabāt melnrakstu'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium bg-[#B7AB96] hover:bg-[#706152] disabled:bg-[#B7AB96]/50 text-white transition-colors"
            >
              <Eye size={16} />
              {isLoading ? 'Publicē...' : post.published ? 'Atjaunināt' : 'Publicēt'}
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-medium text-[#706152] mb-2">
                Virsraksts *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-2xl font-bold border-0 p-0 focus:outline-none focus:ring-0 text-[#706152] placeholder-gray-400"
                placeholder="Ievadiet raksta virsrakstu..."
                required
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-medium text-[#706152] mb-4">
                Saturs *
              </label>
              <div className="border border-[#B7AB96]/30 rounded-md overflow-hidden">
                <QuillEditor
                  key={post.id}
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Sāciet rakstīt blog saturu..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Same as new post */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-medium text-[#706152] mb-4">
                Galvenais attēls
              </label>
              <S3Upload
                onImageChange={(url: string | null) => setFormData(prev => ({ ...prev, image: url || '' }))}
                currentImage={formData.image}
                accept="image/*"
                folder="blog"
                label="Jaunumu raksta attēls"
              />
            </div>


            {/* URL Slug */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-medium text-[#706152] mb-2">
                URL (Slug)
              </label>
              <div className="text-xs text-gray-500 mb-2">
                {formData.slug ? `adoria.lv/blog/${formData.slug}` : 'Automātiski ģenerēts no virsraksta'}
              </div>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] text-sm"
                placeholder="raksta-url-slug"
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-medium text-[#706152] mb-2">
                Tagi
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] text-sm"
                placeholder="veselība, skaistums, padomi"
              />
              <div className="text-xs text-gray-500 mt-1">
                Atdalīti ar komatu
              </div>
            </div>

            {/* Author */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-medium text-[#706152] mb-2">
                Autors
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] text-sm"
              />
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-[#706152] mb-4">SEO iestatījumi</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Meta virsraksts
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] text-sm"
                    placeholder="SEO virsraksts"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Meta apraksts
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    rows={3}
                    className="w-full border border-[#B7AB96]/30 rounded-md px-3 py-2 focus:outline-none focus:ring-[#B7AB96] focus:border-[#B7AB96] text-sm"
                    placeholder="SEO apraksts Google meklēšanai"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
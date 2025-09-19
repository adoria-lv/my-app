'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import QuillEditor from '@/components/QuillEditor'
import S3Upload from '../../../components/ui/S3Upload'

export default function NewJaunumuPost() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    image: '',
    author: 'Adoria',
    tags: '',
    metaTitle: '',
    metaDescription: ''
  })
  const [isLoading, setIsLoading] = useState(false)

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
        published,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      const response = await fetch('/api/jaunumi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(published ? 'Raksts publicēts!' : 'Raksts saglabāts kā melnraksts!')
        router.push('/admin/jaunumi')
      } else {
        toast.error('Kļūda saglabājot rakstu')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Kļūda saglabājot rakstu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/jaunumi"
                className="flex items-center gap-2 text-[#B7AB96] hover:text-[#706152] transition-colors"
              >
                <ArrowLeft size={20} />
                Atpakaļ uz blog sarakstu
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-[#706152]">Jauns blog raksts</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave(false)}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Save size={16} />
                {isLoading ? 'Saglabā...' : 'Saglabāt melnrakstu'}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#B7AB96] hover:bg-[#706152] disabled:bg-[#B7AB96]/50 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Eye size={16} />
                {isLoading ? 'Publicē...' : 'Publicēt rakstu'}
              </button>
            </div>
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
                  key="new-post"
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Sāciet rakstīt blog saturu..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
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
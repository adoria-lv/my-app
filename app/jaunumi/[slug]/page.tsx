'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, Eye, Tag, ArrowLeft, Share2, Clock, Phone, Shield, Award, Heart } from 'lucide-react'
import Footer from '@/app/components/Footer'

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
}

export default function JaunumuPostPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [post, setPost] = useState<JaunumuPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<JaunumuPost[]>([])

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/jaunumi/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
        fetchRelatedPosts(data.tags)
      } else if (response.status === 404) {
        router.push('/blog')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      router.push('/blog')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (tags: string[]) => {
    try {
      const response = await fetch('/api/jaunumi?published=true&limit=3')
      if (response.ok) {
        const allPosts = await response.json()
        // Filter out current post and find posts with similar tags
        const related = allPosts
          .filter((p: JaunumuPost) => p.slug !== slug)
          .filter((p: JaunumuPost) => p.tags.some(tag => tags.includes(tag)))
          .slice(0, 3)

        setRelatedPosts(related)
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lv-LV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  const sharePost = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: 'Lasiet šo interesanto rakstu Adoria blogā',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Sharing failed:', error)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Saite nokopēta!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#706152] mb-4">Raksts nav atrasts</h1>
            <Link
              href="/jaunumi"
              className="inline-flex items-center gap-2 text-[#B7AB96] hover:text-[#706152] font-medium"
            >
              <ArrowLeft size={16} />
              Atgriezties pie blog saraksta
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden max-w-full">
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
              href="/jaunumi"
              className="inline-flex items-center gap-2 text-[#706152] hover:text-[##B7AB96] font-medium transition-all duration-300 hover:gap-3 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm">Atpakaļ uz jaunumiem</span>
            </Link>
          </div>

          {/* Title Section */}
          <div className="max-w-4xl">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#B7AB96]/10 text-[#706152] rounded-full text-sm font-medium border border-[#B7AB96]/20">
                <Calendar size={14} />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#706152] leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-[#706152]">
              <div className="flex items-center gap-2">
                <User size={16} className="text-[#B7AB96]" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#B7AB96]" />
                <span>{calculateReadTime(post.content)} min lasīšana</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-[#B7AB96]" />
                <span>{post.views} skatījumi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152]" />
      </div>

      <article className="max-w-[1440px] mx-auto px-2 py-8 overflow-hidden w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100/50 p-4 md:p-6 lg:p-8 overflow-hidden">
              <div
                className="prose prose-sm sm:prose md:prose-lg max-w-none mx-auto
                  [&_h1]:text-xl [&_h1]:sm:text-2xl [&_h1]:md:text-3xl [&_h1]:lg:text-4xl
                  [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:md:text-2xl [&_h2]:lg:text-3xl
                  [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:md:text-xl [&_h3]:lg:text-2xl
                  [&_h4]:text-[#5A4F42] [&_h4]:mb-2 [&_h4]:md:mb-3 [&_h4]:text-sm [&_h4]:sm:text-base [&_h4]:md:text-lg
                  [&_h5]:text-[#5A4F42] [&_h5]:mb-2 [&_h5]:text-sm [&_h5]:sm:text-base
                  [&_h6]:text-[#5A4F42] [&_h6]:mb-2 [&_h6]:text-sm
                  [&_p]:text-[#706152] [&_p]:mb-2 [&_p]:sm:mb-4 [&_p]:text-base [&_p]:sm:text-base [&_p]:md:text-lg [&_p]:leading-relaxed
                  [&_li]:text-[#706152] [&_li]:text-sm [&_li]:sm:text-base [&_li]:md:text-lg [&_li]:mt-1 [&_li]:sm:mt-2 [&_li]:mb-1 [&_li]:sm:mb-2
                  [&_strong]:text-[#706152] [&_em]:text-[#706152]
                  [&_a]:text-[#B7AB96] [&_a]:underline hover:[&_a]:text-[#706152] [&_a]:break-words
                  [&_img]:rounded-lg [&_img]:shadow-sm [&_img]:max-w-full [&_img]:h-auto
                  [&_table]:text-sm [&_table]:sm:text-base
                  [&_*]:max-w-full [&_*]:overflow-hidden [&_*]:break-words"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100/50 p-4 md:p-6 sticky top-8 h-fit">
              <h3 className="text-lg font-bold text-[#706152] mb-4">Raksta informācija</h3>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-[#706152] mb-2">Tagi</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#B7AB96]/10 text-[#706152] rounded-full text-xs font-medium border border-[#B7AB96]/20"
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={sharePost}
                  className="flex items-center gap-2 text-sm text-[#B7AB96] hover:text-[#706152] transition-colors w-full justify-start bg-[#B7AB96]/5 hover:bg-[#B7AB96]/10 px-3 py-2 rounded-lg border border-[#B7AB96]/20"
                >
                  <Share2 size={16} />
                  <span>Dalīties ar rakstu</span>
                </button>

                <Link
                  href="/jaunumi"
                  className="flex items-center gap-2 text-sm text-[#706152] hover:text-[#B7AB96] transition-colors w-full justify-start bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-200"
                >
                  <ArrowLeft size={16} />
                  <span>Visi jaunumi</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="w-full mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-[#706152] mb-8 text-center">
              Saistītie raksti
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/jaunumi/${relatedPost.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {relatedPost.image && (
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-bold text-[#706152] mb-2 line-clamp-2 group-hover:text-[#B7AB96] transition-colors">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(relatedPost.publishedAt || relatedPost.createdAt)}</span>
                        <span>{relatedPost.views} skatījumi</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

      </article>

      {/* Jaunumu Post Conclusion Section */}
      <section className="max-w-[1250px] mx-auto px-4 py-8 md:py-16 overflow-hidden w-full">
        <div className="bg-gradient-to-br from-[#B7AB96]/10 via-white to-[#706152]/5 rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-12 border border-[#B7AB96]/20 shadow-lg">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#5A4F42] mb-4 md:mb-6">
              Vai jums ir jautājumi par šo tēmu?
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-[#706152] mb-6 md:mb-8 leading-relaxed">
              Mūsu pieredzējušie speciālisti ir gatavi sniegt profesionālu konsultāciju un palīdzēt jums atrast piemērotākos risinājumus jūsu vajadzībām.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center mb-6 md:mb-8">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B7AB96] to-[#706152] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                <Phone size={18} className="sm:w-5 sm:h-5" />
                Sazinieties ar mums
              </Link>
              <Link
                href="/jaunumi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-[#B7AB96] text-[#706152] px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-[#B7AB96] hover:text-white transition-all duration-300 text-sm sm:text-base"
              >
                Vairāk rakstu
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#706152]/70">
              <div className="flex items-center gap-1 sm:gap-2">
                <Shield size={14} className="sm:w-4 sm:h-4" />
                <span>Sertificēti speciālisti</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Award size={14} className="sm:w-4 sm:h-4" />
                <span>Profesionāla pieredze</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Heart size={14} className="sm:w-4 sm:h-4" />
                <span>Individuāla pieeja</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
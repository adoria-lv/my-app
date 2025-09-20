'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Calendar, Clock, ArrowRight, BookOpen, User, ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import Image from 'next/image'
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
}


export default function JaunumuPosts() {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [blogPosts, setBlogPosts] = useState<JaunumuPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jaunumi?published=true&limit=3')
      if (!response.ok) {
        throw new Error('Neizdevās ielādēt blog rakstus')
      }
      const posts = await response.json()
      setBlogPosts(posts)
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      setError(err instanceof Error ? err.message : 'Nezināma kļūda')
    } finally {
      setLoading(false)
    }
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lv-LV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const nextSlide = () => {
    if (blogPosts.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % blogPosts.length)
    }
  }

  const prevSlide = () => {
    if (blogPosts.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + blogPosts.length) % blogPosts.length)
    }
  }

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-white to-slate-50/30 relative overflow-hidden">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="section-badge">
              <BookOpen />
              <span>Mūsu blogs</span>
            </div>
            <h2 className="section-heading">
              Veselības padomi<br className="sm:hidden" /> un jaunumi
            </h2>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-white to-slate-50/30 relative overflow-hidden">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="section-badge">
              <BookOpen />
              <span className="text-sm sm:text-base">Mūsu blogs</span>
            </div>
            <h2 className="section-heading">
              Veselības padomi<br className="sm:hidden" /> un jaunumi
            </h2>
          </div>
          <div className="text-center">
            <p className="text-[#706152] mb-4">{error}</p>
            <button
              onClick={fetchBlogPosts}
              className="px-6 py-3 bg-[#B7AB96] text-white rounded-lg hover:bg-[#706152] transition-colors"
            >
              Mēģināt vēlreiz
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (blogPosts.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-white to-slate-50/30 relative overflow-hidden">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#B7AB96]/10 text-[#706152] font-semibold mb-4 sm:mb-6">
              <BookOpen size={18} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Mūsu blogs</span>
            </div>
            <h2 className="section-heading">
              Veselības padomi<br className="sm:hidden" /> un jaunumi
            </h2>
          </div>
          <div className="text-center">
            <p className="text-[#706152]">Pagaidām nav publicētu rakstu.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-white to-slate-50/30 relative overflow-hidden">
      {/* Optimized Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-8 left-4 sm:top-16 sm:left-8 lg:top-20 lg:left-20 w-32 h-32 sm:w-48 sm:h-48 lg:w-80 lg:h-80 bg-gradient-to-br from-[#B7AB96]/8 to-[#706152]/4 rounded-full blur-2xl lg:blur-3xl animate-pulse" />
        <div className="absolute bottom-8 right-4 sm:bottom-16 sm:right-8 lg:bottom-20 lg:right-20 w-36 h-36 sm:w-56 sm:h-56 lg:w-96 lg:h-96 bg-gradient-to-tl from-[#706152]/6 to-[#B7AB96]/8 rounded-full blur-2xl lg:blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-[#B7AB96]/3 rounded-full blur-xl lg:blur-2xl" />
      </div>
      
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile-optimized Header */}
        <div className="text-center mb-6 md:mb-8">
        <div className="section-badge">
            <BookOpen />
            <span className="text-sm sm:text-base">Mūsu blogs</span>
          </div>
          <h2 className="section-heading">
            Veselības padomi<br className="sm:hidden" /> un jaunumi
          </h2>
          <p className="section-subheading">
            Sekojiet līdzi jaunākajiem rakstiem par veselību, medicīnas jaunumiem 
            un praktiskiem padomiem no mūsu speciālistiem
          </p>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex justify-center items-center gap-10 mb-6 lg:hidden">
          <button
            onClick={prevSlide}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 flex items-center justify-center text-[#706152] hover:bg-[#B7AB96] hover:text-white transition-all duration-300"
            disabled={currentSlide === 0}
          >
            <ChevronLeft size={20} />
          </button>
          
          {/* Slide Indicators */}
          <div className="flex gap-2">
            {blogPosts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={clsx(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  currentSlide === index 
                    ? "bg-[#B7AB96] w-8" 
                    : "bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 flex items-center justify-center text-[#706152] hover:bg-[#B7AB96] hover:text-white transition-all duration-300"
            disabled={currentSlide === blogPosts.length - 1}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Blog Posts Container with proper shadow spacing */}
        <div className="mb-6 md:mb-8">
          {/* Mobile: Single Card Display */}
          <div className="lg:hidden">
            {/* Add padding bottom to container to give shadow space */}
            <div className="overflow-hidden pb-8 max-w-full">
              <div
                className="flex transition-transform duration-500 ease-out max-w-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {blogPosts.map((post) => (
                  <article
                    key={post.id}
                    className="w-full flex-shrink-0 max-w-full"
                  >
                    <div className="px-3 max-w-full">
                    <Link href={`/jaunumi/${post.slug}`} className="block group">
                      {/* Add margin-bottom to give shadow breathing room */}
                      <div className="relative bg-white/90 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl hover:shadow-[#B7AB96]/15 transition-all duration-500 border border-gray-200/50 overflow-hidden mb-4">
                        
                        {/* Mobile-optimized Image */}
                        <div className="relative h-50 sm:h-50 overflow-hidden">
                          <Image
                            src={post.image || '/BlogImage.webp'}
                            alt={post.title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </div>

                        {/* Mobile-optimized Content */}
                        <div className="p-3 md:p-4">
                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-2 text-sm text-[#706152] mb-4 sm:mb-6">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                              <Calendar size={14} className="text-[#B7AB96]" />
                              <span className="font-medium">{formatDate(post.publishedAt || post.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                              <Clock size={14} className="text-[#706152]" />
                              <span className="font-medium">{calculateReadTime(post.content)}min</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-sm md:text-base font-bold text-[#706152] mb-2 group-hover:text-[#B7AB96] transition-colors duration-300 leading-tight">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-[#706152] leading-relaxed mb-3 md:mb-4 text-xs md:text-sm line-clamp-2">
                            {post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                          </p>

                          {/* Author & Read More */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-full flex items-center justify-center">
                                <User size={14} className="text-white" />
                              </div>
                              <span className="text-sm text-[#706152] font-semibold">
                                {post.author}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-[#B7AB96] font-semibold text-xs transition-all duration-300 px-2 py-1 rounded-full border border-[#B7AB96]/30 group-hover:bg-[#B7AB96] group-hover:text-white hover:shadow-md">
                              <span>Lasīt vairāk</span>
                              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Grid Layout with proper spacing */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                <Link href={`/jaunumi/${post.slug}`} className="block">
                  {/* Add margin-bottom and ensure proper shadow space */}
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl hover:shadow-[#B7AB96]/15 transition-all duration-500 transform md:hover:-translate-y-2 border border-gray-200/50 overflow-hidden h-full group-hover:bg-white mb-6">
                    
                    {/* Desktop Image */}
                    <div className="relative h-70 overflow-hidden">
                      <Image
                        src={post.image || '/BlogImage.webp'}
                        alt={post.title}
                        fill
                        className={clsx(
                          "object-cover transition-all duration-700",
                          hoveredPost === post.id && "scale-110 brightness-110"
                        )}
                      />

                    </div>

                    {/* Desktop Content */}
                    <div className="p-4 md:p-5">
                      {/* Meta Info */}
                      <div className="flex items-center gap-2 text-sm text-[#706152] mb-6 flex-wrap">
                        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full group-hover:bg-[#B7AB96]/10 transition-colors duration-300">
                          <Calendar size={14} className="text-[#B7AB96]" />
                          <span className="font-medium">{formatDate(post.publishedAt || post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full group-hover:bg-[#706152]/10 transition-colors duration-300">
                          <Clock size={14} className="text-[#706152]" />
                          <span className="font-medium">{calculateReadTime(post.content)} min</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base md:text-lg font-bold text-[#706152] mb-2 md:mb-3 group-hover:text-[#B7AB96] transition-colors duration-300 leading-tight">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm md:text-base text-[#706152] leading-relaxed mb-4 md:mb-5 line-clamp-2">
                        {post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                      </p>

                      {/* Author & Read More */}
                      <div className="flex items-center justify-between pt-4 md:pt-5 border-t border-gray-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <User size={14} className="text-white" />
                          </div>
                          <span className="text-sm text-[#706152] font-semibold">
                            {post.author}
                          </span>
                        </div>

                        <div className={clsx(
                          "flex items-center gap-1 md:gap-2 text-[#B7AB96] font-semibold text-xs md:text-sm transition-all duration-300 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-[#B7AB96]/30 group-hover:bg-[#B7AB96] group-hover:text-white hover:shadow-md",
                          hoveredPost === post.id && "gap-2 md:gap-3 scale-105"
                        )}>
                          <span>Lasīt vairāk</span>
                          <ArrowRight size={12} className="md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/jaunumi"
            className="group relative inline-flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl hover:shadow-[#B7AB96]/20 transition-all duration-300 transform md:hover:-translate-y-1 md:hover:scale-105 overflow-hidden min-h-[40px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Skatīt visus rakstus</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* CSS for line-clamp */}
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

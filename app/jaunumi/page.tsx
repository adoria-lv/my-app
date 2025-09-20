import Link from 'next/link'
import { Home } from 'lucide-react'
import JaunumuList from '@/app/components/JaunumuList'
import ScrollToTop from '@/app/components/ScrollToTop'

export const revalidate = 86400; // Reizi 24 stundās

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getPublishedPosts(): Promise<JaunumuPost[]> {
  try {
    const res = await fetch(`${SITE_URL}/api/jaunumi?published=true`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export default async function JaunumuPage() {
  const posts = await getPublishedPosts();
  
  const allTags = [...new Set(posts.flatMap(post => post.tags))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-x-hidden max-w-full">
      <ScrollToTop />
      <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-white border-b border-gray-200/50">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-[#B7AB96]/5 via-transparent to-[#706152]/5"></div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 py-16">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#706152] hover:text-[#B7AB96] font-medium transition-all duration-300 hover:gap-3 group"
            >
              <Home size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm">Sākums</span>
            </Link>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#706152] leading-tight mb-6">
              Jaunumi
            </h1>
            <p className="text-lg text-[#706152] leading-relaxed">
              Lasiet mūsu eksperta padomus par skaistumu, veselību un labsajūtu
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] overflow-hidden" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <JaunumuList initialPosts={posts} allTags={allTags} />
      </div>
    </div>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, Eye, Tag, ArrowLeft, Clock, Phone, Shield, Award, Heart } from 'lucide-react'
import Footer from '@/app/components/Footer'
import ShareButton from '@/app/components/ShareButton'
import ScrollToTop from '@/app/components/ScrollToTop'

// ---- ISR Konfigurācija ----
export const revalidate = 60;

// ---- Tipu definīcijas ----
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

// ---- Datu ielādes funkcijas (servera pusē) ----
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getPostBySlug(slug: string): Promise<JaunumuPost | null> {
  try {
    const res = await fetch(`${SITE_URL}/api/jaunumi/${slug}`, {
      cache: 'no-store' 
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch post. Status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

async function getRelatedPosts(tags: string[], currentSlug: string): Promise<JaunumuPost[]> {
  try {
    const res = await fetch(`${SITE_URL}/api/jaunumi?published=true&limit=6`, { cache: 'no-store' });
    if (!res.ok) return [];

    const allPosts: JaunumuPost[] = await res.json();
    return allPosts
      .filter(p => p.slug !== currentSlug && p.tags.some(tag => tags.includes(tag)))
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

// ---- Statisko ceļu ģenerēšana būvēšanas laikā ----
export async function generateStaticParams() {
  try {
    const res = await fetch(`${SITE_URL}/api/jaunumi?published=true`);
    const posts: JaunumuPost[] = await res.json();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

// ---- Palīgfunkcijas ----
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('lv-LV', { year: 'numeric', month: 'long', day: 'numeric' });
}

const calculateReadTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

// ---- Lapas komponente (atjaunota, lai strādātu ar asinhroniem params) ----
export default async function JaunumuPostPage({ params }: { params: { slug: string } }) {
  // LABOJUMS: sagaidām `params` Promise atrisināšanu, pirms piekļūstam tā īpašībām.
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound(); 
  }

  const relatedPosts = await getRelatedPosts(post.tags, post.slug);

  return (
    <div className="min-h-screen overflow-x-hidden max-w-full">
      <ScrollToTop />
      {/* Hero/Breadcrumb Section */}
      <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-white border-b border-gray-200/50">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-[#B7AB96]/5 via-transparent to-[#706152]/5"></div>
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 py-16">
          <div className="mb-8">
            <Link href="/jaunumi" className="inline-flex items-center gap-2 text-[#706152] hover:text-[##B7AB96] font-medium transition-all duration-300 hover:gap-3 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm">Atpakaļ uz jaunumiem</span>
            </Link>
          </div>
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
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152]" />
      </div>

      <article className="max-w-[1440px] mx-auto px-2 py-8 overflow-x-hidden w-full">
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
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100/50 p-4 md:p-6 sticky top-8 h-fit">
              <h3 className="text-lg font-bold text-[#706152] mb-4">Raksta informācija</h3>
              {post.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-[#706152] mb-2">Tagi</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-[#B7AB96]/10 text-[#706152] rounded-full text-xs font-medium border border-[#B7AB96]/20">
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <ShareButton title={post.title} />
                <Link href="/jaunumi" className="flex items-center gap-2 text-sm text-[#706152] hover:text-[#B7AB96] transition-colors w-full justify-start bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                  <ArrowLeft size={16} />
                  <span>Visi jaunumi</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="w-full mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-[#706152] mb-8 text-center">Saistītie raksti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/jaunumi/${relatedPost.slug}`} className="group">
                  <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {relatedPost.image && (
                      <div className="relative overflow-hidden h-48">
                        <img src={relatedPost.image} alt={relatedPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-bold text-[#706152] mb-2 line-clamp-2 group-hover:text-[#B7AB96] transition-colors">{relatedPost.title}</h3>
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
              <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B7AB96] to-[#706152] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                <Phone size={18} className="sm:w-5 sm:h-5" />
                Sazinieties ar mums
              </Link>
              <Link href="/jaunumi" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-[#B7AB96] text-[#706152] px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-[#B7AB96] hover:text-white transition-all duration-300 text-sm sm:text-base">
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

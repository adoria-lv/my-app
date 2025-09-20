'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, User, Eye, Tag, Search } from 'lucide-react'

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

interface JaunumuListProps {
  initialPosts: JaunumuPost[];
  allTags: string[];
}

export default function JaunumuList({ initialPosts, allTags }: JaunumuListProps) {
  const [posts] = useState<JaunumuPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lv-LV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(post.content).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <>
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

        {allTags.length > 0 && (
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
            {allTags.map((tag) => (
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
            <Link
              key={post.id}
              href={`/jaunumi/${post.slug}`}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group block"
            >
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
                <h2 className="jaunumi-heading">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div className="text-center mt-12">
          <div className="text-sm text-gray-500">
            Rāda {filteredPosts.length} no {posts.length} rakstiem
          </div>
        </div>
      )}
    </>
  );
}

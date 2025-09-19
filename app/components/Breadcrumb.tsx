'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <Link 
        href="/"
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-gray-500 hover:text-[#B7AB96] hover:bg-[#B7AB96]/5 transition-all duration-200 group"
      >
        <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
        <span className="sr-only">Sākums</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="px-2 py-1 rounded-lg text-gray-600 hover:text-[#B7AB96] hover:bg-[#B7AB96]/5 transition-all duration-200 font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="px-2 py-1 text-[#706152] font-semibold cursor-default">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
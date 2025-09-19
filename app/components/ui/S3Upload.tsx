'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

interface S3UploadProps {
  currentImage?: string
  onImageChange: (url: string | null) => void
  folder?: string
  accept?: string
  className?: string
  label?: string
}

export default function S3Upload({
  currentImage,
  onImageChange,
  folder = 'slider',
  accept = 'image/*',
  className = '',
  label = 'Augšupielādēt attēlu'
}: S3UploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Lūdzu, izvēlieties attēlu')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Attēla izmērs nedrīkst pārsniegt 5MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onImageChange(data.url)
        toast.success('Attēls veiksmīgi augšupielādēts')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Kļūda augšupielādējot attēlu')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const removeImage = () => {
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-[#706152] mb-2">
        {label}
      </label>

      {currentImage ? (
        <div className="relative group">
          <div className={`relative w-full rounded-lg overflow-hidden border-2 border-[#B7AB96]/30 ${className.includes('h-32') ? 'h-32' : 'h-48'}`}>
            <Image
              src={currentImage}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={removeImage}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg transition-all duration-200 ${
            className.includes('h-32') ? 'p-4 h-32' : 'p-6'
          } ${
            dragActive
              ? 'border-[#B7AB96] bg-[#B7AB96]/10'
              : 'border-[#B7AB96]/30 hover:border-[#B7AB96]/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
        >
          <div className="text-center">
            <div className={`mx-auto text-[#B7AB96] ${className.includes('h-32') ? 'h-8 w-8 mb-2' : 'h-12 w-12 mb-4'}`}>
              {uploading ? (
                <div className={`animate-spin rounded-full border-2 border-[#B7AB96]/30 border-t-[#B7AB96] ${className.includes('h-32') ? 'h-8 w-8' : 'h-12 w-12'}`}></div>
              ) : (
                <ImageIcon className={className.includes('h-32') ? 'h-8 w-8' : 'h-12 w-12'} />
              )}
            </div>
            <div className={`text-[#706152] ${className.includes('h-32') ? 'text-xs mb-1' : 'text-sm mb-2'}`}>
              {uploading ? 'Augšupielādē...' : (className.includes('h-32') ? 'Ievelciet vai' : 'Ievelciet attēlu šeit vai')}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`inline-flex items-center gap-2 bg-[#B7AB96] hover:bg-[#706152] disabled:opacity-50 text-white font-medium rounded-md transition-colors ${
                className.includes('h-32') ? 'py-1 px-2 text-xs' : 'py-2 px-4'
              }`}
            >
              <Upload size={className.includes('h-32') ? 12 : 16} />
              {className.includes('h-32') ? 'Izvēlēties' : 'Izvēlēties failu'}
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {!className.includes('h-32') && (
        <p className="text-xs text-[#706152]/60">
          Maksimālais izmērs: 5MB. Atbalstītie formāti: JPG, PNG, WebP
        </p>
      )}
    </div>
  )
}

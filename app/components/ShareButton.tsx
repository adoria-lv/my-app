'use client'

import { Share2 } from 'lucide-react'

export default function ShareButton({ title }: { title: string }) {
  const sharePost = async () => {
    // Pārbaudām, vai pārlūks atbalsta Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Lasiet šo interesanto rakstu Adoria blogā',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Dalīšanās neizdevās:', error)
      }
    } else {
      // Rezerves variants vecākiem pārlūkiem - nokopēt saiti
      navigator.clipboard.writeText(window.location.href)
      alert('Saite nokopēta starpliktuvē!')
    }
  }

  return (
    <button
      onClick={sharePost}
      className="flex items-center gap-2 text-sm text-[#B7AB96] hover:text-[#706152] transition-colors w-full justify-start bg-[#B7AB96]/5 hover:bg-[#B7AB96]/10 px-3 py-2 rounded-lg border border-[#B7AB96]/20"
    >
      <Share2 size={16} />
      <span>Dalīties ar rakstu</span>
    </button>
  )
}

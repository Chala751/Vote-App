'use client'

import { useRouter } from 'next/navigation'
import { Home } from 'lucide-react'

export default function BackToHomeButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/')}
      className="mt-8 flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 cursor-pointer"
    >
      <Home className="w-5 h-5" />
      Back to Home
    </button>
  )
}

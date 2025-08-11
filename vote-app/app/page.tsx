'use client'

import { useRouter } from 'next/navigation'
import VoteCard from '@/components/VoteCard'
import Link from 'next/link'
import { UserCog } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black relative px-4 sm:px-8">
      {/* Admin Link */}
      <Link
        href="/admin"
        className="absolute top-4 right-4 flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors text-sm sm:text-base"
        aria-label="Go to Admin Dashboard"
      >
        <UserCog className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="font-semibold">Admin</span>
      </Link>

      {/* Main VoteCard component */}
      <div className="w-full max-w-lg sm:max-w-3xl">
        <VoteCard />
      </div>

      {/* See Full Results Button */}
      <button
        onClick={() => router.push('/results')}
        className="mt-6 sm:mt-8 px-5 py-3 sm:px-6 sm:py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center cursor-pointer w-full max-w-xs sm:max-w-sm"
        aria-label="See Full Results"
      >
        See Full Results
      </button>
    </main>
  )
}

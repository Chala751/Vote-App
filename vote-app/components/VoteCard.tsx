'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'  // import useRouter

export default function VoteCard() {
  const [voted, setVoted] = useState(false)
  const [results, setResults] = useState<{ Ronaldo: number; Messi: number }>({
    Ronaldo: 0,
    Messi: 0,
  })

  const router = useRouter()  // initialize router

  const fetchResults = async () => {
    try {
      const res = await axios.get('/api/vote')
      const data = res.data.reduce(
        (acc: any, item: any) => {
          acc[item._id] = item.count
          return acc
        },
        { Ronaldo: 0, Messi: 0 }
      )
      setResults(data)
    } catch {
      console.error('Failed to fetch results')
    }
  }

  const vote = async (player: string) => {
    try {
      await axios.post('/api/vote', { player })
      setVoted(true)
      toast.success('✅ Thanks for voting!')

      // Redirect to results page after a short delay (to show toast)
      setTimeout(() => {
        router.push('/results')  // change to your results page route
      }, 1500)

    } catch (err: any) {
      toast.error(err.response?.data?.message || '❌ Error while voting')
    }
  }

  useEffect(() => {
    if (voted) fetchResults()
  }, [voted])

  return (
    <div className="max-w-5xl mx-auto text-center space-y-8 p-6">
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white drop-shadow-lg">
        Who is the <span className="text-yellow-500">GOAT</span>?
      </h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
        Cast your vote for your favorite player! You can only vote once.
      </p>

      {!voted ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ronaldo Card */}
          <div
            onClick={() => vote('Ronaldo')}
            className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-blue-500/50 transition-transform duration-300 border-2 border-transparent hover:border-blue-400"
          >
            <div className="flex flex-col items-center p-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg"
                alt="Cristiano Ronaldo"
                className="w-40 h-40 object-cover rounded-full border-4 border-blue-400 shadow-md"
              />
              <h2 className="mt-4 text-2xl font-bold text-blue-600">Cristiano Ronaldo</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Explosive speed, aerial dominance, and relentless goal-scoring.
              </p>
              <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg cursor-pointer">
                Vote Ronaldo
              </button>
            </div>
          </div>

          {/* Messi Card */}
          <div
            onClick={() => vote('Messi')}
            className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-red-500/50 transition-transform duration-300 border-2 border-transparent hover:border-red-400"
          >
            <div className="flex flex-col items-center p-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Lionel_Messi_20180626.jpg"
                alt="Lionel Messi"
                className="w-40 h-40 object-cover rounded-full border-4 border-red-400 shadow-md"
              />
              <h2 className="mt-4 text-2xl font-bold text-red-600">Lionel Messi</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Magical dribbles, pinpoint passing, and record-breaking vision.
              </p>
              <button className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg cursor-pointer">
                Vote Messi
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center gap-8 text-lg font-bold">
            <div className="flex flex-col items-center">
              <span className="text-blue-600">Ronaldo</span>
              <span>{results.Ronaldo} votes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-red-600">Messi</span>
              <span>{results.Messi} votes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

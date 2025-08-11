'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Vote {
  _id: string
  player: string
  ip: string
  createdAt: string
}

export default function AdminDashboard() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || ''

  // Fetch votes
  const fetchVotes = async () => {
    try {
      const res = await axios.get('/api/admin/votes', {
        headers: { 'x-admin-secret': ADMIN_SECRET },
      })
      setVotes(res.data)
    } catch (error) {
      toast.error('Failed to fetch votes or unauthorized')
    } finally {
      setLoading(false)
    }
  }

  // Delete vote by ID
  const deleteVote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vote?')) return

    try {
      await axios.delete(`/api/admin/votes?id=${id}`, {
        headers: { 'x-admin-secret': ADMIN_SECRET },
      })
      toast.success('Vote deleted')
      fetchVotes()
    } catch {
      toast.error('Failed to delete vote')
    }
  }

  useEffect(() => {
    fetchVotes()
  }, [])

  // Calculate ranking
  const tally = votes.reduce(
    (acc, v) => {
      acc[v.player] = (acc[v.player] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const winner = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]

  return (
    <main className="p-6 max-w-full mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Back to Home Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white drop-shadow-md">
        Admin Dashboard - Votes
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
      ) : (
        <>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Current Winner:
            </h2>
            <p
              className="mt-2 inline-block px-4 py-1 rounded-full text-white font-semibold text-lg
              bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 shadow-lg"
            >
              {winner ? `${winner[0]} (${winner[1]} votes)` : 'No votes yet'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="text-left py-3 px-5 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Voter IP
                  </th>
                  <th className="text-left py-3 px-5 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="text-left py-3 px-5 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Voted At
                  </th>
                  <th className="text-center py-3 px-5 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {votes.map((vote) => (
                  <tr
                    key={vote._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="py-4 px-5 text-sm text-gray-800 dark:text-gray-300 font-mono">
                      {vote.ip}
                    </td>

                    <td className="py-4 px-5 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-white font-semibold ${
                          vote.player === 'Ronaldo' ? 'bg-blue-600' : 'bg-red-600'
                        }`}
                      >
                        {vote.player}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(vote.createdAt).toLocaleString()}
                    </td>

                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => deleteVote(vote._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 cursor-pointer"
                        aria-label={`Delete vote by ${vote.ip}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {votes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-600 dark:text-gray-400">
                      No votes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  )
}

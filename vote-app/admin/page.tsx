'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Vote {
  _id: string
  player: string
  voterId: string
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
    try {
      await axios.delete(`/api/admin/votes/${id}`, {
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
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Votes</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2 className="mb-4 text-xl">
            Current Winner:{' '}
            <span className="font-semibold">
              {winner ? `${winner[0]} (${winner[1]} votes)` : 'No votes yet'}
            </span>
          </h2>

          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr>
                <th className="border border-gray-300 dark:border-gray-600 p-2">Voter ID</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2">Player</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2">Voted At</th>
                <th className="border border-gray-300 dark:border-gray-600 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((vote) => (
                <tr key={vote._id}>
                  <td className="border border-gray-300 dark:border-gray-600 p-2">{vote.voterId}</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-2">{vote.player}</td>
                  <td className="border border-gray-300 dark:border-gray-600 p-2">
                    {new Date(vote.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => deleteVote(vote._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {votes.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    No votes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </main>
  )
}

'use client'

import { useState } from 'react'
import axios from 'axios'

export default function VoteCard() {
  const [voted, setVoted] = useState(false)
  const [message, setMessage] = useState('')

  const vote = async (player: string) => {
    try {
      const res = await axios.post('/api/vote', { player })
      setVoted(true)
      setMessage('Thanks for voting!')
    } catch (err: any) {
      setMessage(err.response.data.message || 'Error')
    }
  }

  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold">Who is the GOAT?</h1>
      {!voted ? (
        <div className="flex justify-center space-x-4">
          <button onClick={() => vote('Ronaldo')} className="bg-blue-500 text-white px-6 py-2 rounded">Ronaldo</button>
          <button onClick={() => vote('Messi')} className="bg-red-500 text-white px-6 py-2 rounded">Messi</button>
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  )
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/db'
import Vote from '@/models/Vote'

const ADMIN_SECRET = process.env.ADMIN_SECRET

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple admin auth check
  const adminKey = req.headers['x-admin-secret']
  if (adminKey !== ADMIN_SECRET) {
    return res.status(403).json({ message: 'Forbidden: Admin only' })
  }

  await connectDB()

  if (req.method === 'GET') {
    // Return all votes with voter info
    const votes = await Vote.find({}, { voterId: 1, player: 1, createdAt: 1 }).lean()
    return res.status(200).json(votes)
  } else {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }
}

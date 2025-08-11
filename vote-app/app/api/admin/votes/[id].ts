import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/db'
import Vote from '@/models/Vote'

const ADMIN_SECRET = process.env.ADMIN_SECRET

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminKey = req.headers['x-admin-secret']
  if (adminKey !== ADMIN_SECRET) {
    return res.status(403).json({ message: 'Forbidden: Admin only' })
  }

  await connectDB()

  const { id } = req.query

  if (req.method === 'DELETE') {
    await Vote.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Vote deleted' })
  } else {
    res.setHeader('Allow', 'DELETE')
    return res.status(405).end('Method Not Allowed')
  }
}

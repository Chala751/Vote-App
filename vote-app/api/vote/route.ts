import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Vote from '@/models/Vote'

export async function POST(req: NextRequest) {
  await connectDB()
  const { player } = await req.json()
  const ip = req.headers.get('x-forwarded-for') || 'unknown'

  try {
    const existing = await Vote.findOne({ ip })
    if (existing) {
      return NextResponse.json({ message: 'Already voted' }, { status: 403 })
    }

    const vote = await Vote.create({ player, ip })
    return NextResponse.json({ vote }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ message: 'Error voting' }, { status: 500 })
  }
}

export async function GET() {
  await connectDB()
  const votes = await Vote.aggregate([
    { $group: { _id: '$player', count: { $sum: 1 } } },
  ])
  return NextResponse.json(votes)
}

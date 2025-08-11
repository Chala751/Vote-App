// app/api/admin/votes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Vote from '@/models/Vote'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''

export async function GET(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-secret')
  if (adminKey !== ADMIN_SECRET) {
    return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 })
  }

  await connectDB()
  const votes = await Vote.find({}, { ip: 1, player: 1, createdAt: 1 }).lean()
  return NextResponse.json(votes)
}

export async function DELETE(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-secret')
  if (adminKey !== ADMIN_SECRET) {
    return NextResponse.json({ message: 'Forbidden: Admin only' }, { status: 403 })
  }

  await connectDB()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ message: 'Missing id' }, { status: 400 })
  }

  await Vote.findByIdAndDelete(id)
  return NextResponse.json({ message: 'Vote deleted' })
}

import { connectDB } from '@/lib/db'
import Vote from '@/models/Vote'

export default async function ResultsPage() {
  await connectDB()
  const results = await Vote.aggregate([
    { $group: { _id: '$player', count: { $sum: 1 } } },
  ])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold">Vote Results</h1>
      {results.map((r: any) => (
        <div key={r._id} className="text-xl">
          {r._id}: {r.count} votes
        </div>
      ))}
    </main>
  )
}

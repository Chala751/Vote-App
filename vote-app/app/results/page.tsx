import { connectDB } from '@/lib/db'
import Vote from '@/models/Vote'

export default async function ResultsPage() {
  await connectDB()
  const results = await Vote.aggregate([
    { $group: { _id: '$player', count: { $sum: 1 } } },
  ])

  const totalVotes = results.reduce((sum, r) => sum + r.count, 0)

  const colors: Record<string, string> = {
    Ronaldo: 'bg-blue-500',
    Messi: 'bg-red-500',
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white drop-shadow-lg">
          🏆 Vote Results
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300">
          Total Votes: <span className="font-bold">{totalVotes}</span>
        </p>

        {results.map((r: any) => {
          const percentage = totalVotes ? (r.count / totalVotes) * 100 : 0
          return (
            <div key={r._id} className="space-y-2">
              <div className="flex justify-between text-lg font-semibold">
                <span className={r._id === 'Ronaldo' ? 'text-blue-600' : 'text-red-600'}>
                  {r._id}
                </span>
                <span>{r.count} votes</span>
              </div>
              <div className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`${colors[r._id]} h-full transition-all duration-700`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

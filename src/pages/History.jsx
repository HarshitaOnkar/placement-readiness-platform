import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getHistory } from '@/lib/storage'
import { useState, useEffect } from 'react'
import { History as HistoryIcon } from 'lucide-react'

export default function History() {
  const [list, setList] = useState([])
  const [skippedCount, setSkippedCount] = useState(0)
  useEffect(() => {
    const { list: historyList, skippedCount: skipped } = getHistory()
    setList(historyList)
    setSkippedCount(skipped)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">History</h2>
        <p className="text-gray-600 text-sm">
          Past analyses. Click an entry to view full results.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-primary" />
            Saved analyses
          </CardTitle>
          <CardDescription>
            Stored in this browser. Persists after refresh.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skippedCount > 0 && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
              One saved entry couldn&apos;t be loaded. Create a new analysis.
            </p>
          )}
          {list.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">
              No analyses yet. Go to Analyze to paste a JD and run your first analysis.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {list.map((entry) => (
                <li key={entry.id}>
                  <Link
                    to={`/dashboard/results?id=${entry.id}`}
                    className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {entry.company || 'No company'} · {entry.role || 'No role'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {entry.createdAt
                          ? new Date(entry.createdAt).toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : '—'}
                      </p>
                    </div>
                    <span className="flex-shrink-0 ml-4 text-lg font-semibold text-primary">
                      {entry.finalScore ?? '—'}/100
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

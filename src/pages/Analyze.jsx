import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { runAnalysis } from '@/lib/analyze'
import { saveEntry } from '@/lib/storage'
import { buildEntryFromAnalysis } from '@/lib/entrySchema'
import { FileText } from 'lucide-react'

const JD_MIN_LENGTH = 200

export default function Analyze() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const jdShort = jdText.trim().length > 0 && jdText.trim().length < JD_MIN_LENGTH

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!jdText.trim()) {
      setError('Please paste the job description text.')
      return
    }
    setLoading(true)
    try {
      const result = runAnalysis({ company: company.trim(), role: role.trim(), jdText: jdText.trim() })
      const entry = buildEntryFromAnalysis(result, company.trim(), role.trim(), jdText.trim())
      const id = saveEntry(entry)
      if (id) navigate(`/dashboard/results?id=${id}`)
      else setError('Could not save analysis.')
    } catch (err) {
      setError(err?.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Analyze JD</h2>
        <p className="text-gray-600 text-sm">
          Paste a job description to extract skills, get a checklist, 7-day plan, and likely questions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Job description
          </CardTitle>
          <CardDescription>
            Optional: add company and role for a better readiness score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Tech Corp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. SDE 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label htmlFor="jd" className="block text-sm font-medium text-gray-700 mb-1">
                Job description text <span className="text-primary">*</span>
              </label>
              <textarea
                id="jd"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-y"
                required
              />
              {jdShort && (
                <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  This JD is too short to analyze deeply. Paste full JD for better output.
                </p>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors disabled:opacity-60"
            >
              {loading ? 'Analyzing…' : 'Analyze'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

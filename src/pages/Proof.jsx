import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  getProofSubmission,
  setProofSubmission,
  setStepCompleted,
  setLink,
  isValidUrl,
  isShipped,
  TOTAL_STEPS,
} from '@/lib/proofStorage.js'
import { Copy, CheckCircle, Circle, AlertCircle } from 'lucide-react'

const STEP_LABELS = [
  'Step 1: Landing page',
  'Step 2: Dashboard & navigation',
  'Step 3: JD analysis (Analyze + extraction)',
  'Step 4: Results (skills, score, toggles, export)',
  'Step 5: History & persistence',
  'Step 6: Company Intel & Round mapping',
  'Step 7: Test checklist (all 10 passed)',
  'Step 8: Proof artifacts (all 3 links)',
]

const LINK_KEYS = [
  { key: 'lovableProjectLink', label: 'Lovable Project Link', placeholder: 'https://…' },
  { key: 'githubRepoLink', label: 'GitHub Repository Link', placeholder: 'https://github.com/…' },
  { key: 'deployedUrl', label: 'Deployed URL', placeholder: 'https://…' },
]

function buildSubmissionText(data) {
  return `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${data.lovableProjectLink || '—'}
GitHub Repository: ${data.githubRepoLink || '—'}
Live Deployment: ${data.deployedUrl || '—'}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`
}

export default function Proof() {
  const [data, setData] = useState(() => getProofSubmission())
  const [copyDone, setCopyDone] = useState(false)

  useEffect(() => {
    setData(getProofSubmission())
  }, [])

  const handleStepToggle = useCallback((index) => {
    const next = getProofSubmission()
    next.stepCompleted[index] = !next.stepCompleted[index]
    setProofSubmission(next)
    setData(getProofSubmission())
  }, [])

  const handleLinkChange = useCallback((key, value) => {
    setLink(key, value)
    setData(getProofSubmission())
  }, [])

  const handleCopy = useCallback(async () => {
    const current = getProofSubmission()
    const text = buildSubmissionText(current)
    try {
      await navigator.clipboard.writeText(text)
      setCopyDone(true)
      setTimeout(() => setCopyDone(false), 2500)
    } catch {
      setCopyDone(false)
    }
  }, [])

  const shipped = isShipped()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Status badge */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-sm font-medium text-gray-500">Project status</span>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  shipped
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {shipped ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Shipped
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" /> In Progress
                  </>
                )}
              </span>
            </div>
            {shipped && (
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-gray-800 font-medium leading-relaxed">
                  You built a real product.
                </p>
                <p className="text-gray-800 font-medium leading-relaxed mt-1">
                  Not a tutorial. Not a clone.
                </p>
                <p className="text-gray-800 font-medium leading-relaxed mt-1">
                  A structured tool that solves a real problem.
                </p>
                <p className="text-gray-700 mt-2">
                  This is your proof of work.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* A) Step Completion Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step completion overview</CardTitle>
            <CardDescription>
              Mark each step when complete. All 8 must be completed for Shipped status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {STEP_LABELS.map((label, index) => (
                <li key={index} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStepToggle(index)}
                    className="flex items-center gap-2 text-left w-full rounded-lg py-2 px-2 -mx-2 hover:bg-gray-50"
                  >
                    {data.stepCompleted[index] ? (
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={data.stepCompleted[index] ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                      {label}
                    </span>
                  </button>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {data.stepCompleted[index] ? 'Completed' : 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* B) Artifact Inputs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Artifact inputs (required for Ship status)</CardTitle>
            <CardDescription>
              Provide valid URLs. All three are required for Shipped status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {LINK_KEYS.map(({ key, label, placeholder }) => {
              const value = data[key] ?? ''
              const valid = !value || isValidUrl(value)
              return (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    id={key}
                    type="url"
                    value={value}
                    onChange={(e) => handleLinkChange(key, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                      valid ? 'border-gray-300' : 'border-red-400 bg-red-50'
                    }`}
                  />
                  {!valid && value && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Enter a valid http or https URL.
                    </p>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Copy Final Submission */}
        <Card>
          <CardHeader>
            <CardTitle>Final submission export</CardTitle>
            <CardDescription>
              Copy the formatted block for submission. Uses your saved links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover"
            >
              <Copy className="w-4 h-4" /> Copy Final Submission
            </button>
            {copyDone && (
              <span className="ml-3 text-sm text-primary">Copied to clipboard.</span>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

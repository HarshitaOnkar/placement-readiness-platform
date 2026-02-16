import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '../../components/ui/ShadcnCard';
import { runAnalysis } from '../../lib/analysis';
import { saveEntry } from '../../lib/history';

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jdText, setJdText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = runAnalysis(company, role, jdText);
      const id = saveEntry(result);
      navigate(`/dashboard/results?id=${encodeURIComponent(id)}`, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Analyze Job Description</h2>
        <p className="mt-1 text-slate-600">
          Paste a JD to extract skills, get a readiness score, and a tailored prep plan.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job details</CardTitle>
            <CardDescription>Optional but improve score and plan relevance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">
                Company
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Tech Corp"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
                Role
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. SDE Intern"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="jd" className="block text-sm font-medium text-slate-700 mb-1">
                Job description <span className="text-slate-500">(paste full text)</span> <span className="text-slate-400">*</span>
              </label>
              <textarea
                id="jd"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={12}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y min-h-[200px]"
                required
              />
              {jdText.length > 0 && jdText.length < 200 && (
                <p className="mt-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2" role="status">
                  This JD is too short to analyze deeply. Paste full JD for better output.
                </p>
              )}
              <p className="mt-1 text-xs text-slate-500">Longer JDs (800+ chars) add +10 to your readiness score.</p>
            </div>
          </CardContent>
          <CardFooter>
            <button
              type="submit"
              disabled={!jdText.trim() || isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? 'Analyzing…' : 'Analyze'}
            </button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

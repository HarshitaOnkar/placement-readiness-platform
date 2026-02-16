import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '../../components/ui/ShadcnCard';
import { getHistory } from '../../lib/history';

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return iso;
  }
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { entries, skippedCount } = getHistory();
  const score = (entry) => entry.finalScore ?? entry.baseScore ?? entry.readinessScore ?? 0;

  const openResult = (id) => {
    navigate(`/dashboard/results?id=${encodeURIComponent(id)}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Analysis history</h2>
        <p className="mt-1 text-slate-600">Open a past analysis to view skills, plan, and questions.</p>
      </div>

      {skippedCount > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
          One saved entry couldn&apos;t be loaded. Create a new analysis.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Saved analyses</CardTitle>
          <CardDescription>Click a row to open that result on the Results page.</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-slate-500 py-8 text-center">No analyses yet. Run one from the Analyze page.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => openResult(entry.id)}
                    className="w-full text-left py-4 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors flex flex-wrap items-center gap-x-4 gap-y-1"
                  >
                    <span className="text-sm text-slate-500 shrink-0">{formatDate(entry.createdAt)}</span>
                    <span className="font-medium text-slate-900">
                      {entry.company || '—'}
                    </span>
                    <span className="text-slate-600">
                      {entry.role || '—'}
                    </span>
                    <span
                      className="ml-auto shrink-0 inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary"
                      aria-label={`Score ${score(entry)}`}
                    >
                      {score(entry)}/100
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

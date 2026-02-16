import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '../../components/ui/ShadcnCard';
import {
  getChecklist,
  setChecklistItem,
  isChecklistComplete,
  resetChecklist,
  TEST_ITEMS,
} from '../../lib/testChecklist';

const TOTAL = 10;

export default function TestChecklistPage() {
  const [checklist, setChecklistState] = useState(getChecklist);

  const refresh = useCallback(() => {
    setChecklistState(getChecklist());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const passed = Object.values(checklist).filter(Boolean).length;
  const allPassed = passed === TOTAL;

  const handleToggle = (id, checked) => {
    setChecklistItem(id, checked);
    setChecklistState(getChecklist());
  };

  const handleReset = () => {
    resetChecklist();
    setChecklistState(getChecklist());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Test checklist</h1>
          <p className="mt-1 text-slate-600">Verify core behaviour before shipping. All 10 must pass to unlock Ship.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tests Passed: {passed} / {TOTAL}</CardTitle>
            <CardDescription>
              {allPassed
                ? 'All tests passed. You can proceed to Ship.'
                : 'Complete each item after verifying the behaviour.'}
            </CardDescription>
          </CardHeader>
          {!allPassed && (
            <CardContent className="pt-0">
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Fix issues before shipping.
              </p>
            </CardContent>
          )}
          <CardFooter className="flex flex-wrap gap-2">
            <Link
              to="/prp/08-ship"
              className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium ${
                allPassed
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed pointer-events-none'
              }`}
              aria-disabled={!allPassed}
            >
              Go to Ship
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reset checklist
            </button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist</CardTitle>
            <CardDescription>Check each item after you have verified it.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {TEST_ITEMS.map(({ id, label, hint }) => (
                <li key={id} className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    id={`check-${id}`}
                    checked={checklist[id] === true}
                    onChange={(e) => handleToggle(id, e.target.checked)}
                    className="mt-1 w-4 h-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary"
                    aria-describedby={hint ? `${id}-hint` : undefined}
                  />
                  <div className="min-w-0">
                    <label htmlFor={`check-${id}`} className="font-medium text-slate-900 cursor-pointer">
                      {label}
                    </label>
                    {hint && (
                      <p id={`${id}-hint`} className="mt-1 text-sm text-slate-500">
                        How to test: {hint}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <p className="mt-6 text-sm text-slate-500">
          <Link to="/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
        </p>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '../../components/ui/ShadcnCard';
import { isChecklistComplete } from '../../lib/testChecklist';
import { isShipped } from '../../lib/proofSubmission';

export default function ShipPage() {
  const unlocked = isChecklistComplete();
  const shipped = isShipped();

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-xl mx-auto px-6 py-10">
          <Card className="border-slate-300">
            <CardHeader>
              <CardTitle className="text-slate-900">Ship locked</CardTitle>
              <CardDescription>
                Complete all 10 items on the Test checklist before shipping.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-4">
                Go to the Test checklist, verify each item, and check it off. When all 10 tests are passed, this page will unlock.
              </p>
              <Link
                to="/prp/07-test"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Open Test checklist
              </Link>
            </CardContent>
          </Card>
          <p className="mt-6 text-sm text-slate-500">
            <Link to="/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-6 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">
              Status: {shipped ? 'Shipped' : 'Ready to ship'}
            </CardTitle>
            <CardDescription>
              {shipped
                ? 'All conditions met: 8 steps, test checklist, and proof links.'
                : 'All tests passed. Complete Proof (8 steps + 3 links) for Shipped status.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!shipped && (
              <p className="text-slate-600 text-sm">
                You have verified JD validation, skills extraction, round mapping, score behaviour, persistence, history, export, and console hygiene. Go to Proof to complete steps and add artifact links.
              </p>
            )}
            {shipped && (
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-center">
                <p className="text-slate-800 font-medium">You built a real product.</p>
                <p className="text-slate-600 mt-1">Not a tutorial. Not a clone.</p>
                <p className="text-slate-600">A structured tool that solves a real problem.</p>
                <p className="text-slate-800 font-medium mt-2">This is your proof of work.</p>
              </div>
            )}
          </CardContent>
        </Card>
        <p className="mt-6 text-sm text-slate-500">
          <Link to="/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
          {' · '}
          <Link to="/prp/07-test" className="text-primary hover:underline">Test checklist</Link>
          {' · '}
          <Link to="/prp/proof" className="text-primary hover:underline">Proof</Link>
        </p>
      </div>
    </div>
  );
}

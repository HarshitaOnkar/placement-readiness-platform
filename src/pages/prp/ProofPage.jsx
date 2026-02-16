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
  getStepCompletion,
  setStepCompletion,
  getSubmission,
  setSubmission,
  validateUrl,
  hasValidProofLinks,
  isShipped,
  buildFinalSubmissionText,
  PROOF_STEPS,
} from '../../lib/proofSubmission';

export default function ProofPage() {
  const [steps, setStepsState] = useState(getStepCompletion);
  const [links, setLinks] = useState(getSubmission);
  const [touched, setTouched] = useState({ lovableUrl: false, githubUrl: false, deployedUrl: false });
  const [copyDone, setCopyDone] = useState(false);

  const refresh = useCallback(() => {
    setStepsState(getStepCompletion());
    setLinks(getSubmission());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const shipped = isShipped();

  const handleStepToggle = (stepId, completed) => {
    setStepCompletion(stepId, completed);
    setStepsState(getStepCompletion());
  };

  const handleLinkChange = (field, value) => {
    const next = { ...links, [field]: value };
    setLinks(next);
    setSubmission(next);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const lovableValid = validateUrl(links.lovableUrl);
  const githubValid = validateUrl(links.githubUrl);
  const deployedValid = validateUrl(links.deployedUrl);
  const showLovableError = touched.lovableUrl && links.lovableUrl.trim() && !lovableValid;
  const showGithubError = touched.githubUrl && links.githubUrl.trim() && !githubValid;
  const showDeployedError = touched.deployedUrl && links.deployedUrl.trim() && !deployedValid;

  const handleCopyFinalSubmission = async () => {
    const text = buildFinalSubmissionText();
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Proof & submission</h1>
          <p className="mt-1 text-slate-600">
            Complete all steps and provide artifact links. Status becomes Shipped only when every condition is met.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-slate-900">
              Status: {shipped ? 'Shipped' : 'In Progress'}
            </CardTitle>
            <CardDescription>
              {shipped
                ? 'All 8 steps completed, test checklist passed, and 3 proof links provided.'
                : 'Complete steps, pass the test checklist, and add valid URLs to reach Shipped.'}
            </CardDescription>
          </CardHeader>
          {shipped && (
            <CardContent className="pt-0">
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-center">
                <p className="text-slate-800 font-medium">You built a real product.</p>
                <p className="text-slate-600 mt-1">Not a tutorial. Not a clone.</p>
                <p className="text-slate-600">A structured tool that solves a real problem.</p>
                <p className="text-slate-800 font-medium mt-2">This is your proof of work.</p>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step completion overview</CardTitle>
            <CardDescription>Mark each step when completed. All 8 must be completed for Shipped.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {PROOF_STEPS.map(({ id, label }) => (
                <li key={id} className="flex items-center justify-between gap-4">
                  <span className="text-slate-900">{label}</span>
                  <span className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStepToggle(id, true)}
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        steps[id] === true
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      Completed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepToggle(id, false)}
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        steps[id] === false
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      Pending
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Artifact inputs (required for Ship status)</CardTitle>
            <CardDescription>Valid http(s) URLs required. Stored in localStorage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="lovable" className="block text-sm font-medium text-slate-700 mb-1">
                Lovable Project Link
              </label>
              <input
                id="lovable"
                type="url"
                value={links.lovableUrl}
                onChange={(e) => handleLinkChange('lovableUrl', e.target.value)}
                onBlur={() => handleBlur('lovableUrl')}
                placeholder="https://..."
                className={`w-full rounded-lg border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                  showLovableError ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-primary'
                }`}
              />
              {showLovableError && (
                <p className="mt-1 text-sm text-red-600">Enter a valid http or https URL.</p>
              )}
            </div>
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-slate-700 mb-1">
                GitHub Repository Link
              </label>
              <input
                id="github"
                type="url"
                value={links.githubUrl}
                onChange={(e) => handleLinkChange('githubUrl', e.target.value)}
                onBlur={() => handleBlur('githubUrl')}
                placeholder="https://github.com/..."
                className={`w-full rounded-lg border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                  showGithubError ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-primary'
                }`}
              />
              {showGithubError && (
                <p className="mt-1 text-sm text-red-600">Enter a valid http or https URL.</p>
              )}
            </div>
            <div>
              <label htmlFor="deployed" className="block text-sm font-medium text-slate-700 mb-1">
                Deployed URL
              </label>
              <input
                id="deployed"
                type="url"
                value={links.deployedUrl}
                onChange={(e) => handleLinkChange('deployedUrl', e.target.value)}
                onBlur={() => handleBlur('deployedUrl')}
                placeholder="https://..."
                className={`w-full rounded-lg border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                  showDeployedError ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-primary'
                }`}
              />
              {showDeployedError && (
                <p className="mt-1 text-sm text-red-600">Enter a valid http or https URL.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Final submission export</CardTitle>
            <CardDescription>Copy the formatted submission text (includes your links and core capabilities).</CardDescription>
          </CardHeader>
          <CardFooter>
            <button
              type="button"
              onClick={handleCopyFinalSubmission}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {copyDone ? 'Copied!' : 'Copy Final Submission'}
            </button>
          </CardFooter>
        </Card>

        <p className="text-sm text-slate-500">
          <Link to="/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
          {' · '}
          <Link to="/prp/07-test" className="text-primary hover:underline">Test checklist</Link>
          {' · '}
          <Link to="/prp/08-ship" className="text-primary hover:underline">Ship</Link>
        </p>
      </div>
    </div>
  );
}

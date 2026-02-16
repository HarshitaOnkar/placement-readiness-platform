/**
 * KodNest Premium Build System — Top Bar
 * Left: Project name | Center: Progress (Step X / Y) | Right: Status badge
 */

import { Badge } from '../ui/Badge';

export function TopBar({ projectName = 'Project', step = 1, totalSteps = 1, status = 'not-started' }) {
  return (
    <header className="kn-topbar" role="banner">
      <div className="kn-topbar__project">{projectName}</div>
      <div className="kn-topbar__progress" aria-live="polite">
        Step {step} / {totalSteps}
      </div>
      <div className="kn-topbar__status">
        <Badge status={status} />
      </div>
    </header>
  );
}

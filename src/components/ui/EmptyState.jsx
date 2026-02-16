/**
 * KodNest Premium Build System — Empty State
 * Provide next action; never feel dead.
 */

import { Button } from './Button';

export function EmptyState({ title, hint, actionLabel, onAction, children }) {
  return (
    <div className="kn-empty-state">
      {title && <h3 className="kn-empty-state__title">{title}</h3>}
      {hint && <p className="kn-empty-state__hint">{hint}</p>}
      {children}
      {(actionLabel || onAction) && (
        <div className="kn-empty-state__action">
          <Button variant="primary" onClick={onAction}>
            {actionLabel ?? 'Continue'}
          </Button>
        </div>
      )}
    </div>
  );
}

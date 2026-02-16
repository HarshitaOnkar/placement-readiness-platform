/**
 * KodNest Premium Build System — Badge (Status)
 * Not Started | In Progress | Shipped
 */

const STATUS_LABELS = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  shipped: 'Shipped',
};

export function Badge({ status = 'not-started' }) {
  const label = STATUS_LABELS[status] ?? status;
  const className = ['kn-badge', `kn-badge--${status}`].filter(Boolean).join(' ');
  return (
    <span className={className} role="status">
      {label}
    </span>
  );
}

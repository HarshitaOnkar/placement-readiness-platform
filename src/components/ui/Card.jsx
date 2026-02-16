/**
 * KodNest Premium Build System — Card
 * Subtle border, no drop shadows, balanced padding.
 */

export function Card({ children, className = '', ...props }) {
  const classNames = ['kn-card', className].filter(Boolean).join(' ');
  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}

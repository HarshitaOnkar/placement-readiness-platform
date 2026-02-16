/**
 * KodNest Premium Build System — Button
 * Primary = solid deep red. Secondary = outlined. Same hover and radius everywhere.
 */

export function Button({ variant = 'secondary', children, className = '', ...props }) {
  const classNames = ['kn-btn', `kn-btn--${variant}`, className].filter(Boolean).join(' ');
  return (
    <button type="button" className={classNames} {...props}>
      {children}
    </button>
  );
}

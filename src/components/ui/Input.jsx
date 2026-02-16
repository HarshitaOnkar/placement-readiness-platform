/**
 * KodNest Premium Build System — Input
 * Clean borders, no heavy shadows, clear focus state.
 */

export function Input({ className = '', ...props }) {
  const classNames = ['kn-input', className].filter(Boolean).join(' ');
  return <input className={classNames} {...props} />;
}

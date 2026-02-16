/**
 * KodNest Premium Build System — Error Box
 * Explain what went wrong + how to fix. Never blame the user.
 */

export function ErrorBox({ title = 'Something went wrong', message, fix, children }) {
  return (
    <div className="kn-error-box" role="alert">
      <p className="kn-error-box__title">{title}</p>
      {message && <p className="kn-error-box__message">{message}</p>}
      {fix && <p className="kn-error-box__fix">{fix}</p>}
      {children}
    </div>
  );
}

/**
 * KodNest Premium Build System — Proof Footer
 * Persistent bottom section. Checklist: UI Built, Logic Working, Test Passed, Deployed.
 * Each item requires user proof input.
 */

const DEFAULT_ITEMS = [
  { id: 'ui', label: 'UI Built', checked: false },
  { id: 'logic', label: 'Logic Working', checked: false },
  { id: 'test', label: 'Test Passed', checked: false },
  { id: 'deployed', label: 'Deployed', checked: false },
];

export function ProofFooter({ items = DEFAULT_ITEMS, onToggle }) {
  return (
    <footer className="kn-proof-footer" role="contentinfo">
      <ul className="kn-proof-footer__list">
        {items.map((item) => (
          <li key={item.id} className="kn-proof-footer__item">
            <button
              type="button"
              className="kn-proof-footer__checkbox"
              aria-label={`${item.label}: ${item.checked ? 'done' : 'pending'}`}
              aria-checked={item.checked}
              onClick={() => onToggle?.(item.id)}
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </footer>
  );
}

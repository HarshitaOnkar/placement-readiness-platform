/**
 * KodNest Premium Build System — Secondary Panel
 * 30% width. Step explanation, copyable prompt, actions. Calm styling.
 */

import { Button } from '../ui/Button';

export function SecondaryPanel({
  stepTitle = 'Step',
  stepDescription,
  promptText = '',
  onCopy,
  onBuildInLovable,
  onItWorked,
  onError,
  onAddScreenshot,
}) {
  const handleCopy = () => {
    if (promptText && navigator.clipboard) {
      navigator.clipboard.writeText(promptText);
      onCopy?.();
    }
  };

  return (
    <aside className="kn-panel" role="complementary" aria-label="Step guidance">
      <h2 className="kn-panel__title">{stepTitle}</h2>
      {stepDescription && (
        <p className="kn-panel__step-desc">{stepDescription}</p>
      )}
      {promptText && (
        <>
          <textarea
            className="kn-panel__prompt-box"
            readOnly
            value={promptText}
            aria-label="Copyable prompt"
          />
          <div className="kn-panel__actions">
            <Button variant="secondary" onClick={handleCopy}>
              Copy
            </Button>
            {onBuildInLovable && (
              <Button variant="primary" onClick={onBuildInLovable}>
                Build in Lovable
              </Button>
            )}
            {onItWorked && (
              <Button variant="secondary" onClick={onItWorked}>
                It Worked
              </Button>
            )}
            {onError && (
              <Button variant="secondary" onClick={onError}>
                Error
              </Button>
            )}
            {onAddScreenshot && (
              <Button variant="secondary" onClick={onAddScreenshot}>
                Add Screenshot
              </Button>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

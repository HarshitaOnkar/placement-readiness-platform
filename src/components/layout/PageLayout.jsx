/**
 * KodNest Premium Build System — Page Layout
 * [Top Bar] → [Context Header] → [Primary Workspace + Secondary Panel] → [Proof Footer]
 */

import { TopBar } from './TopBar';
import { ContextHeader } from './ContextHeader';
import { PrimaryWorkspace } from './PrimaryWorkspace';
import { SecondaryPanel } from './SecondaryPanel';
import { ProofFooter } from './ProofFooter';

export function PageLayout({
  projectName,
  step,
  totalSteps,
  status,
  headline,
  subtext,
  children,
  stepTitle,
  stepDescription,
  promptText,
  onCopy,
  onBuildInLovable,
  onItWorked,
  onError,
  onAddScreenshot,
  proofItems,
  onProofToggle,
}) {
  return (
    <div className="kn-root">
      <TopBar
        projectName={projectName}
        step={step}
        totalSteps={totalSteps}
        status={status}
      />
      <ContextHeader headline={headline} subtext={subtext} />
      <div className="kn-main">
        <PrimaryWorkspace>{children}</PrimaryWorkspace>
        <SecondaryPanel
          stepTitle={stepTitle}
          stepDescription={stepDescription}
          promptText={promptText}
          onCopy={onCopy}
          onBuildInLovable={onBuildInLovable}
          onItWorked={onItWorked}
          onError={onError}
          onAddScreenshot={onAddScreenshot}
        />
      </div>
      <ProofFooter items={proofItems} onToggle={onProofToggle} />
    </div>
  );
}

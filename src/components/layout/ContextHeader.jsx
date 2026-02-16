/**
 * KodNest Premium Build System — Context Header
 * Large serif headline + one-line subtext. Clear purpose, no hype.
 */

export function ContextHeader({ headline, subtext }) {
  return (
    <section className="kn-context-header" aria-labelledby="kn-context-headline">
      <h1 id="kn-context-headline" className="kn-context-header__headline kn-heading kn-heading--h1">
        {headline}
      </h1>
      {subtext && (
        <p className="kn-context-header__subtext kn-body">{subtext}</p>
      )}
    </section>
  );
}

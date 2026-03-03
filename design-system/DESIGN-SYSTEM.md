# KodNest Premium Build System

A premium B2C design system. Calm, intentional, coherent, confident. One mind designed it.

---

## Design philosophy

- **Calm** — No animation noise, no parallax, no bounce.
- **Intentional** — Every spacing value from the scale. No decorative fonts.
- **Coherent** — Same hover, same radius, same transition everywhere.
- **Confident** — Serif headlines, generous whitespace, clear hierarchy.

**Do not use:** Gradients, glassmorphism, neon colors, flashy or playful styling, hackathon-style UI.

---

## Color system (maximum 4)

| Role       | Token           | Value     | Usage                    |
|-----------|-----------------|-----------|--------------------------|
| Background| `--kn-background` | `#F7F6F3` | Page, cards, inputs      |
| Primary text | `--kn-text`   | `#111111` | Headings, body           |
| Accent    | `--kn-accent`  | `#8B0000` | Primary buttons, focus, links |
| Success   | `--kn-success` | `#4A5D4A` | Success states, shipped  |
| Warning   | `--kn-warning` | `#7D6B5A` | Warnings, in progress    |

Derived: `--kn-text-muted`, `--kn-border`, `--kn-border-focus` (from the four). No extra colors.

---

## Typography

- **Headings:** Serif (`Georgia` / system serif). Large, confident, generous spacing. Use `h1`–`h3` or `.kn-heading-1`–`.kn-heading-3`.
- **Body:** Sans-serif, 16–18px, line-height 1.6–1.8. Max width **720px** (`--kn-measure`) for text blocks.
- **Rule:** No decorative fonts. No random sizes. Only tokens: `--kn-size-h1`, `--kn-size-body`, etc.

---

## Spacing scale (strict)

Use only: **8px, 16px, 24px, 40px, 64px**

| Token           | Value |
|-----------------|-------|
| `--kn-space-xs` | 8px   |
| `--kn-space-sm` | 16px  |
| `--kn-space-md` | 24px  |
| `--kn-space-lg` | 40px  |
| `--kn-space-xl` | 64px  |

Never use values like 13px, 27px, etc. Whitespace is part of the design.

---

## Global layout structure

Every page must follow this order:

1. **Top Bar** — Left: project name. Center: progress (Step X / Y). Right: status badge (Not Started / In Progress / Shipped).
2. **Context Header** — Large serif headline, one-line subtext. Clear purpose. No hype language.
3. **Primary Workspace (70%)** — Main product interaction. Clean cards, predictable components.
4. **Secondary Panel (30%)** — Step explanation, copyable prompt box, actions: Copy, Build in Lovable, It Worked, Error, Add Screenshot. Calm styling.
5. **Proof Footer** — Persistent bottom. Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed. Each item requires user proof.

Classes: `.kn-page`, `.kn-topbar`, `.kn-context-header`, `.kn-main`, `.kn-workspace`, `.kn-panel`, `.kn-proof-footer`.

---

## Components

- **Primary button:** `.kn-btn.kn-btn--primary` — Solid deep red. Hover: darker red.
- **Secondary button:** `.kn-btn.kn-btn--secondary` — Outlined, same radius and hover behavior.
- **Inputs:** `.kn-input`, `.kn-textarea` — Clean border, no heavy shadow. Clear focus state (accent border).
- **Cards:** `.kn-card` — Subtle border, no drop shadow, padding from spacing scale.

All interactive elements: **150–200ms ease-in-out** transition. No bounce.

---

## Error and empty states

- **Errors:** Explain what went wrong and how to fix it. Never blame the user. Use `.kn-error-box`.
- **Empty states:** Provide the next action. Never feel dead. Use `.kn-empty-state` and a clear CTA in `.kn-empty-state__action`.

---

## Usage

Import once at app root:

```html
<link rel="stylesheet" href="/design-system/index.css" />
```

Or in JS:

```js
import "./design-system/index.css";
```

Then use layout and component classes as documented above. Do not introduce new colors, spacing values, or fonts outside this system.

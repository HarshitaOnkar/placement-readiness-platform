# KodNest Premium Build System

Single source of truth for visual and interaction rules. No visual drift.

## Design philosophy

- **Calm, Intentional, Coherent, Confident**
- Not flashy, loud, playful, or hackathon-style
- No gradients, glassmorphism, neon colors, or animation noise

## Color system (max 4)

| Token | Value | Use |
|-------|--------|-----|
| Background | `#F7F6F3` | Page, panels |
| Primary text | `#111111` | All copy |
| Accent | `#8B0000` | Primary actions, links, focus |
| Success | muted green | Shipped, success states |
| Warning | muted amber | Warnings only |

## Typography

- **Headings:** Serif (Lora), large, confident, generous spacing
- **Body:** Sans-serif (Source Sans 3), 16–18px, line-height 1.6–1.8, max-width 720px for text blocks
- No decorative fonts, no random sizes

## Spacing scale (only these)

`8px` · `16px` · `24px` · `40px` · `64px`  
Never use random values (e.g. 13px, 27px). Whitespace is part of the design.

## Global layout (every page)

1. **Top Bar** — Left: project name · Center: Step X / Y · Right: status badge (Not Started / In Progress / Shipped)
2. **Context Header** — One large serif headline, one-line subtext, clear purpose, no hype
3. **Primary Workspace (70%)** — Main interaction; clean cards, predictable components
4. **Secondary Panel (30%)** — Step explanation, copyable prompt, actions: Copy, Build in Lovable, It Worked, Error, Add Screenshot
5. **Proof Footer** — Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed (user proof per item)

## Components

- **Primary button:** Solid deep red. **Secondary:** Outlined. Same hover and border radius everywhere.
- **Inputs:** Clean borders, no heavy shadows, clear focus state.
- **Cards:** Subtle border, no drop shadows, balanced padding (spacing scale).

## Interaction

- Transitions: 150–200ms, ease-in-out. No bounce, no parallax.

## Error & empty states

- **Errors:** Explain what went wrong and how to fix it. Never blame the user.
- **Empty:** Provide the next action. Never feel dead.

---

Tokens and classes live in `kodnest-design-system.css`. Layout components in `components/layout`, UI components in `components/ui`.

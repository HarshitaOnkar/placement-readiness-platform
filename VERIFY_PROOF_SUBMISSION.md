# Proof + Submission System — Verification

## 1. Proof page works with URL validation

- **Route:** `/prp/proof`
- **Section A — Step completion:** 8 steps with Completed / Pending. Click a step row to toggle. Stored in `prp_final_submission` in localStorage.
- **Section B — Artifact inputs:** Three required fields:
  - Lovable Project Link
  - GitHub Repository Link
  - Deployed URL  
  Each must be a valid `http:` or `https:` URL. Invalid input shows red border and: *"Enter a valid http or https URL."*
- **Storage key:** `prp_final_submission`. Value: `{ stepCompleted: boolean[], lovableProjectLink, githubRepoLink, deployedUrl }`.

**Verify URL validation:**
1. Enter `not-a-url` in any link field → invalid, message shown.
2. Enter `https://example.com` → valid, no error.
3. Clear field → valid (empty is allowed until submit; Shipped requires all three valid and non-empty in practice — validation requires non-empty for `isValidUrl` to pass for “all links provided”).

**Note:** `allLinksProvided()` requires all three URLs to be non-empty and valid. So for Shipped you must enter three valid URLs.

## 2. Shipped status only when all conditions met

**Status = "Shipped" only when:**
- All 8 steps marked completed (all `stepCompleted[i] === true`)
- All 10 test checklist items passed (`allTestsPassed()` from `prp-test-checklist`)
- All 3 proof links provided and valid (`allLinksProvided()`)

**Otherwise:** Status = "In Progress".

**Verify:**
1. Open `/prp/proof`. Status = "In Progress".
2. Complete all 8 steps and add 3 valid URLs, but do **not** complete the test checklist → Status stays "In Progress".
3. Complete all 10 tests on `/prp/07-test`, then return to `/prp/proof` with 8 steps + 3 links → Status = "Shipped", completion message appears.
4. Reset test checklist (or uncheck one step / clear one link) → Status returns to "In Progress". Checklist lock on `/prp/08-ship` is not bypassed.

## 3. Copy export produces correct formatted text

- **Button:** "Copy Final Submission"
- **Action:** Copies the following block (with your saved links) to the clipboard:

```
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: {link}
GitHub Repository: {link}
Live Deployment: {link}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
```

**Verify:**
1. Enter three valid URLs on `/prp/proof`.
2. Click "Copy Final Submission". "Copied to clipboard." appears.
3. Paste into a text editor. The block must match the format above, with your three URLs in place of `{link}`.

## 4. Completion message when Shipped

When status becomes "Shipped", the Proof page shows:

- *"You built a real product."*
- *"Not a tutorial. Not a clone."*
- *"A structured tool that solves a real problem."*
- *"This is your proof of work."*

Displayed in a highlighted block below the "Shipped" badge.

## 5. Verification steps summary

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `/prp/proof` | Step overview (8 steps), 3 link inputs, Copy button, Status "In Progress". |
| 2 | Enter invalid URL in one link | Red border + validation message. |
| 3 | Enter valid https URLs in all 3 | No validation error. |
| 4 | Mark all 8 steps complete, keep 3 links | Still "In Progress" if test checklist not all passed. |
| 5 | Complete all 10 tests on `/prp/07-test` | — |
| 6 | Return to `/prp/proof` (8 steps + 3 links + 10 tests) | Status "Shipped", completion message visible. |
| 7 | Click "Copy Final Submission", paste elsewhere | Formatted block with correct heading and your 3 links. |
| 8 | Reset test checklist or uncheck one step | Status returns to "In Progress". |

## 6. No bypass of checklist lock

- `/prp/08-ship` remains locked until all 10 test checklist items are passed (unchanged).
- Shipped status on `/prp/proof` explicitly requires `allTestsPassed()` in addition to 8 steps and 3 links. There is no way to get "Shipped" without completing the test checklist.

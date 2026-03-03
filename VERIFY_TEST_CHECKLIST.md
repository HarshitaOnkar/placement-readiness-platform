# Test Checklist & Ship Lock — Verification

## 1. Checklist stored in localStorage and persists

- **Storage key:** `prp-test-checklist`
- **Value:** JSON array of 10 booleans (e.g. `[false,true,false,...]`).
- **Verify:**
  1. Open `/prp/07-test`. Check 2–3 items.
  2. Open DevTools → Application → Local Storage → your origin. Find `prp-test-checklist`. Value should be a 10-element array with `true` where you checked.
  3. Refresh the page (F5). The same items should still be checked. Navigate away and back to `/prp/07-test` — state should persist.

## 2. /prp/08-ship is locked until checklist complete

- **When fewer than 10 tests are passed:** Ship page shows a **locked** state: “Ship locked”, “Complete all tests on the Test Checklist before shipping”, and a link to the test checklist.
- **When all 10 are checked:** Ship page shows **“Ready to ship”** and the success message.
- **Verify:**
  1. With checklist not complete, go to `/prp/08-ship`. You should see the locked card and the link to `/prp/07-test`.
  2. Go to `/prp/07-test`, check all 10 items.
  3. Go to `/prp/08-ship` again. You should see “Ready to ship” (unlocked).
  4. On `/prp/07-test`, click **Reset checklist**. All checkboxes clear.
  5. Go to `/prp/08-ship` again. It should show locked again.

## 3. Summary and warning

- **Summary:** At the top of `/prp/07-test`, “Tests Passed: X / 10” reflects the current number of checked items.
- **Warning:** If X < 10, the message “Fix issues before shipping.” is shown in an amber box.
- **Reset:** “Reset checklist” clears all 10 checkboxes and updates localStorage.

## 4. Routes (no changes to existing routes)

- **New routes only:** `/prp/07-test` (Test checklist), `/prp/08-ship` (Ship).
- Existing routes (e.g. `/`, `/dashboard`, `/dashboard/analyze`, etc.) are unchanged.

## 5. Quick verification steps

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `/prp/07-test` | Page shows “Tests Passed: 0 / 10”, 10 tests with checkboxes and “How to test” hints, “Fix issues before shipping.”, Reset button. |
| 2 | Check one item | “Tests Passed: 1 / 10”. localStorage `prp-test-checklist` has one `true`. |
| 3 | Refresh page | Same item still checked. |
| 4 | Open `/prp/08-ship` | “Ship locked” and link to test checklist. |
| 5 | Check all 10 on `/prp/07-test` | “Tests Passed: 10 / 10”. Warning disappears. |
| 6 | Open `/prp/08-ship` | “Ready to ship” (unlocked). |
| 7 | Reset checklist, then open `/prp/08-ship` | “Ship locked” again. |

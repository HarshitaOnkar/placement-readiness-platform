# Verify JD Analysis (no external APIs)

## 1. Skill extraction

- **How it works:** The app scans the pasted JD text (case-insensitive) for keywords in 6 categories: Core CS, Languages, Web, Data, Cloud/DevOps, Testing. If no category matches, it shows **"General fresher stack"**.
- **Check:** Paste a JD containing e.g. "React", "DSA", "Python", "SQL" and click **Analyze**. On the Results page, **Key skills extracted** should show those terms grouped by category (Web, Core CS, Languages, Data).

## 2. History persists after refresh

- **How it works:** Each analysis is saved to `localStorage` under the key `placement-readiness-history`. The list is read when you open the **History** page.
- **Check:**
  1. Run an analysis (Analyze → paste JD → Analyze).
  2. You should be redirected to Results. Note company/role/score.
  3. Open **History** in the sidebar. The entry should appear with date, company, role, and score.
  4. **Refresh the page (F5).** Open **History** again — the same entry should still be there.
  5. Click the entry — it should open **Results** with that analysis (same score, skills, checklist, plan, questions).

## 3. Steps to verify with a sample JD

1. **Go to Analyze** (sidebar → Analyze).

2. **Optional:** Enter **Company:** `Tech Corp`, **Role:** `SDE 1`.

3. **Paste this sample JD** (or any JD with mixed keywords):

```
We are looking for a Software Development Engineer with strong fundamentals in DSA and OOP.
You will work with React and Node.js to build scalable web applications. Experience with SQL and MongoDB is a plus.
Knowledge of AWS, Docker, and CI/CD is preferred. You should be comfortable with Python or JavaScript.
Familiarity with REST APIs and system design is expected.
```

4. Click **Analyze**.

5. **On Results you should see:**
   - **Readiness score:** e.g. 35 + (5×categories) + 10 (company) + 10 (role) + 0 (JD length < 800). If you left company/role empty, score is lower.
   - **Key skills extracted:** Tags under Core CS (e.g. DSA, OOP), Web (React, Node.js, REST), Data (SQL, MongoDB), Languages (Python, JavaScript), Cloud/DevOps (AWS, Docker, CI/CD).
   - **Round-wise checklist:** 4 rounds with 5–8 items each, including items that reference the detected skills.
   - **7-day plan:** Day 1–2, 3–4, 5, 6, 7 with tasks adapted to the stack (e.g. frontend/DSA/SQL).
   - **10 likely interview questions:** Questions tied to the detected skills (e.g. React state management, SQL indexing, DSA).

6. **Persist and re-open:**
   - Go to **History**. The analysis should be listed with date, "Tech Corp · SDE 1", and the score.
   - Refresh the browser (F5). Open **History** again — the entry remains.
   - Click the entry — **Results** opens with the same analysis (read from `localStorage`).

## Readiness score formula (0–100)

- Start: **35**
- +5 per detected category (max **30**)
- +10 if company provided
- +10 if role provided  
- +10 if JD length > 800 characters  
- Cap: **100**

No external APIs or scraping; everything runs in the browser and persists in `localStorage`.

---

## 4. Interactive results and export (verification)

### 4.1 Live readiness score

- **How it works:** Base score comes from the original analysis. Each skill has a toggle: **"I know this"** or **"Need practice"** (default). The displayed score = base + 2×(know count) − 2×(practice count), clamped 0–100. It updates as you toggle.
- **Verify:**
  1. Open **Results** for any analysis. Note the current score.
  2. In **Key skills extracted**, click a skill that shows "Need practice" so it switches to "I know this". The score at the top should **increase by 2** immediately.
  3. Click the same skill back to "Need practice". The score should **decrease by 2**.
  4. Mark several skills "I know this" and confirm the score goes up by 2 per skill (until cap 100).

### 4.2 Toggles persist after refresh

- **How it works:** Each toggle updates `skillConfidenceMap` on the history entry and saves it to `localStorage` via `updateEntry`. When you reopen the same result (from History or refresh), the map is loaded from the entry.
- **Verify:**
  1. On **Results**, change 2–3 skills to "I know this" and note the new score.
  2. **Refresh the page (F5).** If you had opened Results with `?id=...`, open **History** and click the same entry again (or re-open the same results URL).
  3. The same skills should still show "I know this", and the score should be the same (not reset to base).

### 4.3 Export tools

- **Copy 7-day plan / Copy round checklist / Copy 10 questions:** Click each button; a short "Copied: …" message appears. Paste in a text editor to confirm plain text.
- **Download as TXT:** Click **Download as TXT**. A single file (e.g. `readiness-<id>.txt`) should download with all sections: score, checklist, 7-day plan, 10 questions.

### 4.4 Action next box

- At the bottom of **Results**, the **Action next** card shows up to 3 skills marked "Need practice" (weak areas) and suggests: **"Start Day 1 plan now."** If all skills are "I know this", it still suggests starting Day 1.

---

## 5. Company intel and round mapping (verification)

### 5.1 Company intel renders when company is provided

- **How it works:** If you enter a **Company** name on Analyze and run analysis, the saved entry includes `companyIntel` (name, industry, size, typical hiring focus). On **Results**, a **Company intel** card appears with:
  - Company name  
  - Industry (heuristic from JD/name or default "Technology Services")  
  - Estimated size: Startup (&lt;200), Mid-size (200–2000), or Enterprise (2000+)  
  - Typical hiring focus (template by size)  
- **Demo note:** The card shows: *"Demo mode: Company intel generated heuristically."*

**Test scenarios:**

| Scenario | Company (Analyze) | JD contains | Expected |
|----------|-------------------|-------------|----------|
| Enterprise | `Infosys` or `Amazon` | any | Size: Enterprise (2000+), hiring focus: structured DSA + core |
| Startup | `My Startup Inc` | React, Node.js | Size: Startup (&lt;200), hiring focus: practical + stack depth |
| Industry | `HealthTech Co` | "health", "medical" | Industry: Healthcare & Life Sciences (if keyword in name/JD) |

- **Verify:** Run an analysis with Company = **Infosys** and any JD. Open Results → **Company intel** card shows **Infosys**, **Enterprise (2000+)**, and the enterprise-style hiring focus. Run another with Company = **Acme Labs** and JD with "React" → **Startup (&lt;200)** and startup-style hiring focus.

### 5.2 Round mapping changes by company + skills

- **How it works:** When `companyIntel` exists, **Round mapping** is generated from company size and detected skills. Results show a **vertical timeline** of rounds; each round has a short **description** and **"Why this round matters"**.

**Test scenarios:**

| Scenario | Company | Skills in JD | Expected round flow (example) |
|----------|---------|--------------|-------------------------------|
| Enterprise + DSA | `TCS` | DSA, OOP | R1 Online Test (DSA + Aptitude), R2 Technical (DSA + Core CS), R3 Tech + Projects, R4 HR |
| Startup + Web | `Startup Co` | React, Node.js | R1 Practical coding, R2 System/product discussion, R3 Culture fit |
| Mid-size | (company with "scale" or "growth" in JD) | any | R1 Technical/Coding, R2 Deep-dive, R3 Team/HR |

- **Verify:**  
  1. Analyze with Company **Amazon** and JD containing **DSA, OOP**. Results → **Round mapping** shows 4 rounds (Online Test → Technical → Tech+Projects → HR) with "Why this round matters" under each.  
  2. Analyze with Company **SmallCo** and JD containing **React, Node.js** (no DSA). Results → **Round mapping** shows 3 rounds (Practical coding → System discussion → Culture fit).  

### 5.3 Persist and no routes changed

- Intel and round mapping are stored in the history entry (`companyIntel`, `roundMapping`). Reopening the same result from **History** shows the same Company intel and Round mapping.  
- Routes are unchanged; all of this appears on the existing **Results** page when company name was provided at analysis time.

---

## 6. Data model, validation, and edge cases (hardening)

### 6.1 Schema consistency

- Every saved history entry is normalized to the strict schema in `src/lib/entrySchema.js`:
  - `id`, `createdAt`, `company` (string or ""), `role` (string or ""), `jdText` (string)
  - `extractedSkills`: `{ coreCS, languages, web, data, cloud, testing, other }` (all string arrays)
  - `roundMapping`: `[{ round, roundTitle, focusAreas[], whyItMatters }]`
  - `checklist`: `[{ roundTitle, items[] }]`
  - `plan7Days`: `[{ day, focus, tasks[] }]`
  - `questions`: string[]
  - `baseScore` (number), `skillConfidenceMap`, `finalScore`, `updatedAt`
- New analyses are built with `buildEntryFromAnalysis()`. Loaded entries are normalized with `normalizeEntry()` so legacy and new entries share the same shape.

### 6.2 Input validation (Analyze page)

- **JD required:** Submit is blocked with "Please paste the job description text." if JD is empty.
- **JD &lt; 200 characters:** A calm warning is shown: *"This JD is too short to analyze deeply. Paste full JD for better output."* Analysis still runs; company and role remain optional.

### 6.3 Default when no skills detected

- If extraction returns no categories, `extractedSkills.other` is set to:
  `["Communication", "Problem solving", "Basic coding", "Projects"]`.
- Plan, checklist, and questions already use general-fresher templates when no skills are detected.

### 6.4 Score stability

- **baseScore:** Set only at analyze time; never changed by toggles.
- **finalScore:** Updated only when the user toggles skills: `finalScore = baseScore + 2×(know) − 2×(practice)`, clamped 0–100. Persisted with `updatedAt` and `skillConfidenceMap` on each toggle.

### 6.5 History robustness

- `getHistory()` validates and normalizes each entry. Corrupt or invalid entries are skipped.
- If any entry was skipped, the History page shows: *"One saved entry couldn't be loaded. Create a new analysis."*

### 6.6 Verification steps for edge cases

| Scenario | How to verify |
|----------|----------------|
| **JD required** | On Analyze, clear JD and click Analyze → error "Please paste the job description text." |
| **JD &lt; 200 chars** | Paste &lt; 200 characters → warning appears; analysis still runs. |
| **No skills (short JD)** | Paste a very short JD with no keywords → Results show "Other" with Communication, Problem solving, Basic coding, Projects. |
| **Score stability** | Run analysis → note base score. Toggle skills → score updates; reopen from History → same finalScore. |
| **Corrupt history** | In DevTools → Application → Local Storage, edit `placement-readiness-history` and corrupt one entry (e.g. remove `id` or `jdText`) → reload History → message "One saved entry couldn't be loaded." and list without that entry. |

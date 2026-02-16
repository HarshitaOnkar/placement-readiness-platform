# Placement Readiness Platform — Verification Steps

Use these steps to confirm skill extraction, readiness score, and history persistence **without changing routes or using external APIs**.

---

## 1. Skill extraction

- Go to **Dashboard → Analyze**.
- Paste the sample JD (see `src/lib/sampleJd.js` or the text below) into the Job description field.
- Optionally set **Company**: `Tech Corp`, **Role**: `SDE Intern`.
- Click **Analyze**.

**Expected:**

- **Key skills extracted** (Results page) shows tags grouped by category, e.g.:
  - **Core CS:** DSA
  - **Languages:** Java, Python, JavaScript
  - **Web:** React, Node.js, Express, REST
  - **Data:** SQL, MongoDB, PostgreSQL, MySQL
  - **Cloud/DevOps:** AWS, Docker
  - **Testing:** Selenium, JUnit, PyTest
- No gradients/APIs; all from local heuristic keyword match.

**General / no skills detected:**

- Clear the JD and paste only: `We need a motivated fresher.`
- Analyze again. **Key skills** should show **General** with: Communication, Problem solving, Basic coding, Projects (no other categories).

---

## 2. Readiness score (0–100)

Using the **full sample JD** and **Company** + **Role** filled:

- **Base:** 35  
- **Categories:** 6 categories × 5 = 30 (capped)  
- **Company:** +10  
- **Role:** +10  
- **JD length > 800:** +10  

**Expected score:** 35 + 30 + 10 + 10 + 10 = **95** (capped at 100).

- Leave Company and Role empty: score should be **75** (35 + 30 + 10).
- Use a JD with &lt; 800 characters and no company/role: score stays lower (e.g. 35 + category bonus only).

---

## 3. History persists after refresh

- Run **Analyze** at least once with the sample JD (company + role for clarity).
- Go to **Dashboard → History**.
- Confirm the list shows: **date**, **company**, **role**, **readiness score**.
- Click a row → should open **Results** for that analysis (same skills, checklist, plan, questions, score).
- **Refresh the page (F5).**
- Open **Dashboard → History** again. The same entries should still be there (loaded from `localStorage`).
- Open **Dashboard → Results** (no `?id=`). The **latest** analysis (most recent run) should appear.

---

## 4. Sample JD (copy-paste)

Copy the following into the Job description field for a full run:

```
We are looking for a Software Development Engineer who is passionate about building scalable systems.

Requirements:
- Strong foundation in DSA and problem-solving. Comfortable with arrays, trees, graphs, and dynamic programming.
- Proficiency in at least one of: Java, Python, or JavaScript. We use Java and Python on the backend.
- Experience with React for frontend development. Knowledge of state management and component design.
- Backend: Node.js and Express. Understanding of REST APIs and async programming.
- Databases: SQL (PostgreSQL, MySQL) for relational data; MongoDB for document storage.
- Nice to have: AWS (EC2, S3), Docker for containerization, CI/CD pipelines.
- Testing: Selenium or similar for E2E tests. Unit tests with JUnit/PyTest.

You will work on our core platform, collaborate with product and design, and ship features that impact millions of users. Strong communication skills and ability to work in a fast-paced environment are essential.

We value curiosity, ownership, and a growth mindset. If you love clean code and continuous learning, we would like to hear from you.
```

Use **Company:** `Tech Corp`, **Role:** `SDE Intern` to verify the full readiness score and all sections (checklist, 7-day plan, 10 questions).

---

## 5. Offline / no external calls

- Disconnect the network (or disable Wi-Fi).
- Run **Analyze** with any JD, then open **History** and **Results**.
- Everything should work; no external APIs or scraping are used. Data is stored only in `localStorage`.

---

## 6. Interactive results (skill toggles, live score, export, Action next)

### Live readiness score

- Open **Dashboard → Results** for an analysis that has **Key skills extracted**.
- Initial score uses the **base** readiness score, then **−2 per skill** (all default to “Need practice”). So the number can be lower than the base and updates as you toggle.
- Click **“I know”** on several skills: score should **increase by +2 per skill** (capped at 100).
- Click **“Need practice”** again: score should **decrease by −2 per skill** (floored at 0).
- The circular progress and the “X/100” label must update **immediately** (no page reload).

### Toggles persist after refresh

- On **Results**, change some skills to **“I know”** and some to **“Need practice”**.
- **Refresh the page (F5)** (or go to **History** and click the same entry to reopen **Results**).
- The same skills must still show **“I know”** or **“Need practice”** as before. The live score must match (persisted in the history entry in `localStorage`).

### Export tools

- **Copy 7-day plan:** Click **“Copy 7-day plan”** → paste in a text editor. You should see the 7-day plan as plain text (days and bullet tasks).
- **Copy round checklist:** Click **“Copy round checklist”** → paste. You should see all rounds and their checklist items.
- **Copy 10 questions:** Click **“Copy 10 questions”** → paste. You should see the 10 numbered questions.
- **Download as TXT:** Click **“Download as TXT”** → a `.txt` file should download containing: title, company/role, key skills, checklist, 7-day plan, and 10 questions in one file.

### Action next box

- At the **bottom** of **Results**, find the **“Action next”** card.
- With default toggles (all “Need practice”), it should show **“Top weak skills (need practice):”** with up to **3** skill names, and the suggestion **“Start Day 1 plan now.”** with a button that scrolls to the 7-day plan section.
- After marking **all** listed skills as “I know”, the box can show the message that all skills are marked known (no weak list).

---

## 7. Company intel and round mapping

### Company intel renders correctly

- Run **Analyze** with **Company** set (e.g. `Tech Corp` or `Infosys`) and a JD.
- Open **Results**. You should see:
  - A short note: **"Demo Mode: Company intel generated heuristically."**
  - A **Company intel** card with:
    - **Company** name
    - **Industry** (e.g. Technology Services, or Financial Services if JD mentions finance)
    - **Estimated size**: e.g. **Startup (&lt;200)** for unknown companies, **Enterprise (2000+)** for known ones (Amazon, Infosys, TCS, Wipro, Microsoft, Google, etc.)
    - **Typical hiring focus**: for Enterprise → structured DSA + core fundamentals; for Startup → practical problem-solving + stack depth
- If **no company** is provided, the Company intel card and demo note do **not** appear (round mapping still appears).

### Round mapping changes with company + skills

- **Enterprise + DSA/Core CS detected:**  
  Run Analyze with **Company:** `Infosys` (or `TCS`, `Wipro`) and a JD that contains **DSA** (or Core CS keywords).  
  **Expected:** Round mapping shows 4 rounds: **Round 1: Online Test (DSA + Aptitude)**, **Round 2: Technical (DSA + Core CS)**, **Round 3: Tech + Projects**, **Round 4: HR**. Each round has a **"Why this round matters"** line under it.

- **Startup + React/Node (Web) detected:**  
  Run Analyze with **Company:** `My Startup` and a JD that contains **React**, **Node.js** (and no/little DSA).  
  **Expected:** Round mapping shows 3 rounds: **Round 1: Practical coding**, **Round 2: System discussion**, **Round 3: Culture fit**, each with a short explanation.

- **Startup + no Web:**  
  Company: any unknown name, JD with only **DSA** or **Java**.  
  **Expected:** 3 rounds: Coding/Problem-solving, Technical deep dive, Culture fit.

### Test scenario examples

| Scenario              | Company   | JD contains        | Expected size   | Expected round flow                          |
|-----------------------|-----------|--------------------|-----------------|----------------------------------------------|
| Big tech + DSA        | Infosys   | DSA, Java, SQL     | Enterprise      | R1 Online Test, R2 Technical, R3 Tech+Projects, R4 HR |
| Big tech + generic    | Amazon    | Python, AWS        | Enterprise      | R1 Online Test, R2 Technical, R3 Tech+Projects, R4 HR |
| Unknown + Web        | Tech Corp | React, Node.js     | Startup         | R1 Practical coding, R2 System discussion, R3 Culture fit |
| Unknown + DSA only    | Acme Inc  | DSA, OOP           | Startup         | R1 Coding, R2 Technical deep dive, R3 Culture fit |

### Persistence

- Company intel and round mapping are stored in the **history entry** (on Analyze and when backfilled for old entries). Reopening the same result from **History** shows the same Company intel and round mapping without recomputing.

---

## 8. Data model, validation, and edge cases

### Schema consistency

- Every saved entry has: **id**, **createdAt**, **company** (string or ""), **role** (string or ""), **jdText**, **extractedSkills** (coreCS, languages, web, data, cloud, testing, other), **roundMapping** (roundTitle, focusAreas, whyItMatters), **checklist** (roundTitle, items), **plan7Days** (day, focus, tasks), **questions**, **baseScore**, **skillConfidenceMap**, **finalScore**, **updatedAt**.
- **baseScore** is set only at analyze time and never changed by toggles.
- **finalScore** is updated only when the user changes skill confidence; it is recomputed from baseScore + skill toggles and persisted with **updatedAt**.

### Input validation (Analyze)

- **JD required:** Submit with empty JD is disabled (button disabled when JD is empty).
- **JD &lt; 200 characters:** A calm warning appears below the textarea: *"This JD is too short to analyze deeply. Paste full JD for better output."* Submit is still allowed.
- **Company** and **Role** remain optional.

### Default when no skills detected

- If extraction finds no category keywords, **extractedSkills.other** is set to: Communication, Problem solving, Basic coding, Projects. Plan, checklist, and questions still reflect a general-fresher style.

### Score stability

- On **Results**, change some skills to "I know" / "Need practice". The displayed score (and circle) updates immediately.
- Refresh the page or reopen from **History**: the same **finalScore** and toggles appear (persisted in the entry).

### History robustness (corrupted entry)

- If **localStorage** contains an entry that cannot be parsed or migrated (e.g. manually corrupted JSON), **History** skips it and shows: *"One saved entry couldn't be loaded. Create a new analysis."*
- Valid entries still list and open normally.

### Edge-case verification steps

| Step | Action | Expected |
|------|--------|----------|
| Short JD | Paste &lt; 200 chars, click Analyze | Warning shown; analysis runs; entry saved. |
| Empty JD | Leave JD empty | Analyze button disabled. |
| No skills | JD: "Hiring fresher." | Results show General: Communication, Problem solving, Basic coding, Projects. |
| Toggle + refresh | Toggle skills on Results, then F5 | Same toggles and score after reload. |
| Corrupted storage | In DevTools → Application → Local Storage, change `placement_prep_history` to invalid JSON or remove required fields from one item, reload History | Message "One saved entry couldn't be loaded..."; other entries still work. |

---

## 9. Test checklist and Ship lock

### Checklist stored in localStorage and persists

- Open **/prp/07-test**. Check a few items (e.g. first two).
- Refresh the page (F5). The same items should still be checked.
- Close the tab, open **/prp/07-test** again. Checkboxes should match (data is in `placement_prep_test_checklist` in localStorage).

### Ship is locked until checklist complete

- With fewer than 10 items checked, open **/prp/08-ship**. You should see **"Ship locked"** and a prompt to complete the Test checklist. The **"Open Test checklist"** link goes to **/prp/07-test**.
- Go to **/prp/07-test**, check **all 10** items, then click **"Go to Ship"** (or navigate to **/prp/08-ship**). You should see **"Ready to ship"** and the unlocked content.

### Reset checklist

- On **/prp/07-test**, click **"Reset checklist"**. All checkboxes should clear and **Tests Passed: 0 / 10** should show. **/prp/08-ship** should show locked again.

### Verification steps

| Step | Action | Expected |
|------|--------|----------|
| Summary | Open /prp/07-test | "Tests Passed: X / 10" at top; if X &lt; 10, warning "Fix issues before shipping." |
| Persist | Check 2 items, refresh | Same 2 items still checked. |
| Lock | Open /prp/08-ship with &lt; 10 passed | "Ship locked" and link to Test checklist. |
| Unlock | Check all 10, go to Ship | "Ready to ship" content. |
| Reset | Click Reset checklist | All unchecked; Ship locked again. |

---

## 10. Proof + submission

### Proof page (/prp/proof)

- **Step completion overview:** 8 steps with Completed / Pending toggles. Steps 1–8 are stored in `prp_proof_steps` in localStorage.
- **Artifact inputs:** Lovable Project Link, GitHub Repository Link, Deployed URL. Each requires a valid http(s) URL; invalid or non-URL text shows an error after blur. Values stored in `prp_final_submission` in localStorage.
- **Copy Final Submission:** Button copies the formatted block (dashes, title, three links, Core Capabilities list). Paste into a text editor to confirm.

### URL validation

- Enter a non-URL (e.g. `abc`) and blur: "Enter a valid http or https URL." appears and the field can show error styling.
- Enter `https://example.com`: no error. Links are saved so status can use them.

### Shipped status rule

- **Status = Shipped** only when: (1) all 8 steps marked Completed, (2) all 10 test checklist items passed, (3) all 3 proof links valid. Otherwise status stays **In Progress** (on Proof) or **Ready to ship** (on Ship).
- Checklist lock is not bypassed: Ship page stays locked until all 10 tests are passed; Shipped badge and completion message appear only when the above three conditions are met.

### Completion message

- When status is Shipped (on Proof or Ship), the completion message is shown: *"You built a real product. Not a tutorial. Not a clone. A structured tool that solves a real problem. This is your proof of work."*

### Verification steps

| Step | Action | Expected |
|------|--------|----------|
| Proof page | Open /prp/proof | Step overview (8 steps), 3 artifact inputs, Copy Final Submission button, Status badge. |
| URL validation | Enter `not-a-url`, blur | Error message; status does not become Shipped. |
| Valid URLs | Enter 3 valid https URLs, mark all 8 steps, ensure 10/10 test checklist passed | Status: Shipped; completion message appears. |
| Copy export | Click Copy Final Submission, paste elsewhere | Formatted text with Lovable, GitHub, Live Deployment, Core Capabilities list. |
| Ship + Shipped | With all conditions met, open /prp/08-ship | "Status: Shipped" and completion message. |
| Persist | Fill links and steps, refresh /prp/proof | Same links and step toggles (localStorage). |

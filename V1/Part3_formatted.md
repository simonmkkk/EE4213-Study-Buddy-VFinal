# 3. Validation

## 3.1 Usability Testing Methodology

### Test Objectives

#### Validate 4 Core Features
- Overseas Exchange
- Job Information
- Focus Learning
- Community

#### Check the Usability of the 4 Core Features
- Time to complete a task
- Time spent on errors
- Error rate & recovery speed

#### Ensuring User Experience & Satisfaction
- User satisfaction questionnaires & interviews are used to get users' real opinions

### Test Participants

#### User A
- 19-year-old female, EE Year-2, local HK
- Phone addict (5 hours social media/day)
- Super excited about studying abroad but drowned in 20 tabs
- Matches "easily distracted + hopes to study abroad, but too much info online"
- **Tested:** Overseas Exchange & Community

#### User B
- 22-year-old female, Psychology Year-4, local HK
- Writes paper diary every night
- Feels lost about future job, wants real friends & a safe internship
- Matches "emotional fatigue, hope to make friends + find a suitable internship"
- **Tested:** Job Information & Focus Learning

#### User C
- 20-year-old male, CS Year-2, non-local
- 2.9 GPA, panics about credit delay
- Jumps between 5 apps just to study & talk
- Hybrid of both personas, wants one place to focus
- **Tested:** Focus Learning & Community

### Test Tasks

| Task | Main Instruction (read aloud) | Specific Follow-up Questions |
|------|------------------------------|------------------------------|
| **Task 1** | Use the Study Buddy website to see whether you can spend one semester in Singapore with Business courses that count back home. When you know the answer, tell me. | 1. Was anything inconvenient while checking the credits?<br>2. What would you change so it feels easier next time?<br>3. On a 1–5 scale, how satisfied are you with this feature? |
| **Task 2** | Try to leave a comment on University of Tokyo and rate it 4 stars | |
| **Task 3** | Use the Study Buddy website to find one 2024 summer internship that accepts Year-2 students. Bookmark it and say the company name. | 1. Did anything feel annoying or slow?<br>2. How could we satisfy your needs better?<br>3. 1–5 satisfaction? |
| **Task 4** | Use the Study Buddy website to start a 5 mins focus session. Lock your phone and show me your streak badge when it ends. | 1. Any inconvenience with locking the phone?<br>2. What small change would make you love it?<br>3. 1–5 satisfaction? |
| **Task 5** | Use the Emotion Center to vent "I am so stressful". And try to leave a comment on other's post. | |
| **Task 6** | Use the Soul Match to match someone who is interested in sport and try to say hi, then exit safely. Tell me how you ended it. | 1. Did you feel uncomfortable at any step?<br>2. What would make you feel 100% safe?<br>3. 1–5 satisfaction? |

### Test Procedure
[Describe the steps of the testing session.]

### Data Collection Methods
[Explain how data was collected (e.g., observation, recording, notes).]

---

## 3.2 User Feedback Analysis and Key Insights

### Key Finding 1: No back button after selecting a university
- **Evidence:** User A, after viewing ETH Zurich, moved the mouse frantically: "I want to go back to see other schools but how do I return?"
- **Insight:** Lack of a clear navigation fallback causes users to feel "lost," breaking consistency with their mental model of web browsing.

### Key Finding 2: Want to type to search country, major, and school
- **Evidence:** User A tried typing "NUS" in the filter: "Can I just type the school name? It'd be much faster."
- **Insight:** Users strongly prefer free-text search over dropdown-only filters, revealing a critical need for input flexibility.

### Key Finding 3: Confusion over the review count icon
- **Evidence:** User A pointed at the icon: "Does this mean how many people wrote reviews? Or viewed them?"
- **Insight:** Ambiguous icon semantics violate matching mental models — replace with clear text labels to improve recognition.

### Key Finding 4: Cannot edit submitted reviews
- **Evidence:** User C after posting a review: "Can I edit it?"
- **Insight:** Users need error correction control, especially in emotional expression contexts — without it, trust and satisfaction drop.

### Key Finding 5: Community pages have too much information; comments should be on a separate page
- **Evidence:** User C scrolled slowly: "There's so much text… I just want to see other post."
- **Insight:** Information overload breaks Gestalt proximity — moving comments to a dedicated page reduces clutter and improves focus.

### Key Finding 6: No drop-down list for users to choose their desirable focus time
- **Evidence:** User B stared at the timer: "I want 45 minutes, not just 25 how do I change it?"
- **Insight:** Fixed timer options create rigid user control, violating flexibility in mental models.

### Key Finding 7: School comment button is too small and hard to locate
- **Evidence:** By our inspection, users spent too long time to locate the comment button in the Visual School Explorer. Users needed to search on the school card to find the small-sized "View Comments" button.
- **Insight:** Small button size reduces visibility and violates visual hierarchy principles, increasing interaction cost and user search time.

### Key Finding 8: Job Opportunity Discovery Hub tags (e.g., AI, Cloud, Finance) exist but cannot be used to search for specific tags
- **Evidence:** User B: "There's no search bar for me to search specific Intern?"
- **Insight:** Tags create false affordance without search functionality, frustrating users' mental model of filterable discovery.

### Summary of Results
The usability test with 3 participants revealed 8 key findings across the Visual School Explorer, Syllabus Auto-Matcher, Community, Focus Learning, and Job Opportunity Discovery Hub, highlighting issues in navigation, search flexibility, information overload, and interactivity. The findings underscore the need for better mental model alignment and reduced cognitive load, directly impacting the personas' academic stress and emotional needs.

---

## 3.3 Before-and-After Comparisons

### Change 1: Added a Back Button in Visual School Explorer After School Selection

#### Before:
- **[Insert screenshot: Visual School Explorer grid with no navigation bar; user stuck on ETH Zurich card, no return path visible]**
- **Problem:** Users felt "lost" without a clear way to return to the school list, causing frantic mouse movements and breaking web browsing mental models.

#### After:
- **[Insert screenshot: Visual School Explorer with a prominent "Back to Schools" button in the top-right corner, next to the ETH Zurich card, with a left arrow icon]**
- **Rationale:** This adds a consistent navigation fallback, reducing cognitive load and aligning with users' expectations for reversible actions.

---

### Change 2: Implemented Free-Text Search for Country, Major, and School in Visual School Explorer

#### Before:
- **[Insert screenshot: Dropdown-only filters for Country and Program, with User B attempting to type "NUS" but unable to; no search bar visible]**
- **Problem:** Dropdown limitations frustrated users seeking specific inputs. User B noted "It'd be much faster" (post-task interview), highlighting a lack of input flexibility.

#### After:
- **[Insert screenshot: Added a search bar above filters, with "NUS" typed and results filtering the grid to show only matching schools; dropdowns still available]**
- **Rationale:** Free-text search enhances discoverability and matches user mental models of efficient querying, reducing task time.

---

### Change 3: Replaced Ambiguous Review Count Icon with Clear Text Labels

#### Before:
- **[School card with a vague icon (e.g., figure with number "2"), User A pointing confusedly: "Reviews or views?"; no text explanation]**
- **Problem:** The icon's ambiguity caused confusion, leading to misinterpretation and eroding trust.

#### After:
- **[Insert screenshot: School card with "2 Reviews" text label next to a speech bubble icon, with tooltip on hover: "Number of student reviews"]**
- **Rationale:** Text labels improve semantic clarity and accessibility, aligning with Gestalt recognition rules to boost comprehension for empathetic users.

---

### Change 4: Enabled Review Editing and Deletion

#### Before:
- **[Insert screenshot of the feature before the change]**
- **Problem:** No correction mechanism caused emotional suppression and lower satisfaction, amplifying trust issues in sharing spaces.

#### After:
- **[Insert screenshot of the feature after the change]**
- **Rationale:** Deletion empowers users to refine or remove emotional content at any time without fear, enhancing trust and aligning with emotional needs, while maintaining a clean space for authentic sharing.

---

### Change 5: Moved Community Comments to a Dedicated Page

#### Before:
- **[Insert screenshot of the feature before the change]**
- **Problem:** Inline comments created visual clutter and increased scrolling fatigue, breaking Gestalt proximity and overwhelming users with mixed content.

#### After:
- **[Insert screenshot of the feature after the change]**
- **Rationale:** Separating comments reduces information overload and improves focus, following chunking techniques to ease navigation, allowing users to engage deeply without losing the main feed context.

---

### Change 6: Added Drop-Down List for Custom Focus Time in Focus Learning

#### Before:
- **[Insert screenshot of the feature before the change]**
- **Problem:** Rigid timer options limited personalization, causing frustration and disengagement for users with varying study habits.

#### After:
- **[Insert screenshot of the feature after the change]**
- **Rationale:** Flexible options align with user mental models of customizable tools, reducing rigidity, enhancing perceived control and session effectiveness.

---

### Functionality and Usability of the Second Version Prototype
[Summarize the overall improvements in the second version.]

---

## 3.4 Documentation of AI Usage

### AI Tools Used
[e.g., ChatGPT, Midjourney]

### Purpose
[e.g., generating test scripts, analyzing feedback]

### Prompts Used
**Prompt 1:** [Paste your full prompt here]

### Modifications to AI Output
[Describe the adjustments you made.]

### Rationale for Modifications
[Explain why the changes were necessary.]

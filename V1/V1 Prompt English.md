# V1 Improvement Prompt - 6 Core Changes

## Project Goals and Version Description

### Goals
This document records the 6 core improvements to be implemented based on usability testing results. We will create two separate GitHub versions:

- **V1 Version (Before)**: The original version used during usability testing, containing all identified usability issues
- **V2 Version (After)**: The improved version implementing all 6 core changes to address user feedback issues

### Workflow
1. **Current State**: The codebase is currently in the improved state (V2)
2. **Task 1**: Revert code to V1 version based on "Before" descriptions, commit to GitHub as V1 release
3. **Task 2**: Change code back to improved state (V2), commit to GitHub as V2 release
4. **Purpose**: Clearly demonstrate the before-and-after comparison for project reports and validation

### Scope of Improvements
The 8 core improvements cover the following functional modules:
- **Overseas Exchange Module**: Changes 1, 2, 3 (Visual School Explorer)
- **Community Module**: Changes 4, 5 (Comment Features)
- **Focus Learning Module**: Change 6 (Timer Customization)
- **Job Information Module**: Changes 7, 8 (Career Journey Overview & Job Discovery Hub)

---

## Change 1: Added Back Buttons in All Navigable Areas

### V1 Version (Before - State During Usability Testing):
- Visual School Explorer grid has no navigation bar
- Users get stuck on school cards after selection with no visible return path
- Other deep-dive pages (e.g., comment details, job details) also lack clear back buttons
- **Problem:** Users felt "lost" without a clear way to return to the previous level, causing frantic mouse movements and breaking web browsing mental models. The lack of consistent back navigation reduced overall usability

### V2 Version (After - Improved State):
- Added back buttons uniformly in all navigable areas
- **Overseas Exchange Module**:
  - Visual School Explorer: "Back to Schools" button appears in top-right corner after school selection, returns to school list
  - Syllabus Auto Matcher: "Back" button added to return to Visual School Explorer or Overseas Exchange main page
- **Community Module**:
  - Academic Wall: "Back" button added after course selection, returns to course list
  - Emotion Center: "Back" button added when viewing comments, returns to main feed
  - Kept Chats: "Back" button already implemented, returns to Soul Match (✓ Implemented)
- **Job Information Module**:
  - Saved Jobs: "Back" button added to return to Career Dashboard or Job Information main page
  - Saved Resources: "Back" button added to return to Career Dashboard or Job Information main page
  - Job Opportunity Hub: "Back" button added when viewing job details, returns to job list
  - Resources: "Back" button added when viewing resource details, returns to resource list
  - Applied Jobs: "Back" button added to return to Career Dashboard or Job Information main page
- **Focus Learning Module**:
  - Focus Mode Dashboard: "Back" button added after entering focus session, returns to dashboard
  - Micro Goal Tracker: "Back" button added to return to Focus Learning main page
- **Design Guidelines**:
  - All back buttons use consistent design style with left arrow icon (ArrowLeft component)
  - Back buttons uniformly placed in top-left corner or next to title for visual consistency
- **Rationale:** Adding consistent navigation fallback in all necessary areas significantly reduces cognitive load, establishes a unified navigation pattern, aligns with users' expectations for reversible actions, and enhances overall application usability and user experience

---

## Change 2: Implemented Free-Text Search Functionality Across All List Pages

### V1 Version (Before - State During Usability Testing):
- Only dropdown filters for Country and Program
- Users attempted to type school names but were unable to
- No visible search bar
- **Existing Search Features to Remove**:
  - Job Opportunity Hub: Has search bar, needs removal
  - Resources: Has search bar, needs removal
  - Academic Wall: Has search bar, needs removal
- **Problem:** Dropdown limitations frustrated users seeking specific inputs. Users noted "It'd be much faster," highlighting a lack of input flexibility. V1 version should only have basic dropdown filters with no search functionality

### V2 Version (After - Improved State):
- Added free-text search functionality uniformly across all list and discovery pages
- **Overseas Exchange Module**:
  - Visual School Explorer: Added search bar above filters to search by country, major, or school name
  - Syllabus Auto Matcher: Added course search bar to search by course code or name
- **Community Module**:
  - Academic Wall: Added course search bar to search by course code or name (re-implemented)
  - Emotion Center: Added post search bar to search by tags or content keywords
  - Kept Chats: Added chat search bar to search by matched user name or topics
- **Job Information Module**:
  - Job Opportunity Hub: Added job search bar to search by company name, position, or skill tags (re-implemented)
  - Resources: Added resource search bar to search by resource name, category, or tags (re-implemented)
  - Saved Jobs: Added search bar to quickly filter saved jobs
  - Saved Resources: Added search bar to quickly filter saved resources
  - Applied Jobs: Added search bar to search applied jobs by company or position
- **Focus Learning Module**:
  - Micro Goal Tracker: Added goal search bar to search by goal name or tags
- **Design Guidelines**:
  - All search bars use consistent design and placement (top filter area of pages)
  - Real-time search without clicking search button
  - Supports partial matching and case-insensitive search
  - Search icon provides visual cue
  - Clear placeholder text describing searchable content
  - Dropdown menus still available as alternative filtering options
- **Rationale:** Free-text search enhances discoverability and matches user mental models of efficient querying, significantly reducing task time. Uniform implementation of search across all list pages establishes consistent user experience

---

## Change 3: Replaced Ambiguous Review Count Icon with Clear Text Labels

### Current Version Status:
- **File Location:** `src/pages/overseas-exchange/VisualSchoolExplorer.tsx`
- **Current Implementation:** School cards display comment count using a person icon (👤) with a number
- **Specific Code:**
  ```tsx
  <button className="flex items-center gap-1 text-sm text-muted-foreground">
    <span role="img" aria-label="people">👤</span>
    <span>{commentDisplayCount}</span>
  </button>
  ```

### Operations Required for V1 (Before - Usability Testing State):
**Goal:** Maintain ambiguous icon display to demonstrate the problem state

**Steps:**
1. **Keep the current person icon (👤)**: No modifications needed
2. **Ensure no text labels**: Display only the icon and number
3. **Remove any tooltips or explanatory text**: Allow users to be confused "Is this reviews or view count?"

**Expected Result:**
- School cards show only ambiguous person icon + number
- No explanatory text or tooltips
- Users will be confused, uncertain what the number represents

### Operations Required for V2 (After - Improved State):
**Goal:** Replace ambiguous icon with clear text label

**Steps:**
1. **Replace person icon with message icon**: Change 👤 emoji to `<MessageSquare>` icon
2. **Add text label**: Change `{commentDisplayCount}` to `{commentDisplayCount} Reviews`
3. **Add tooltip**: Wrap with Tooltip component, displaying "Number of student reviews"
4. **Improved Code:**
   ```tsx
   <Tooltip>
     <TooltipTrigger asChild>
       <button className="flex items-center gap-2 text-sm text-muted-foreground">
         <MessageSquare className="h-4 w-4" />
         <span>{commentDisplayCount} Reviews</span>
       </button>
     </TooltipTrigger>
     <TooltipContent>Number of student reviews</TooltipContent>
   </Tooltip>
   ```

**Design Guidelines:**
- Use message icon (MessageSquare) to clearly indicate reviews
- Text label uses "X Reviews" format
- Display tooltip on hover
- Maintain consistency with existing design system styling

**Rationale:** Text labels improve semantic clarity and accessibility, aligning with Gestalt recognition rules to boost user comprehension and eliminate the "Is this reviews or view count?" confusion

---

## Change 4: Enabled Review Editing and Deletion

### V1 Version (Before - State During Usability Testing):
- Users cannot edit or delete reviews after submission
- No correction mechanism
- **Problem:** Lack of correction mechanism caused emotional suppression and lower satisfaction, amplifying trust issues in sharing spaces

### V2 Version (After - Improved State):
- Users can edit submitted reviews
- Users can delete their own reviews
- Clear edit and delete buttons provided
- **Rationale:** Deletion and editing empower users to refine or remove emotional content at any time without fear, enhancing trust and aligning with emotional needs, while maintaining a clean space for authentic sharing

---

## Change 5: Moved Community Comments to a Dedicated Page

### V1 Version (Before - State During Usability Testing):
- Comments displayed directly in the main community feed (inline display)
- Creates visual clutter
- Increases scrolling fatigue
- **Problem:** Inline comments created visual clutter and increased scrolling fatigue, breaking Gestalt proximity and overwhelming users with mixed content. Users stated "There's so much text... I just want to see other posts"

### V2 Version (After - Improved State):
- Comments moved to a dedicated separate page
- Main feed only shows post summaries and "View Comments" button
- Clicking enters dedicated comment page
- **Rationale:** Separating comments reduces information overload and improves focus, following chunking techniques to ease navigation, allowing users to engage deeply without losing the main feed context

---

## Change 6: Added Drop-Down List for Custom Focus Time in Focus Learning

### V1 Version (Before - State During Usability Testing):
- Fixed timer options (e.g., only 25 minutes)
- Users cannot choose their desired focus time
- **Problem:** Rigid timer options limited personalization, causing frustration and disengagement for users with varying study habits. Users stated "I want 45 minutes, not just 25, how do I change it?"

### V2 Version (After - Improved State):
- Provides drop-down list for users to select focus time
- Includes multiple time options (e.g., 15, 25, 45, 60 minutes)
- Users can choose suitable duration based on their needs
- **Rationale:** Flexible options align with user mental models of customizable tools, reducing rigidity, enhancing perceived control and session effectiveness

---

## Change 7: Standardized Progress Bar Colors and Added Tooltips in Career Journey Overview

### V1 Version (Before - State During Usability Testing):
- Progress bars use inconsistent colors (Profile in blue, Success in orange)
- Metrics undefined with no explanation (e.g., "Success" at 40%)
- Users confused about their status
- **Problem:** Unspecified colors and undefined metrics violate visual hierarchy principles, increasing cognitive load. User B stated "Why is Profile blue and Success orange? Is 40% bad? What does 'success' even mean?"

### V2 Version (After - Improved State):
- Standardized progress bar color system
- Added clear tooltip explanations for each metric
- Provided contextual explanations for progress percentages
- **Rationale:** Standardized visuals and explanations follow visual hierarchy rules, clarifying status to reduce career uncertainty, boosting motivation and trust in the tool

---

## Change 8: Added Search Bar for Job Tags in Job Opportunity Discovery Hub

### V1 Version (Before - State During Usability Testing):
- Job tags displayed (e.g., AI, Cloud, Finance) but not searchable
- Tags cannot be used to filter specific interests
- Missing search functionality
- **Problem:** Tags create false affordance without search functionality, frustrating users' mental model of filterable discovery. User B stated "There's no search bar for me to search specific Intern?"

### V2 Version (After - Improved State):
- Added tag search bar functionality
- Users can click tags or type keywords to filter
- Supports multi-tag combination search
- **Rationale:** Enabling tag-based search fulfills user intent for flexible discovery, reducing frustration and improving job opportunity discoverability

---

## Summary

These 8 core improvements target key issues found in usability testing:

### Improvement Mapping
1. **Navigation Issues** → Change 1: Added Back Button
2. **Search Flexibility** → Change 2: Implemented Free-Text Search
3. **Information Clarity** → Change 3: Changed to Text Labels
4. **User Control** → Change 4: Enabled Edit/Delete Functions
5. **Information Architecture** → Change 5: Separated Comments to Dedicated Page
6. **Personalization Needs** → Change 6: Provided Time Customization Options
7. **Visual Consistency** → Change 7: Standardized Progress Bar Colors and Metric Explanations
8. **Search Functionality** → Change 8: Added Job Tag Search Bar

### Affected Functional Modules
- **Overseas Exchange**: Changes 1, 2, 3
- **Community**: Changes 4, 5
- **Focus Learning**: Change 6
- **Job Information**: Changes 7, 8

### Implementation Strategy
All improvements are based on real user testing feedback, aiming to:
- Reduce cognitive load
- Enhance user sense of control
- Improve overall user experience
- Increase functionality usability and satisfaction


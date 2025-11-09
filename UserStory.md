Breakdown of product features:
Theme1: Oversea Exchange Module
	epic1: School Discovery & Information
Description: A comprehensive, filterable directory of international exchange partner universities with rich, interactive school cards.
story1: As a student, I want to filter and search for exchange schools so that I can easily find options that match my criteria.
o	Task 1: Implement Multi-criteria filtering.
o	Task 2: Ensure Real-time filter updates without page reload.
o	Task 3: Develop Responsive grid layout.
o	Task 4: Add Dropdown selects for country and program filters.
o	Task 5: Ensure Filter state persists during navigation.
story2: As a student, I want to see essential school information at a glance via visual elements so that I can quickly compare options.
Task 1: Create prominent Location Badge with country flag emoji and backdrop blur.
o	Task 2: Display Quick Stats Grid.
o	Task 3: Add Program Badge highlighting the major or program area.
story3: As a student, I want to see engaging visual elements, like interactive images, so that the discovery process is appealing and intuitive. (Split from original Story 2 Tasks)
o	Task 1: Implement Hero Image Display with smooth scale animation on hover.
	epic2: Credit Matching & Validation
Description: Allows students to match home university courses to exchange school courses for credit transfer eligibility.
story4: As a planning student, I want to input my home university course details so that I can check their transfer eligibility to an exchange university.
o	Task 1: Create input form for Home University Course details.
o	Task 2: Develop logic to process and display an overall match or not match indicator for eligibility.
story5: As a worried student, I want to see required transfer text and keyword tags so that I understand why a course transfers.
o	Task 1: Show orange tags on eligible cards.
o	Task 2: Display text: 'Matches home university requirements'.
story6: As a student, I want to see a Confidence level for the course match so that I trust the eligibility result. (Split from original Story 4 Tasks)
o	Task 1: Display Confidence level.
	epic3: Integrated Review and Validation
Description: Connects discovery, reviews, and matching for holistic validation, including student feedback and cross-feature links.
story7: As Sarah reading reviews, I want a modal with student feedback so that I can assess real experiences before matching credits.
o	Task 1: Add 'View Comments' button on the school card.
o	Task 2: Implement a modal that shows $1-2$ reviews
o	Task 3: Ensure reviews are Sorted newest first and are scrollable.
story8: As Sarah contributing, I want to write my own reviews so that I help future students post-exchange.
o	Task 1: Implement a "Write a Review" button that opens the form in the modal.
o	Task 2: Develop the form with a 5-star selector and text area.
story9: As a multi-tasker, I want links from explorer to matcher so that I validate credits directly from a school card.
o	Task 1: Add a card button 'Check Courses' that pre-fills the matcher.
o	Task 2: Ensure a smooth transition.

Theme2: Job Information Center
	epic1: Career Progress Dashboard
Description: Central hub for tracking job application progress, key metrics, and personalized actions.
story1: As a student, I want to toggle KPIs/analytics between different time windows so that I can control the scope of my data view.
o	Task 1: Implement a toggle switch for time windows.
o	Task 2: Ensure the last selected time window setting persists.
o	Task 3: Compute and display micro-metrics.
story2: As a user, I want to see actionable nudges with a 1-click Call-to-Action so that I am guided to prioritize my next actions.
o	Task 1: Develop logic to surface $1-2$ actionable goal nudges.
o	Task 2: Implement a 1-click CTA opening the exact filtered job list.
story3: As a student, I want to see conversion rates with quick links to the items in each stage, so that I can diagnose bottlenecks and prioritize my next actions.
o	Task 1: Calculate and display conversion rates.
o	Task 2: Add quick links to the job items in each stage of the funnel.
o	Task 3: Display a funnel mini-chart showing counts across application stages.
	epic2: Job Opportunity Discovery Hub
Description: Advanced search and management system for finding, saving, and organizing job postings.
story4: As a job seeker, I want to save my current filters and re-apply them with one click, so that I can resume targeted searches instantly.
o	Task 1: Implement a feature to save current filter criteria as a preset.
o	Task 2: Create a 1-click mechanism to re-apply any saved filter preset.
story5: As an applicant, I want to add personal notes and see an activity timeline, so that all job-specific context stays in one place.
o	Task 1: Develop a personal notes text area per job posting.
o	Task 2: Implement an activity logging and display system for status changes and reminders.
story6: As a power user, I want to select multiple postings and perform bulk actions, so that I can manage a large pipeline efficiently.
o	Task 1: Implement multi-select functionality for job postings.
o	Task 2: Develop bulk action endpoints for Save, Unsave, and Set Status updates.
	epic3: Skill Mapping & Gap Analysis
Description: A tool to compare current skills against job requirements and analyze skill development gaps.
story7: As a student, I want to compare up to three target roles side-by-side so that I can decide which path is quickest to prepare for.
o	Task 1: Design the user interface for side-by-side comparison of up to three roles.
o	Task 2: Implement the logic to show the match percentage and top skill gaps for each role.
story8: As a learner, I want to simulate raising a skill level and see the projected match % before studying, so that I can choose the highest-impact modules first.
o	Task 1: Create a simulation interface for adjusting skill levels.
o	Task 2: Implement dynamic calculation of projected match percentage based on the simulation.
story9: As a candidate, I want to export a concise report that includes evidence links, so that I can share a proof-backed profile with applications.
o	Task 1: Develop the report generation logic (PDF or DOCX format).
o	Task 2: Ensure the report includes match %, top skills, and evidence links.

Theme3: Focus learning Module
	epic1: Core Focus Mode & UI/UX
Description: Establishes the primary environment for concentration, focusing on the timer, a clean layout, and session feedback.
story1: As a user, I want a minimalist timer and feedback system so that I can maintain concentration during a session.
o	Task 1: Implement a large numeric countdown (25:00 default) with Start / Pause / Reset buttons.
o	Task 2: Design a centered layout focused on the timer with minimal surrounding elements for calmness.
o	Task 3: Implement a soft animation or gentle chime when the timer hits 0.
o	Task 4: Display one random short motivational quote per session.
story2: As a user, I want a visually calming interface with smooth behaviors so that distractions are minimized.
o	Task 1: Use a calm minimal design theme (light blue / white gradient background, glass-frosted surface, smooth shadows).
o	Task 2: Implement hover states and click animations for buttons.
o	Task 3: Add a circular progress animation that subtly fills during the countdown.
o	Task 4: Ensure the timer is centered on desktop and scales proportionally on mobile.
story3: As a user, I want quick shortcuts for essential session settings so that I can easily customize the experience. (Moved from original Epic 2)
o	Task 1: Implement a Daily streak counter.
o	Task 2: Implement a sound toggle feature.
o	Task 3: Implement a dark mode switch option.
	epic2: Session Tracking and Persistence
Description: Enables users to track progress and ensures that crucial data and personalized settings are reliably saved across sessions.
story4: As a motivated user, I want the system to remember my progress so that I don’t lose my work when closing the browser.
o	Task 1: Store session progress data in local storage.
o	Task 2: Ensure that reopening the application shows the last known list and progress.
story5: As a power user, I want an intentional way to clear my session data so that I can reset my progress when needed. (Split from original Story 3 Tasks)
o	Task 1: Implement a "Clear All" function to reset data intentionally.
story6: As a user, I want the system to remember my theme choice so that my visual comfort settings persist across sessions.
o	Task 1: Ensure theme preference is stored in local storage.
o	Task 2: Ensure the selected theme (light/dark) is loaded correctly upon app opening.
	epic3: Build a Mindful Learning Routine
Description: Promotes consistency and self-awareness by summarizing achievements, minimizing distractions, and offering personalization.
story7: As a student tracking performance, I want to view a summary of sessions completed each day so that I can review my study consistency.
o	Task 1: Implement a modal that appears after each session is complete.
o	Task 2: Display metrics for "Sessions completed today" and "Goals achieved."
o	Task 3: Include an optional motivational tip for the next session.
story8: As a distracted learner, I want a phone-lock suggestion before starting so that I reduce external distractions during study time.
o	Task 1: Implement a checkbox or popup that appears before the timer starts.
o	Task 2: Provide a "Don’t show again today” option within the reminder.
o	Task 3: Ensure responsive design for both mobile and desktop views.
story9: As a user sensitive to visual comfort, I want to switch between light and dark modes so that I can maintain focus under different lighting conditions.
o	Task 1: Implement a toggle button in the header or settings menu.
o	Task 2: Implement a smooth transition between light and dark modes.
o	Task 3: Ensure theme preference is stored in local storage.

Theme4: Community
	epic1: Emotion Center
Description: Provide an anonymous, warm community space where students can freely express their emotions and stories, building an emotional support network.
story1: As a university student, I want to anonymously post my emotions and personal stories so that I can freely express my feelings without revealing my real identity and receive understanding and support from peers.
o	Task 1: System automatically generates random anonymous identity.
o	Task 2: Users can write up to 500 characters.
o	Task 3: Users can upload up to 3 images.
o	Task 4: Users must select at least one topic tag.
o	Task 5: Privacy policy prompt is shown before publishing.
o	Task 6: Post immediately appears at the top of the feed after publishing.
story2: As a university student, I want to browse other students' emotional posts and filter by topic so that I can find people with similar feelings and realize I'm not alone.
o	Task 1: All topic posts are displayed by default.
o	Task 2: Horizontal scrollable topic tag bar.
o	Task 3: Support multi-tag combination filtering.
o	Task 4: Each tag displays the corresponding post count.
o	Task 5: Post list updates immediately after clicking a tag.
o	Task 6: Support infinite scroll to load more posts.
story3: As a university student, I want to express resonance, comment, share, or bookmark other people's posts so that the poster can feel supported and emotional connections can be built.
o	Task 1: Each post card provides interaction buttons.
o	Task 2: Resonance count updates immediately after clicking.
o	Task 3: Comment section expands when clicking comment button.
o	Task 4: Support anonymous replies.
o	Task 5: Support nested comments.
o	Task 6: Long press on post to bookmark, report, or block.
	epic2: Soul Match
Description: Provide anonymous one-on-one soul conversations, create genuine connections, and allow students to find understanding and support in a safe environment.
story4: As a university student, I want to quickly find a stranger willing to listen based on my current emotion and topics I want to discuss so that I can share my thoughts and feelings in an anonymous, safe environment and receive emotional support and understanding.
o	Task 1: First-time use displays feature guide.
o	Task 2: Provide emotion selector and topic tag selector.
o	Task 3: After clicking "Start Matching", enter waiting state with waiting animation.
o	Task 4: Timeout prompt displays after 60 seconds.
o	Task 5: After successful matching, automatically enter chat interface.
o	Task 6: Support real-time text message sending and receiving, display "typing..." status.
o	Task 7: Messages display as bubbles.
o	Task 8: Real-time sensitive word filtering.
story5: As a university student, I want clear time limits for chats and the ability to choose whether to continue contact, say goodbye forever, or report the other party at the end so that I can control chat duration and subsequent relationships, avoiding over-dependency or uncomfortable conversations.
o	Task 1: Each chat limited to 30 minutes, displays countdown timer.
o	Task 2: Time reminder displays in last 5 minutes.
o	Task 3: Provide "End Early" button.
o	Task 4: When time's up or either party ends, end options modal pops up.
o	Task 5: When selecting continue chat, displays "Waiting for response" status.
o	Task 6: All conversation records automatically deleted after 24 hours.
story6: As a university student, I want to immediately end conversations and report when encountering inappropriate content or harassment, and ensure my identity and conversation content are completely confidential so that I can protect my mental health and privacy safety, and use Soul Match in a secure environment.
o	Task 1: Provide red "Emergency End" button.
o	Task 2: After confirmation, immediately end conversation and ask if want to report.
o	Task 3: Provide report form and block function.
o	Task 4: System provides AI monitoring mechanism and mental health support resource links.
o	Task 5: Conversation records automatically deleted after 24 hours.
	epic3: Academic Wall
Description: A community-driven forum where students can share ideas, ask questions, and learn collaboratively.
story7: As a university student, I want to successfully share my ideas and view other comments in a working thread so that I can participate in the community discussion. (Core Posting/Viewing/Anonymity)
o	Task 1: User can post a comment successfully after entering text.
o	Task 2: User can view their own comment and others’ comments in chronological order.
o	Task 3: Anonymous posting option is available and clearly indicated.
story8: As a curious student, I want to receive rapid AI-generated responses to my questions so that I can get quick academic help and learn collaboratively. (AI Feature)
o	Task 1: AI-generated response appears within 1 second after posting a question.
story9: As a user, I want the system to be stable and easy to use across all devices so that I have a consistent and reliable experience. (UX/Validation)
o	Task 1: System prevents empty submissions and provides error messages for invalid input.
o	Task 2: Responsive design ensures proper display on mobile and desktop.

4.2 Product Backlog
Story Point:
Story	Story
Point	Effort	Complexity	Risk	Uncertainty
Theme 1: Oversea Exchange Module
story1 (Filtering/Search)	5	Medium-High	High	Medium	Low
story2 (Visual Elements/Stats)	2	Low	Low	Low	Low
story3 (Interactive Images)	1	Low	Low	Low	Low
story4 (Input/Match Indicator)	3	Medium	Medium	High
	Low

story5 (Match Text/Tags)	2	Low	Medium	Medium	Low
story6 (Confidence Level)	5	Medium-High	High	Medium	Medium-High
story7 (Read Reviews Modal)	3	Medium	Medium	Medium	Low
story8 (Write Reviews)	5	Medium-High	Medium-High	Medium-High	Low
story9 (Links to Matcher)	1	Low	Low	Low	Low
Theme 2: Job Information Center
story1 (Toggle KPIs)		Medium	Medium		
story2 (Actionable Nudges/CTA)					
story3 (Conversion Rates/Funnel)					
story4 (Saved Filter Presets)					
story5 (Notes & Timeline)					
story6 (Bulk Actions)					
story7 (Multi-role comparison)					
story8 (What-if simulation					
story9 (Recruiter-ready export)					
					
					
					
					
					
					








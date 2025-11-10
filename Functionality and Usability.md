# Functionality and Usability of Study Buddy Prototype (v1)

## Overview

The first version of the Study Buddy prototype is a multi-module web application that guides university students through exchange planning, career development, focused learning, and peer support. The app is built with React Router for navigation, TanStack Query for future data integrations, shared toast systems for feedback, and context-driven accessibility settings. Each module is backed by rich interaction patterns, placeholder datasets, and responsive layouts designed to validate concept usability with realistic scenarios.@src/App.tsx#1-183

## Global Application Shell

### Navigation Bar and Module Access

- Persistent top navigation with instant module switching (Overseas Exchange, Job Information, Focus Learning, Community) plus a branded home link for orientation.@src/components/Navigation.tsx#1-105
- Active route highlighting and hover animations communicate current context and affordance without disorienting the user.@src/components/Navigation.tsx#29-66
- Avatar menu scaffolds profile/settings/logout pathways, signalling future personalization features.@src/components/Navigation.tsx#90-102

### Accessibility and Personalization Aids

- Color vision mode selector (Default, Red-Green, Blue-Yellow) stored in localStorage. Selection updates a `data-color-vision` attribute, enabling theme-level adjustments without page reloads.@src/components/Navigation.tsx#15-88 @src/context/ColorVisionContext.tsx#1-56
- Back-to-top control appears after minimal scrolling, supporting long-form pages while preserving keyboard and screen-reader accessibility through ARIA labelling.@src/components/BackToTop.tsx#1-68

### Feedback and State Management

- Dual toast systems (Shadcn Toaster and Sonner) provide cohesive notification experiences while the TanStack Query client prepares the stack for server-driven data in later iterations.@src/App.tsx#1-183
- Full application is wrapped in `TooltipProvider`, standardizing tooltip behaviour where required.@src/App.tsx#1-183

## Landing Experience

- Hero section introduces the “Study Buddy” value proposition with direct CTAs to explore modules or join the community, ensuring immediate task initiation for new visitors.@src/pages/LandingPage.tsx#45-76
- Module preview cards summarize the four core areas using icons, colour-coded contexts, microcopy, and hover transitions that reinforce the product mental model.@src/pages/LandingPage.tsx#78-111

## Overseas Exchange Module

### Overseas Exchange Module Hub

- Module-level page introduces the exchange journey and surfaces feature cards (initially Visual School Explorer) that route deeper into tools with consistent card interactions (icon badges, hover lift, CTA buttons).@src/pages/OverseasExchange.tsx#6-50

### Visual School Explorer

- Dataset of global universities with majors, imagery, ratings, and peer reviews supports discovery across multiple academic interests.@src/pages/overseas-exchange/VisualSchoolExplorer.tsx#18-141
- Country and program filters (select inputs) compose to refine the card grid, enabling comparative browsing without page transitions.@src/pages/overseas-exchange/VisualSchoolExplorer.tsx#143-258
- Card interactions include:
  - Image fallback messaging when an asset fails, preserving layout.
  - Major badges for scannable curriculum insights.
  - Rating indicators and comment entry points that open a review dialog.
  - “View Comments” CTA that keeps context by stopping navigation propagation.
  - Navigation to the syllabus matcher with routed state containing school metadata.@src/pages/overseas-exchange/VisualSchoolExplorer.tsx#260-327 @src/pages/overseas-exchange/VisualSchoolExplorer.tsx#338-422
- Reviews dialog lists historic feedback, renders star ratings, and allows students to submit/edit their own reviews with validation (rating + content) and optimistic toasts for success/error messaging.@src/pages/overseas-exchange/VisualSchoolExplorer.tsx#338-422

### Syllabus Auto-Matcher

- Reads navigation state to preselect a school, ensuring a continuous flow from the explorer into detailed credit matching.@src/pages/overseas-exchange/SyllabusAutoMatcher.tsx#278-318
- Dual select controls (School, Major) adapt available options based on the current school, with automatic resets if an incompatible major is chosen.@src/pages/overseas-exchange/SyllabusAutoMatcher.tsx#269-308
- Statistics strip summarises total courses, transfer eligibility, and credit tallies, shown inline when context is provided or floated otherwise.@src/pages/overseas-exchange/SyllabusAutoMatcher.tsx#320-461
- Course list cards highlight transfer-ready matches (icon + accent colour) and render badges for key topics, aiding quick syllabus comparison. Non-transferable cases carry destructive cues to set expectations.@src/pages/overseas-exchange/SyllabusAutoMatcher.tsx#468-500
- “View School Comments” dialog surfaces curated testimonials for qualitative assurance.@src/pages/overseas-exchange/SyllabusAutoMatcher.tsx#503-538

## Job Information Module

### Job Information Module Hub

- Landing grid lists three value streams (Career Dashboard, Job Hub, Skill Mapping) with consistent card interactions and immediate navigation, supporting both exploratory and goal-driven entry.@src/pages/JobInformation.tsx#6-63

### Career Progress Dashboard

- Three KPI cards (saved jobs, bookmarked resources, applications) double as navigation and present quick stats to reinforce goal completion.@src/pages/job-information/CareerDashboard.tsx#8-67
- Progress analytics section visualizes profile, skills, and success metrics with progress bars for at-a-glance health checks.@src/pages/job-information/CareerDashboard.tsx#70-108
- Smart notifications embrace timeline alerts (deadlines, achievements) to maintain engagement without manual check-ins.@src/pages/job-information/CareerDashboard.tsx#110-128

### Job Opportunity Discovery Hub

- Filter controls (position type, location) narrow the dataset, demonstrating how students can tailor searches to geography or contract type.@src/pages/job-information/JobOpportunityHub.tsx#74-128
- Job cards reveal company, location, deadline, tags, and saved-state toggle. Expandable detail panels share descriptions, application tips, and external application button to encourage readiness.@src/pages/job-information/JobOpportunityHub.tsx#129-199
- Toasted feedback confirms saved job status, validating interactions during user testing.@src/pages/job-information/JobOpportunityHub.tsx#86-163

## Focus Learning Module

### Focus Learning Command Center

- Pomodoro-style timer supports start/pause/reset, preset durations, and live countdown text, with motivational quotes and wallpaper overlays creating ambience.@src/pages/FocusLearning.tsx#136-715
- Ambient sound panel manages multiple looped audio tracks (rain, forest, etc.), with mute toggles and state-aware labels (“Playing”, “Paused”).@src/pages/FocusLearning.tsx#213-570 @src/pages/FocusLearning.tsx#813-869
- Wallpaper selector toggles immersive backgrounds while maintaining readability via gradient overlays.@src/pages/FocusLearning.tsx#136-174 @src/pages/FocusLearning.tsx#872-907
- Fullscreen toggle, tracker collapse, and layout adjustments consider multi-monitor study setups.@src/pages/FocusLearning.tsx#142-809
- Integrated Micro Goal Study Tracker:
  - Create/edit/delete major and minor tasks with inline validation, input resets, and keyboard focus management.@src/pages/FocusLearning.tsx#243-395 @src/pages/FocusLearning.tsx#959-1181
  - Checkbox-driven progress cascades tasks to a “past tasks” archive, logging completion dates and providing reopen/delete controls with history adjustments.@src/pages/FocusLearning.tsx#463-488 @src/pages/FocusLearning.tsx#1218-1273
  - Last 7 days heatmap highlights daily completions, delivering lightweight analytics without leaving the page.@src/pages/FocusLearning.tsx#1277-1343
  - Toast-compatible patterns (disabled buttons, optimistic UI) ready the component for persistence.

### Focus Mode Dashboard

- Dedicated fullscreen experience with atmospheric background, timer, preset controls, and rotating motivational quotes to maintain focus continuity.@src/pages/focus-learning/FocusModeDashboard.tsx#16-186
- Utility prompts (Do Not Disturb reminder) encourage environmental readiness beyond the browser experience.@src/pages/focus-learning/FocusModeDashboard.tsx#170-180

### Micro-Goal Tracker Standalone View

- Separate page allows direct access to goal tracking with progress bars, goal cards (drag handle placeholder, checkboxes, undo chip), and sticky “Add goal” form.@src/pages/focus-learning/MicroGoalTracker.tsx#19-219
- Daily summary card surfaces planned vs. completed vs. spillover goals for quick retrospectives.@src/pages/focus-learning/MicroGoalTracker.tsx#221-240

## Community Module

### Community Module Hub

- Card-based overview introduces Academic Wall, Emotion Center, and Soul Match, reinforcing the social layer of the platform.@src/pages/Community.tsx#6-62

### Academic Wall

- Course list filtered by major and search, with active student counts to indicate community activity.@src/pages/community/AcademicWall.tsx#95-169 @src/pages/community/AcademicWall.tsx#195-252
- Course detail view provides AI-generated answers for new questions, encourages peer follow-ups through anonymous comments, and maintains discussion threads per question.@src/pages/community/AcademicWall.tsx#280-407
- Comment composer features cancel/save affordances, pseudo-random supportive aliases, and toast feedback to normalize anonymous participation.@src/pages/community/AcademicWall.tsx#136-171 @src/pages/community/AcademicWall.tsx#352-400

### Emotion Center

- Anonymous emotional sharing feed with topic tags, resonance counts, save toggles, and moderation cues (“Pending review”).@src/pages/community/EmotionCenter.tsx#178-459
- Comment drawer offers supportive responses with deletion for self-posted comments and contextual toasts.@src/pages/community/EmotionCenter.tsx#460-525
- Post composer dialog collects tags, content, optional images (with local previews/removal), and reiterates privacy notices, mirroring anticipated moderation workflows.@src/pages/community/EmotionCenter.tsx#542-639

### Soul Match

- Three-stage flow: topic selection, simulated matching animation, and anonymous chat interface.@src/pages/community/SoulMatch.tsx#45-227
- Chat view supports message history, typing indicators, minimize/keep chat behaviour, and end-chat safety modal (including report option).@src/pages/community/SoulMatch.tsx#228-375
- Automated responses mimic conversational feedback to test the emotional dynamics of anonymous peer support.@src/pages/community/SoulMatch.tsx#97-131

## Error Handling

- Custom 404 view logs routing misses to the console for developer debugging while presenting a branded fallback with home redirect.@src/pages/NotFound.tsx#1-24

## Usability Considerations and Future Hooks

- Consistent card layout, iconography, and colour semantics aid recognition while responsive grids ensure usability on varied viewports across modules.@src/pages/LandingPage.tsx#78-111 @src/pages/overseas-exchange/VisualSchoolExplorer.tsx#259-327 @src/pages/job-information/JobOpportunityHub.tsx#129-199
- Buttons respect disabled states, tooltips (where applied), and variant theming to indicate primary versus supportive actions.@src/pages/FocusLearning.tsx#243-395 @src/pages/community/EmotionCenter.tsx#542-639
- Toast feedback and optimistic state changes communicate system acknowledgement even in this prototype’s mocked-data context, supporting usability tests without backend latency.@src/pages/overseas-exchange/VisualSchoolExplorer.tsx#166-215 @src/pages/job-information/JobOpportunityHub.tsx#86-163 @src/pages/community/EmotionCenter.tsx#214-326
- Local state structures (e.g., TanStack Query client, React contexts, rich useState patterns) are prepared for data persistence and multi-user scenarios in subsequent versions, ensuring this v1 remains both demonstrable and evolvable.@src/App.tsx#1-183 @src/pages/FocusLearning.tsx#136-488

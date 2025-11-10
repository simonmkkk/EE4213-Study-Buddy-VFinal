# Study Buddy 原型（v1）功能與易用性說明

## 概覽

Study Buddy 首版原型以多模組網頁應用呈現完整的留學規劃、職涯探索、專注學習與社群支持體驗。系統採用 React Router 進行路由切換，結合 TanStack Query 為未來資料串接做準備，並搭配 Toast 雙系統與可調式無障礙配色，確保操作回饋與可達性。各模組以情境化資料與互動流程驗證可用性，協助使用者快速理解產品價值。@src/App.tsx#1-183

## 全域框架

### 導覽列與模組入口

- 固定式頂部導覽列整合四大模組（海外交流、職涯資訊、專注學習、社群互助），提供即時路由切換與品牌首頁回到點。@src/components/Navigation.tsx#1-105
- 透過動態高亮與滑入動畫呈現目前位置與可點擊區域，降低迷失風險。@src/components/Navigation.tsx#29-66
- 頭像選單預留個人設定與登出入口，象徵後續可延伸的客製化體驗。@src/components/Navigation.tsx#90-102

### 無障礙與個人化支持

- 內建色覺模式切換（預設／紅綠／藍黃），狀態儲存在 localStorage，並透過 `data-color-vision` 屬性驅動全局樣式。@src/components/Navigation.tsx#15-88 @src/context/ColorVisionContext.tsx#1-56
- 「回到頂部」按鈕偵測滾動並提供平滑捲動，具備鍵盤與螢幕報讀友善設計。@src/components/BackToTop.tsx#1-68

### 系統回饋與狀態管理

- 同時整合 Shadcn Toaster 與 Sonner 兩套通知系統，以一致視覺回饋提示成功、錯誤或警告。@src/App.tsx#1-183
- 外層包覆 `TooltipProvider` 與 TanStack Query Client，為未來的資料快取與提示一致性預留彈性。@src/App.tsx#1-183

## 登入首頁體驗

- 首屏 Hero 區塊以主題標語與行動按鈕引導使用者快速進入模組或加入社群。@src/pages/LandingPage.tsx#45-76
- 下方模組預覽卡使用圖示、色彩與互動懸浮效果說明四大功能區域，加速建立產品心智圖。@src/pages/LandingPage.tsx#78-111

## 海外交流模組

### 海外交流模組首頁

- 以卡片介紹子功能（例如「視覺化學校探索」），並提供動態導覽至詳細工具。@src/pages/OverseasExchange.tsx#6-50

### 視覺化學校探索

- 彙整各國大學之科系、圖片、評分與評語，用戶可交叉篩選國家與科系。@src/pages/overseas-exchange/VisualSchoolExplorer.tsx#18-258
- 卡片包含圖片錯誤備援、科系徽章、評分顯示、評論入口以及導向課綱比對的快速操作。@src/pages/overseas-exchange/VisualSchoolExplorer.tsx#260-327
- 評論對話框可瀏覽歷史心得、查看星等並提交帶驗證的匿名評論（含錯誤提示與成功 Toast）。@src/pages/overseas-exchange/VisualSchoolExplorer.tsx#338-422

### 課綱自動比對器

- 可接收前一頁傳遞的學校資訊，自動預選並顯示對應課程。@src/pages/overseas-exchange/SyllabusAutoMatcher.tsx#278-318
- 依學校動態調整科系下拉選項，若變更至不相容科系將自動復原。@src/pages/overseas-exchange/SyllabusAutoMatcher.tsx#269-318
- 顯示總課程數、可轉換數與學分比（可視情況內嵌或浮動），協助評估轉學分價值。@src/pages/overseas-exchange/SyllabusAutoMatcher.tsx#320-461
- 課程卡以顏色與圖示區分可轉／不可轉，並展示關鍵字與匹配課程說明，增強判讀效率。@src/pages/overseas-exchange/SyllabusAutoMatcher.tsx#468-500
- 附帶評論對話框，讓學生能在比對結果內直接參考口碑。@src/pages/overseas-exchange/SyllabusAutoMatcher.tsx#503-538

## 職涯資訊模組

### 職涯模組首頁

- 以卡片展示職涯儀表板、職缺探索與技能落差分析等子功能。@src/pages/JobInformation.tsx#6-63

### 職涯進度儀表板

- 三張 KPI 卡片同時顯示已儲存職缺、收藏資源與進行中申請，並可直接導覽至職缺中心。@src/pages/job-information/CareerDashboard.tsx#8-67
- 進度分析區使用進度條呈現履歷完成度、技能發展與申請成功率。@src/pages/job-information/CareerDashboard.tsx#70-108
- 智慧通知提醒重要期限與完成事項，避免錯過關鍵時間點。@src/pages/job-information/CareerDashboard.tsx#110-128

### 職缺探索中心

- 提供職缺類型與地點雙下拉篩選，方便依條件篩選。@src/pages/job-information/JobOpportunityHub.tsx#74-127
- 職缺卡片包含公司、地點、截止日、標籤與儲存狀態，並可展開查看描述與應徵建議，附外部連結。@src/pages/job-information/JobOpportunityHub.tsx#129-187
- 儲存操作搭配 Toast 提示成功，強化回饋。@src/pages/job-information/JobOpportunityHub.tsx#86-163

## 專注學習模組

### 指揮中心（主頁）

- Pomodoro 計時器支援開始／暫停／重設、倒數動畫、預設時間與互動動效，並搭配激勵語錄。@src/pages/FocusLearning.tsx#136-488
- 環境音面板可同時播放多種自然聲、咖啡廳聲等，提供靜音與狀態標示。@src/pages/FocusLearning.tsx#213-570 @src/pages/FocusLearning.tsx#813-869
- 壁紙面板切換多款背景並維持字體可讀性（加入漸層遮罩與景深效果）。@src/pages/FocusLearning.tsx#136-174 @src/pages/FocusLearning.tsx#872-907
- 全螢幕切換、追蹤器收合等控制考慮多顯示器情境。@src/pages/FocusLearning.tsx#142-809

### 微型目標追蹤器

- 允許建立主要任務與子任務，支援內嵌編輯、刪除、復原與即時驗證，輸入框自動聚焦。@src/pages/FocusLearning.tsx#243-395 @src/pages/FocusLearning.tsx#959-1181
- 核取方塊進度會將完成任務轉入「過往任務」並紀錄時間，可再次開啟或永久刪除，並以圖表顯示近七天完成度。@src/pages/FocusLearning.tsx#463-488 @src/pages/FocusLearning.tsx#1218-1343
- 近七日熱度圖以色彩／描邊標示今日與完成情形，快速掌握習慣趨勢。@src/pages/FocusLearning.tsx#1277-1343

### 專注模式儀表板

- 提供沉浸式全螢幕版，具計時器、預設按鈕、勵志語錄與背景，並提醒開啟「勿擾模式」。@src/pages/focus-learning/FocusModeDashboard.tsx#16-186

### 獨立微型目標頁

- 以進度條、進度卡與固定「新增目標」表單呈現當日工作量及預估時間，提供每日摘要統計。@src/pages/focus-learning/MicroGoalTracker.tsx#19-240

## 社群模組

### 社群模組首頁

- 卡片說明「學術討論牆」、「情緒驛站」、「Soul Match」三大互動場景。@src/pages/Community.tsx#6-62

### 學術討論牆

- 提供課程清單、科系篩選與代號搜尋，顯示活躍人數作為社群熱度指標。@src/pages/community/AcademicWall.tsx#95-169 @src/pages/community/AcademicWall.tsx#195-252
- 課程詳頁整合 AI 即時回覆、同儕匿名留言與時間戳，維持溫暖支持語氣。@src/pages/community/AcademicWall.tsx#280-407
- 留言輸入框支援草稿暫存、取消與成功提示，降低使用壓力。@src/pages/community/AcademicWall.tsx#352-400

### 情緒驛站

- 陌生人匿名分享貼文，可以標記主題、上傳圖片、共感（resonate）、收藏與檢舉，並顯示審核狀態。@src/pages/community/EmotionCenter.tsx#178-459
- 留言區提供匿名鼓勵、刪除自留留言與 Toast 提示，互動後保持卡片更新。@src/pages/community/EmotionCenter.tsx#460-525
- 發文彈窗要求至少一個主題與內容，可預覽與移除圖片，並重申匿名與審核流程。@src/pages/community/EmotionCenter.tsx#542-639

### Soul Match

- 三階段流程（興趣選擇 → 匹配動畫 → 匿名聊天），模擬即時陪伴。@src/pages/community/SoulMatch.tsx#45-227
- 聊天介面具備訊息流、打字中狀態、最小化保存、結束／檢舉選項，並提供系統回覆模擬真實對話。@src/pages/community/SoulMatch.tsx#228-375

## 錯誤與例外處理

- 自訂 404 頁面記錄不存在路徑並提供返回首頁連結，方便開發除錯。@src/pages/NotFound.tsx#1-24

## 易用性觀察與可擴充性

- 卡片布局、圖示與色彩語彙在全站保持一致，並以彈性網格支援桌面與行動裝置。@src/pages/LandingPage.tsx#78-111 @src/pages/overseas-exchange/VisualSchoolExplorer.tsx#259-327 @src/pages/job-information/JobOpportunityHub.tsx#129-199
- 主要與次要按鈕皆維持禁用狀態、邊框與動態一致性，提升操作預期性。@src/pages/FocusLearning.tsx#243-395 @src/pages/community/EmotionCenter.tsx#542-639
- Toast 與樂觀更新確保即便在假資料階段也能提供回饋，降低不確定感。@src/pages/overseas-exchange/VisualSchoolExplorer.tsx#166-215 @src/pages/job-information/JobOpportunityHub.tsx#86-163 @src/pages/community/EmotionCenter.tsx#214-326
- React 狀態管理（Context、TanStack Query、useState）皆以可擴充為前提設計，方便日後串接後端或多人協作。@src/App.tsx#1-183 @src/pages/FocusLearning.tsx#136-488

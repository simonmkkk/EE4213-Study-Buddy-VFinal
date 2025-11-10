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

- **沉浸式版面與氛圍**：頁面背景依據壁紙動態加上漸層遮罩，確保字體對比，同時以 `container` 置中計時器，將輔助面板放在側邊以便隨時操作。@src/pages/FocusLearning.tsx#209-220 @src/pages/FocusLearning.tsx#639-760
- **Pomodoro 計時核心**：Start/Pause 透過單一 `isRunning` 狀態切換；倒數歸零時自動重置為目前預設時長。多組 `useEffect` 控制條件計時，避免空轉或重複觸發：閒置時切換預設長度會即時同步秒數；僅在運行時啟用 interval；一旦倒數完畢即停止。@src/pages/FocusLearning.tsx#146-257 @src/pages/FocusLearning.tsx#246-590
- **主控制面操作**：開始／暫停、重設按鈕採大型圓角膠囊設計，會依壁紙模式變換配色；禁用狀態避免無效操作，並在倒數結束後再啟動時自動回填預設秒數。@src/pages/FocusLearning.tsx#672-709
- **預設時段捷徑**：三顆膠囊按鈕瞬間切換 25／15／5 分鐘，顏色高亮顯示當前選擇，並且在切換時關閉運行中的計時，確保時段精準。@src/pages/FocusLearning.tsx#712-747 @src/pages/FocusLearning.tsx#246-255
- **激勵訊息**：計時器下方固定顯示名言，提供持續專注的情緒支持。@src/pages/FocusLearning.tsx#749-756
- **環境音協奏**：
  - 音源面板提供六種場景音，按下即在 `ambientAudioRef` 中緩存 `HTMLAudioElement`，避免重複下載。@src/pages/FocusLearning.tsx#165-291 @src/pages/FocusLearning.tsx#854-915
  - 全域靜音按鈕會暫停並重設目前聲道；相關 `useEffect` 監聽確保切換或靜音時音訊同步，避免殘留播放。@src/pages/FocusLearning.tsx#285-288 @src/pages/FocusLearning.tsx#609-628
  - 面板按鈕顯示「Playing／Paused／Add」等狀態文字，即使使用者關靜音也能判斷背景音是否啟用。@src/pages/FocusLearning.tsx#904-911
- **壁紙個人化**：側邊面板列出多款 Unsplash 圖片與預設純色，點選後更新帶漸層的 `backgroundStyle`，並與環境音開關共享一致的按鈕語彙強化可發現性。@src/pages/FocusLearning.tsx#204-220 @src/pages/FocusLearning.tsx#919-957
- **視窗掌控工具**：全螢幕切換透過原生 API 並綁定監聽器以更新圖示狀態；追蹤器收闔按鈕可在單螢幕上釋出空間。開啟任一面板會自動收起其他面板，降低介面雜訊。@src/pages/FocusLearning.tsx#252-258 @src/pages/FocusLearning.tsx#630-850

### 微型目標追蹤器

- **引導式啟用**：若從其他模組帶著 `highlightId` 進入，系統會自動展開追蹤器並亮起脈衝動畫，引導使用者於測試中立即看到關鍵功能。@src/pages/FocusLearning.tsx#170-202 @src/pages/FocusLearning.tsx#961-1450
- **主要任務管理**：新增主要任務會去除多餘空白並禁用無效送出；列表支援即時重新命名與刪除，且會同步清理相關的暫存輸入值，避免殘留資料。@src/pages/FocusLearning.tsx#294-376 @src/pages/FocusLearning.tsx#1007-1099
- **次任務編輯流程**：子任務沿用同樣的驗證規則，當行內編輯啟動時會鎖定核取方塊，防止狀態衝突；支援完成、重新命名與刪除。@src/pages/FocusLearning.tsx#310-463 @src/pages/FocusLearning.tsx#1163-1239
- **完成旅程與歷史記錄**：當所有子任務勾選完成，系統會將主要任務移入「過往任務」，記錄 `completedAt` 日期並更新 7 日完成統計。被移除或重新開啟時會同步調整統計資料。@src/pages/FocusLearning.tsx#520-559 @src/pages/FocusLearning.tsx#1290-1376
- **近七日熱度圖**：底部顯示 7 日日期圓點，以顏色與描邊突顯「Today」與已完成的日子，提供習慣追蹤者快速回饋。@src/pages/FocusLearning.tsx#1383-1444

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

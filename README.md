# QuizWall

**QuizWall** is an interactive, web-based quiz application inspired by Wordwall. It allows users to create, play, and share multimedia quizzes with ease.
**QuizWall** 是一個受 Wordwall 啟發的互動式網頁測驗應用程式。它讓使用者能輕鬆建立、遊玩並分享包含多媒體的測驗。

[Live Demo / 線上試玩](https://cyclone-tw.github.io/quiz-wall/)

---

## Features / 功能特色

- **Interactive Gameplay**: Engaging multiple-choice quizzes with instant feedback.
  **互動式遊玩**：引人入勝的多選題測驗，提供即時回饋。
- **Multimedia Support**: Add images and audio to questions and options via URL or upload.
  **多媒體支援**：可透過網址或上傳方式，為題目與選項加入圖片及音效。
- **Batch Import**: Create quizzes quickly by importing CSV files (template provided).
  **批次匯入**：支援匯入 CSV 檔案快速建立題庫 (提供範例檔)。
- **Detailed Results**: View question-by-question breakdown and download result cards as images.
  **詳細成績單**：查看每一題的答題狀況，並可將成績單下載為圖片。
- **QR Code Share**: Generate a persistent QR code for easy sharing in classrooms or events.
  **QR Code 分享**：產生可永久使用的 QR Code，方便在教室或活動中分享。
- **Offline Capable**: Quizzes are saved in your browser's LocalStorage.
  **離線支援**：測驗資料儲存在瀏覽器的 LocalStorage 中。

---

## How to Use / 使用說明

### For Creators / 建立測驗

1. **Create a Quiz**: Click **"Create New Quiz"** on the dashboard.
   **建立測驗**：在儀表板點擊 **"Create New Quiz"**。
2. **Edit Questions**:
   **編輯題目**：
   - Type your question and options. / 輸入題目與選項。
   - Click the **Circle** icon to mark the correct answer. / 點擊圓圈圖示標記正確答案。
   - Click **"Img/Audio"** to add media. / 點擊 **"Img/Audio"** 加入媒體。
3. **Batch Import**:
   **批次匯入**：
   - Click **"Template"** to download the CSV template. / 點擊 **"Template"** 下載 CSV 範例檔。
   - Edit the file in Excel/Google Sheets and save as CSV. / 用 Excel/Google Sheets 編輯後存為 CSV。
   - Click **"Import CSV"** to load questions. / 點擊 **"Import CSV"** 匯入題目。
4. **Save**: Click **"Save Quiz"** to finish.
   **儲存**：點擊 **"Save Quiz"** 完成。

### For Players / 遊玩測驗

1. **Play**: Click the **Play** button on any quiz card.
   **遊玩**：點擊測驗卡片上的 **Play** 按鈕。
2. **Share**:
   **分享**：
   - Click the **QR Code** icon in the top right corner. / 點擊右上角的 **QR Code** 圖示。
   - Enter your app URL (e.g., GitHub Pages link) to generate a code. / 輸入您的網站網址以產生條碼。
3. **Results**: At the end, click **"Download Result"** to save your score image.
   **成績**：測驗結束後，點擊 **"Download Result"** 下載成績圖片。

---

## Deployment / 部署教學

You can host this app for free on GitHub Pages.
您可以免費將此應用程式部署在 GitHub Pages 上。

1. **Export Quizzes** (Optional):
   **匯出題庫** (選用)：
   - Click **"Export Quizzes"** on the dashboard. / 在儀表板點擊 **"Export Quizzes"**。
   - Rename the file to `default-quizzes.json` and place it in the `public/` folder. / 將檔案重新命名為 `default-quizzes.json` 並放入 `public/` 資料夾。
   - This makes your quizzes available to everyone who visits your site. / 這樣所有訪問網站的人都能看到這些題目。

2. **Deploy**:
   **部署**：
   ```bash
   npm run deploy
   ```

---

## Development / 開發

```bash
# Install dependencies / 安裝套件
npm install

# Start dev server / 啟動開發伺服器
npm run dev

# Build for production / 建置正式版
npm run build
```

Built with React, Vite, and Vanilla CSS.
使用 React, Vite 與 Vanilla CSS 建置。

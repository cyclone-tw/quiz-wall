# QuizWall

**QuizWall** is an interactive, web-based quiz application inspired by Wordwall. It allows users to create, play, and share multimedia quizzes with ease.
**QuizWall** 是一個受 Wordwall 啟發的互動式網頁測驗應用程式。它讓使用者能輕鬆建立、遊玩並分享包含多媒體的測驗。

[Live Demo / 線上試玩](https://cyclone-tw.github.io/quiz-wall/)

---

## Features / 功能特色

- **Cloud Persistence**: Integrated with **Firebase Firestore** for real-time data storage and synchronization.
  **雲端儲存**：整合 **Firebase Firestore**，實現資料即時儲存與同步。
- **Interactive Gameplay**: Engaging multiple-choice quizzes with instant feedback and score tracking.
  **互動式遊玩**：引人入勝的多選題測驗，提供即時回饋與分數追蹤。
- **Multimedia Support**:
  **多媒體支援**：
  - **Drag & Drop Upload**: Drag images directly into the editor (auto-compressed to <1MB). / 支援拖曳上傳圖片 (自動壓縮)。
  - **Audio Recording**: Record up to 10s of audio directly from the microphone. / 支援麥克風直接錄音 (限時 10 秒)。
  - **URL Support**: Add media via external links. / 支援外部圖片/音效連結。
- **Quiz Management**:
  **題庫管理**：
  - **Duplicate Quiz**: One-click copy to create variations. / 一鍵複製題庫。
  - **Delete Confirmation**: Safe deletion with confirmation dialog. / 刪除確認視窗，防止誤刪。
  - **Batch Import**: Create quizzes quickly by importing CSV files. / 支援 CSV 批次匯入。
- **Randomization**:
  **隨機功能**：
  - **Randomize Questions**: Shuffle question order. / 隨機題目順序。
  - **Randomize Options**: Shuffle answer choices (A/B/C/D) for each question. / 隨機選項順序。
- **Detailed Results**: View question-by-question breakdown with images and full option details.
  **詳細成績單**：查看每一題的完整答題狀況，包含題目圖片與所有選項細節。
- **Dark Mode**: Switch between light and dark themes for comfortable viewing.
  **深色模式**：可切換亮色/深色主題，提供舒適的視覺體驗。

---

## Tech Stack / 技術架構

- **Frontend**: React 19, Vite
- **Styling**: Vanilla CSS (CSS Variables for theming)
- **Database**: Google Firebase Firestore
- **Deployment**: GitHub Pages
- **Key Libraries**:
  - `lucide-react`: UI Icons
  - `html2canvas`: Result image generation
  - `papaparse`: CSV parsing
  - `react-qr-code`: QR code generation

---

## How to Use / 使用說明

### For Creators / 建立測驗

1.  **Create a Quiz**: Click **"Create New Quiz"** on the dashboard.
    **建立測驗**：在儀表板點擊 **"Create New Quiz"**。
2.  **Add Media**:
    **加入媒體**：
    -   **Upload**: Drag & drop images or click to select files. / 拖曳圖片或點擊上傳。
    -   **Record**: Click the **Mic** icon to record audio (10s limit). / 點擊 **麥克風** 圖示錄音。
3.  **Save**: Quizzes are automatically saved to the cloud (Firestore).
    **儲存**：測驗會自動儲存至雲端資料庫。

### For Players / 遊玩測驗

1.  **Play**: Click the **Play** button on any quiz card.
    **遊玩**：點擊測驗卡片上的 **Play** 按鈕。
2.  **Options**: Check "Randomize Question Order" or "Randomize Options" before starting.
    **選項**：開始前可勾選「隨機題目」或「隨機選項」。
3.  **Results**: At the end, click **"Download Result"** to save your score image.
    **成績**：測驗結束後，點擊 **"Download Result"** 下載成績圖片。

---

## Development / 開發

```bash
# Install dependencies / 安裝套件
npm install

# Start dev server / 啟動開發伺服器
npm run dev

# Build for production / 建置正式版
npm run build

# Deploy to GitHub Pages / 部署至 GitHub Pages
npm run deploy
```

Built with React, Vite, and Vanilla CSS.
使用 React, Vite 與 Vanilla CSS 建置。

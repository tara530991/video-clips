# Video Clips

一個基於 React 的影片剪輯預覽工具，可以幫助你管理和預覽影片剪輯效果片段。

## 功能特點

- 影片上傳和管理
- 自動生成影片字幕
- 加亮重要片段
- 手動選擇和標記精彩片段
- 時間軸視覺化
- 支持多種播放模式

## 技術棧

- React 18
- React Router
- React Query
- TailwindCSS
- Supabase (影片儲存空間)
- Axios

## 本地開發

### 前置需求

- Node.js 18 或更高版本
- npm 或 yarn

### 安裝步驟

1. 複製儲存庫

```bash
git clone https://github.com/tara530991/video-clips.git
cd video-clips
```

2. 安裝依賴

```bash
npm install
```

3. 創建環境變量文件

```bash
cp .env.example .env
```

4. 配置環境變量
   在 `.env` 文件中填入以下配置：

```
REACT_APP_SUPABASE_URL=你的_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY
REACT_APP_API_BASE_URL=你的_API_BASE_URL
```

5. 啟動開發服務器

```bash
npm start
```

## 部署

本項目使用 GitHub Pages 進行部署。每次推送到 `main` 分支時，GitHub Actions 會自動構建並部署到 GitHub Pages。

### 部署步驟

1. 確保所有更改已提交並推送到 `main` 分支
2. GitHub Actions 會自動執行以下步驟：
   - 安裝依賴
   - 構建項目
   - 部署到 GitHub Pages

## 項目結構

```
video-clips/
├── public/              # 靜態資源
├── src/                 # 源代碼
│   ├── components/      # React 組件
│   ├── hooks/          # 自定義 Hooks
│   ├── pages/          # 頁面組件
│   ├── utils/          # 工具函數
│   └── App.js          # 應用入口
├── .github/            # GitHub 配置
│   └── workflows/      # GitHub Actions 工作流
└── package.json        # 項目配置
```

## 貢獻指南

1. Fork 本項目
2. 創建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 授權

MIT License - 詳見 [LICENSE](LICENSE) 文件

## 聯繫方式

- GitHub: [@tara530991](https://github.com/tara530991)

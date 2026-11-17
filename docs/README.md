# 專案文件總覽

本專案是花卉電商示範系統，提供：
- 前台：商品列表、商品詳情、購物車、結帳、會員訂單
- 後台：商品管理、訂單管理
- API：RESTful JSON（統一回應 envelope）

## 技術棧

| 類別 | 技術 | 說明 |
| --- | --- | --- |
| Runtime | Node.js | 伺服器執行環境 |
| Web Framework | Express 4 | API 與頁面路由 |
| Template | EJS | 伺服器端頁面模板 |
| Frontend Runtime | Vue 3 (CDN) | 頁面互動邏輯 |
| Database | SQLite + better-sqlite3 | 單機資料庫與同步查詢 |
| Auth | JWT (jsonwebtoken) + Session Header | API 驗證與購物車雙模式 |
| Password Hash | bcrypt | 密碼雜湊 |
| CSS | Tailwind CSS v4 | 設計 token 與 utility class |
| Testing | Vitest + Supertest | API 整合測試 |
| API Doc | swagger-jsdoc | 由 route 註解產生 OpenAPI |

## 快速開始

### 1) 安裝與環境變數
```bash
npm install
cp .env.example .env
```

> 必填：`JWT_SECRET`。未設定時 `node server.js` 會直接終止。

### 2) 啟動（開發模式，兩個終端）
```bash
# Terminal A
npm run dev:server
```

```bash
# Terminal B
npm run dev:css
```

### 3) 測試
```bash
npm test
```

### 4) 產生 OpenAPI
```bash
npm run openapi
```

## 常用指令表

| 指令 | 何時使用 | 主要輸出 |
| --- | --- | --- |
| `npm run start` | 本機完整啟動（含 CSS build） | 啟動 3001 server |
| `npm run dev:server` | 後端 API/路由開發 | API 與 EJS 頁面服務 |
| `npm run dev:css` | 調整樣式 | 持續更新 `public/css/output.css` |
| `npm run css:build` | 佈署前或驗證樣式編譯 | 壓縮後 CSS |
| `npm run openapi` | 更新 API 文件輸出 | `openapi.json` |
| `npm test` | 驗證回歸行為 | 6 組測試檔、32+ 測試案例 |

## 文件索引

| 文件 | 建議閱讀時機 | 核心內容 |
| --- | --- | --- |
| `docs/ARCHITECTURE.md` | 新成員 onboarding、調整系統流程前 | 目錄用途、路由總覽、資料流、DB schema |
| `docs/DEVELOPMENT.md` | 新增 API/DB/middleware 前 | 命名規範、模組系統、實作步驟、env 規範 |
| `docs/FEATURES.md` | 規劃功能、對齊規格、除錯行為差異 | 功能行為、參數、錯誤碼、狀態 |
| `docs/TESTING.md` | 新增或修正測試 | 測試順序、依賴、helper、範例 |
| `docs/CHANGELOG.md` | 發版或追蹤變更 | 版本紀錄與功能增量 |
| `docs/plans/` | 開始新開發項目前 | 計畫文件撰寫與追蹤 |
| `docs/plans/archive/` | 功能完成後 | 歸檔已完成計畫 |

## 六角學院 AI 開發進化營第二場作業

| 文件／素材 | 說明 |
| --- | --- |
| [GitHub 專案首頁](../README.md) | 專案摘要、設計與實作成果、重要連結 |
| [前台設計交付](./designs/flower-life-redesign/README.md) | Design Skill、Pencil MCP、桌面／手機設計、切版與金流交接 |
| [設計 PDF](./designs/flower-life-redesign/flower-life-design.pdf) | Pencil 設計稿輸出 |
| [frontend-design Skill](../.agents/skills/frontend-design/SKILL.md) | 前端視覺設計與自我檢視指引 |
| [ecpay-e2e-checkout Skill](../.agents/skills/ecpay-e2e-checkout/SKILL.md) | Playwright MCP 結帳及綠界 staging E2E 流程定義 |
| [測試規範與最新驗證紀錄](./TESTING.md) | API 測試規範、歷史紀錄與實際瀏覽器驗證工具說明 |

桌面、手機截圖與關鍵狀態板請見[設計交付中的頁面對照及關鍵狀態](./designs/flower-life-redesign/README.md#頁面對照)。

## 相關入口
- 程式進入點：`server.js`、`app.js`
- DB 初始化：`src/database.js`
- API 路由：`src/routes/*.js`
- 前端互動：`public/js/**/*.js`
- 測試：`tests/*.test.js`

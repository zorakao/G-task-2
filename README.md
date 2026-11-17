# 花漾生活｜花卉電商

以 Node.js、Express、SQLite、EJS 與 Vue 3 建置的花卉電商示範專案，涵蓋商品瀏覽、購物車、結帳、會員訂單及管理後台。前台視覺依 Pencil 設計稿完成，並整合綠界 staging 付款流程。

## 專案文件

- [技術文件與快速開始](./docs/README.md)
- [系統架構](./docs/ARCHITECTURE.md)
- [開發規範](./docs/DEVELOPMENT.md)
- [功能列表](./docs/FEATURES.md)
- [測試規範與最新驗證紀錄](./docs/TESTING.md)
- [更新日誌](./docs/CHANGELOG.md)

## 第二場作業：設計與實作

- [frontend-design Skill](./.agents/skills/frontend-design/SKILL.md)：建立具辨識度的視覺方向、設計 token 與版面原則。
- [ecpay-e2e-checkout Skill](./.agents/skills/ecpay-e2e-checkout/SKILL.md)：定義透過 Playwright MCP 操作結帳與 ECPay staging 的端對端流程。
- [前台設計交付說明](./docs/designs/flower-life-redesign/README.md)：包含 Pencil 設計、頁面對照、實作交接與驗證資訊。
- [完整 Pencil 設計 PDF](./docs/designs/flower-life-redesign/flower-life-design.pdf)
- [桌面畫面截圖](./docs/designs/flower-life-redesign/previews/01-home-desktop.png) · [手機畫面截圖](./docs/designs/flower-life-redesign/previews/01-home-mobile.png)
- [全部桌面與手機頁面預覽索引](./docs/designs/flower-life-redesign/README.md#頁面對照)

依作業要求，設計稿截圖或原始檔案擇一提交即可；本專案已提供完整設計 PDF 與桌面、手機截圖。

## 設計、切版與金流

`frontend-design` Skill 提供設計方向與自我檢視流程；Pencil MCP 用於建立可編輯的桌面、手機畫面與狀態稿，並匯出 PDF／PNG。前端切版將視覺稿落實於既有 EJS、Vue 3 與 Tailwind CSS，保留既有 API 與資料流。綠界整合則由前端導向 ECPay staging，回站後由伺服器查詢交易狀態，再以已驗證狀態更新訂單畫面。

## E2E 流程與驗證紀錄

E2E Skill 定義 Playwright MCP 流程：管理員登入、選購商品、建立訂單、在 ECPay staging 以網路 ATM／銀行模擬付款，回站查詢並確認訂單為已付款。流程也涵蓋售完商品、未登入結帳、付款狀態查詢失敗等異常處理。Skill 是可重複使用的流程定義，不代表每次均已執行。

已記錄的實際瀏覽器測試使用 Pencil MCP Browser／CDP（當次未提供 Playwright MCP），並完成綠界 staging 土地銀行 WebATM 付款與回站驗證。另有錯誤登入、空訂單、表單錯誤與付款查詢失敗等案例紀錄。工具差異、案例細節與日期請見[測試紀錄](./docs/TESTING.md#最新驗證紀錄)。

E2E 測試錄影連結將於作業繳交時另外提供。

## 快速開始

```bash
npm install
cp .env.example .env
# 設定 .env 中的 JWT_SECRET 後：
npm run start
```

更多開發指令與測試方式請見[技術文件](./docs/README.md)。

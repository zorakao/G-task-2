# 將 Pencil 前台設計套用至網站

## User Story
將已完成的 Pencil 桌面／手機設計匯入現有 Express、EJS、Vue 3 專案，啟動並驗證可操作的前台。

## Spec
- 沿用已核定的冷紫／花莖綠、Noto Serif TC／Noto Sans TC、花材攝影、版面及操作文案。
- 更新全部前台頁面與共用導覽、頁尾、欄位、通知、購物進度及狀態。
- 匯入原始照片資產，保持商品與訂單資料動態取得。
- 保留 API envelope、JWT／Session 購物車、後台權限及訂單 transaction。
- 使用既有 Tailwind v4、EJS 與 Vue，提供語意 HTML、鍵盤焦點、手機選單、錯誤與空狀態。
- 既有運費前後端不一致：後端訂單僅計商品總額；這次先維持後端行為並使顯示金額一致，不新增收費規則。

## Tasks
- [x] 讀取設計 tokens、頁面與現有程式。
- [x] 匯出並匯入花材攝影與 17 個圖示；修復另存設計檔後的圖片路徑。
- [x] 實作共用元件與所有前台版型。
- [x] 連接動態資料、錯誤、登入與付款狀態。
- [x] CSS 編譯、47 項測試及桌面／390px／320px 瀏覽器驗證。
- [x] 綠界 staging 土地銀行 WebATM 購買流程成功，訂單狀態 paid；保留原本 3001 伺服器供操作。

## Result
- 本機網站：http://localhost:3001/
- 測試訂單：ORD-20261117-B64C5，NT$2,960，已付款。
- 既有 API、後台權限及訂單 transaction 未變更。
- 本次採 Pencil Browser／CDP 進行瀏覽器驗證，因本次沒有 Playwright MCP。
- 測試使用獨立暫存 SQLite；瀏覽器付款使用專用測試會員建立一筆 staging 訂單。

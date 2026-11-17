# 花漾生活前台設計

依 `frontend-design` skill，以 Pencil MCP 繪製的可編輯設計。交付日：2026-11-17。

新版視覺已套用至 EJS／Vue 前台，可於 [本機網站](http://localhost:3001/) 操作。API 與資料庫結構沿用原專案；47 項測試通過，並完成綠界 staging 實際付款驗證。

## 設計檔

- [完整設計 PDF（22 頁）](./flower-life-design.pdf)
- [frontend-design Skill](../../../.agents/skills/frontend-design/SKILL.md)：視覺方向、設計 token、版面與自我檢視指引。
- [ecpay-e2e-checkout Skill](../../../.agents/skills/ecpay-e2e-checkout/SKILL.md)：Playwright MCP 結帳與綠界 staging 驗證流程定義。
- 桌面寬 1440px，手機寬 390px；18 張頁面及 3 份關鍵狀態板。
- 畫布上方是色票、字體、攝影與共用元件。頁面依購物流程分成三列，每張桌面稿右側為對應手機稿，最下方為狀態設計。

## 頁面對照

| 頁面 | 既有路由 | 桌面 | 手機 |
| --- | --- | --- | --- |
| 首頁／所有花禮 | `/` | [預覽](./previews/01-home-desktop.png) | [預覽](./previews/01-home-mobile.png) |
| 商品詳情 | `/products/:id` | [預覽](./previews/02-product-desktop.png) | [預覽](./previews/02-product-mobile.png) |
| 購物車 | `/cart` | [預覽](./previews/03-cart-desktop.png) | [預覽](./previews/03-cart-mobile.png) |
| 結帳 | `/checkout` | [預覽](./previews/04-checkout-desktop.png) | [預覽](./previews/04-checkout-mobile.png) |
| 訂單詳情／付款 | `/orders/:id` | [預覽](./previews/05-order-detail-desktop.png) | [預覽](./previews/05-order-detail-mobile.png) |
| 我的訂單 | `/orders` | [預覽](./previews/06-orders-desktop.png) | [預覽](./previews/06-orders-mobile.png) |
| 會員登入 | `/login` 登入分頁 | [預覽](./previews/07-login-desktop.png) | [預覽](./previews/07-login-mobile.png) |
| 會員註冊 | `/login` 註冊分頁 | [預覽](./previews/08-register-desktop.png) | [預覽](./previews/08-register-mobile.png) |
| 找不到頁面 | 404 fallback | [預覽](./previews/09-not-found-desktop.png) | [預覽](./previews/09-not-found-mobile.png) |

登入、註冊維持同一頁的分頁切換，沒有新增 `/register`。

## 關鍵狀態

- [空狀態與回饋](./previews/10-empty-and-feedback.png)：空購物車、空訂單、無商品、移除確認、售完、庫存不足、加入購物車成功、載入失敗、載入骨架、手機選單、結帳登入提示。
- [付款結果](./previews/11-payment-states.png)：待付款、查詢中、已付款、付款失敗、取消、查詢失敗。
- [表單與操作](./previews/12-form-and-focus.png)：一般與焦點、必填、電子郵件格式、密碼長度、登入失敗、重複註冊、按鈕焦點、建立中。

## 視覺規格

| Token | 色碼 | 用途 |
| --- | --- | --- |
| paper | `#FAFBF9` | 頁面背景 |
| stem | `#233F35` | 文字、主要操作與頁尾 |
| lilac | `#79618D` | 焦點與輔助視覺 |
| petal | `#E4DCEC` | 品牌內容區 |
| mist | `#F3F0F8` | 主視覺與金額摘要 |
| muted | `#536258` | 輔助文字 |
| line | `#DDE3DD` | 欄位與內容分隔 |

- Noto Serif TC 用於品牌和標題，Noto Sans TC 用於導覽、表單、內文與價格。
- 桌面內容寬 1280px、兩側 80px；手機內容寬 350px、兩側 20px。
- 主要按鈕高 48px，手機選單及移除操作的觸控容器為 44px。
- 品牌辨識集中在花材攝影、冷紫與花莖綠；交易頁直接說明操作任務。
- 商品以照片及留白區隔，沒有卡片陰影；功能區圓角依層級使用 4–12px。
- 狀態搭配文字及圖示，不只使用色彩。
- 實作時需使用原生欄位、按鈕、label 和可見 focus-visible，支援 prefers-reduced-motion；本設計沒有自動循環動效。

## 流程交接

- `frontend-design` Skill 提供視覺設計方法與品質檢視原則；Pencil MCP 用於製作可編輯的畫布、元件、桌面／手機頁面及狀態稿，並輸出 PDF 與 PNG。
- 前端切版將畫面落實到既有 EJS、Vue 3 與 Tailwind CSS，接上既有動態資料與 API，不改變原有交易資料流程。
- 綠界付款由前端導向 ECPay staging；使用者完成模擬付款後回到訂單頁，由後端 QueryTradeInfo 驗證結果，前端依伺服器回應呈現付款狀態。

- 訪客可瀏覽商品與使用購物車；結帳及訂單頁需登入。導覽依登入狀態切換，實作時保留原有管理員後台入口。
- 收件欄位僅有姓名、電子郵件、地址，皆必填。
- 「建立訂單」進入訂單詳情，再「前往綠界付款」。綠界提供的付款頁不在本站設計範圍內。
- 回站先查詢，驗證為 paid 才顯示已付款；待確認與取消狀態保留付款入口，failed 不直接承諾可重新付款。
- 查詢失敗保留原有訂單狀態，提供重新查詢。
- 訂單列表使用現有編號、日期、總額和三種付款狀態，沒有加入物流追蹤。
- 商品名稱、價格及庫存範例來自 seed；「季節鮮花訂閱（月配）」沿用商品名稱，不代表新增自動扣款功能。
- 沒有新增搜尋、分類、優惠碼、收件日期或物流功能。
- 運費沿用前台現有展示規則（滿 NT$500 免運）；本次示例皆超過門檻。實作前須確認未滿額時後端與前台金額的一致性。

## 檢查結果

- 18 張頁面與 3 張狀態板皆檢查過畫布內容及 component instances，無 clipped 回報。
- 已逐區檢查截圖並修正數量控制方向、欄位對齊、長地址換行、表格留白及手機觸控區。
- 對比：深綠／霧白 11.03:1、葉灰／霧白 6.21:1、白字／深綠 11.45:1、紫／冷霧 4.77:1、錯誤字／淺紅 6.01:1。
- 桌面／手機導覽與頁尾、主要／次要按鈕、欄位、數量控制為可重用元件；色彩與字體使用 Pencil variables。
- 圖片載入及 placeholder 完成後儲存原始畫布，匯出 PDF 和 PNG。
- 新版已在本機實作與執行，尚未部署至公開主機。原始設計稿的運費文案由實作調整為符合後端的實際計價。

## 圖片

主視覺與八項商品示意圖由 Pencil Generate 生成，統一攝影方向。另存 Pencil 文件後原始圖片路徑失效，因此使用 Pencil MCP 從已保存的完整設計預覽還原相同攝影區域，匯入 `public/images/flowers/`，並修復畫布參照。實際上架前應替換成供應商品實拍；後台修改的自訂圖片仍會優先顯示。

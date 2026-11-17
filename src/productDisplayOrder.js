// Shared by both product lists; matches the homepage design before pagination.
module.exports = `CASE name
  WHEN '粉色玫瑰花束' THEN 0
  WHEN '白色百合花禮盒' THEN 1
  WHEN '繽紛向日葵花束' THEN 2
  WHEN '紫色鬱金香盆栽' THEN 3
  WHEN '乾燥花藝術花圈' THEN 4
  WHEN '迷你多肉組合盆' THEN 5
  WHEN '經典紅玫瑰花束' THEN 6
  WHEN '季節鮮花訂閱（月配）' THEN 7
  ELSE 8
END ASC, created_at DESC, id ASC`;

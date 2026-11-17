const { app, request, getAdminToken } = require('./setup');
const db = require('../src/database');
const { v4: uuidv4 } = require('uuid');

const designNames = [
  '粉色玫瑰花束', '白色百合花禮盒', '繽紛向日葵花束', '紫色鬱金香盆栽',
  '乾燥花藝術花圈', '迷你多肉組合盆', '經典紅玫瑰花束', '季節鮮花訂閱（月配）',
];

describe('Product display order', () => {
  it('keeps restored products in design order across public and admin pages', async () => {
    const token = await getAdminToken();
    const rose = db.prepare('SELECT * FROM products WHERE name = ?').get(designNames[0]);
    const extras = [uuidv4(), uuidv4()].sort();
    // Roll back all fixture changes, including the delete/reinsert that caused the regression.
    db.exec('SAVEPOINT product_display_order');
    try {
      // Existing cart references do not matter until the fixture has been restored.
      db.pragma('defer_foreign_keys = ON');
      db.prepare('DELETE FROM products WHERE id = ?').run(rose.id);
      db.prepare(`INSERT INTO products (id, name, description, price, stock, image_url, created_at, updated_at)
        VALUES (@id, @name, @description, @price, @stock, @image_url, @created_at, @updated_at)`).run(rose);
      for (const id of [...extras].reverse()) {
        db.prepare('INSERT INTO products (id, name, price, stock, created_at) VALUES (?, ?, 500, 1, ?)')
          .run(id, '新上架花禮-' + id, '2099-01-01 00:00:00');
      }
      for (const endpoint of ['/api/products', '/api/admin/products']) {
        const products = [];
        for (let page = 1; page <= 4; page++) {
          const res = await request(app).get(`${endpoint}?page=${page}&limit=3`)
            .set('Authorization', `Bearer ${token}`);
          expect(res.status).toBe(200);
          expect(res.body.error).toBeNull();
          expect(res.body.data.pagination.totalPages).toBe(4);
          products.push(...res.body.data.products);
        }
        expect(products.map(product => product.name)).toEqual([
          ...designNames, ...extras.map(id => '新上架花禮-' + id),
        ]);
        expect(products[0]).toEqual(rose);
      }
    } finally {
      db.exec('ROLLBACK TO product_display_order; RELEASE product_display_order');
    }
  });
});

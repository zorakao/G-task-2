/* Shared presentation helpers for the Pencil storefront. */
const Flower = {
  photos: {
    '粉色玫瑰花束': 'rose', '白色百合花禮盒': 'lily', '繽紛向日葵花束': 'sunflower',
    '紫色鬱金香盆栽': 'tulip', '乾燥花藝術花圈': 'wreath', '迷你多肉組合盆': 'succulent',
    '經典紅玫瑰花束': 'red-rose', '季節鮮花訂閱（月配）': 'seasonal'
  },
  seedImages: {"粉色玫瑰花束": "https://images.unsplash.com/photo-1565279445322-30ab5314ff94", "白色百合花禮盒": "https://images.unsplash.com/photo-1555596112-ca9a1e964e13", "繽紛向日葵花束": "https://images.unsplash.com/photo-1543409777-30250849aa3e", "紫色鬱金香盆栽": "https://images.unsplash.com/photo-1668170782281-330e987237ba", "乾燥花藝術花圈": "https://images.unsplash.com/photo-1610467618849-66d363f5aa16", "迷你多肉組合盆": "https://images.unsplash.com/photo-1763609196518-46f0ee9d5cfd", "經典紅玫瑰花束": "https://images.unsplash.com/photo-1735598564837-dc45391d5ca1", "季節鮮花訂閱（月配）": "https://images.unsplash.com/photo-1610190427750-03e9095f18e3"},
  money(value) { return 'NT$ ' + Number(value || 0).toLocaleString('zh-TW'); },
  date(value) { return new Date(value).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '.'); },
  image(product) {
    const photo = this.photos[product.name];
    const isSeed = !product.image_url || product.image_url.split('?')[0] === this.seedImages[product.name];
    return photo && isSeed ? '/images/flowers/' + photo + '.png?v=flower-life-2' : (product.image_url || '/images/flowers/seasonal.png?v=flower-life-2');
  },
  imageFallback(event) { event.target.onerror = null; event.target.src = '/images/flowers/seasonal.png'; },
  statusLabel(status) { return {pending: '待付款', paid: '已付款', failed: '付款失敗'}[status] || '待確認'; },
  statusIcon(status) { return {pending: 'clock-3', paid: 'circle-check', failed: 'circle-alert'}[status] || 'clock-3'; },
  async refreshCart() {
    try {
      const res = await apiFetch('/api/cart');
      if (!res) return;
      const count = res.data.items.length;
      const badge = document.getElementById('cart-badge');
      if (badge) { badge.textContent = count; badge.hidden = count === 0; }
      document.querySelectorAll('.mobile-cart-count').forEach(el => { el.textContent = count ? '（' + count + '）' : ''; });
    } catch (_) { /* Pages display their own request errors. */ }
  },
  mount(options) {
    const app = Vue.createApp(options);
    app.mixin({ methods: {
      money: this.money, date: this.date, productImage: p => this.image(p), imageFallback: this.imageFallback,
      statusLabel: this.statusLabel, statusIcon: this.statusIcon
    }});
    app.component('fl-icon', { props: ['name'], template: '<span :class="[\'icon\', \'icon-\' + name]" aria-hidden="true"></span>' });
    return app.mount('#app');
  }
};

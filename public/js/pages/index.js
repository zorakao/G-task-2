Flower.mount({
  setup() {
    const { ref, onMounted } = Vue;
    const products = ref([]), pagination = ref({total: 0, page: 1, totalPages: 0});
    const loading = ref(true), loadError = ref(false);
    const descriptions = ['20 朵粉玫瑰，傳遞剛好的心意','純白花香，送上一份優雅祝福','10 朵向日葵，為重要的人打氣','把一小片春天留在窗邊','自然花材，陪伴更長久的日常','留一點綠意給忙碌的生活','99 朵玫瑰，獻給重要的時刻','每月一束，期待下一次花開'];
    function shortDescription(p) { const index = Object.keys(Flower.photos).indexOf(p.name); return index >= 0 ? descriptions[index] : (p.description || '').split(/[。\n]/)[0].slice(0,30); }
    async function loadProducts(page = 1) {
      loading.value = true; loadError.value = false;
      try { const res = await apiFetch('/api/products?page=' + page + '&limit=9'); if (!res) return; products.value = res.data.products.map(p => ({...p, _adding: false})); pagination.value = res.data.pagination; }
      catch (_) { loadError.value = true; } finally { loading.value = false; }
    }
    async function addToCart(product) {
      if (product._adding || product.stock <= 0) return;
      product._adding = true;
      try { const res = await apiFetch('/api/cart', {method:'POST', body:JSON.stringify({productId:product.id, quantity:1})}); if (!res) return; Notification.show('已加入購物車', 'success'); await Flower.refreshCart(); }
      catch (e) { Notification.show(e?.data?.message || '加入購物車失敗，請再試一次。', 'error'); } finally { product._adding = false; }
    }
    onMounted(() => loadProducts());
    return { products, pagination, loading, loadError, loadProducts, addToCart, shortDescription };
  }
});

Flower.mount({
  setup() {
    const { ref, onMounted } = Vue;
    const productId = document.getElementById('app').dataset.productId;
    const product = ref(null), loading = ref(true), notFound = ref(false), loadError = ref(false), quantity = ref(1), adding = ref(false);
    function decrease() { if (quantity.value > 1) quantity.value--; }
    function increase() { if (product.value && quantity.value < product.value.stock) quantity.value++; }
    async function loadProduct() {
      loading.value = true; loadError.value = false; notFound.value = false;
      try { const res = await apiFetch('/api/products/' + productId); if (res) product.value = res.data; }
      catch (e) { if (e.status === 404) notFound.value = true; else loadError.value = true; }
      finally { loading.value = false; }
    }
    async function addToCart() {
      if (!product.value || adding.value || product.value.stock <= 0) return;
      adding.value = true;
      try { const res = await apiFetch('/api/cart', {method:'POST',body:JSON.stringify({productId:product.value.id,quantity:quantity.value})}); if (!res) return; Notification.show('已加入購物車','success'); await Flower.refreshCart(); }
      catch(e) { Notification.show(e?.data?.message || '加入購物車失敗，請再試一次。','error'); } finally { adding.value = false; }
    }
    onMounted(loadProduct);
    return {product,loading,notFound,loadError,quantity,adding,decrease,increase,addToCart,loadProduct};
  }
});

Flower.mount({
  setup() {
    const { ref, computed, onMounted, nextTick } = Vue;
    const items = ref([]), loading = ref(true), loadError = ref(false), selectedItem = ref(null), removeDialog = ref(null), deleting = ref(false);
    const loggedIn = Auth.isLoggedIn();
    const total = computed(() => items.value.reduce((sum,item) => sum + item.product.price * item.quantity, 0));
    async function loadCart() {
      loading.value = true; loadError.value = false;
      try { const res = await apiFetch('/api/cart'); if (res) items.value = res.data.items.map(i => ({...i,_updating:false})); }
      catch (_) { loadError.value = true; } finally { loading.value = false; }
    }
    async function updateQuantity(item, qty) {
      if (qty < 1 || item._updating) return;
      item._updating = true;
      try { const res = await apiFetch('/api/cart/' + item.id, {method:'PATCH',body:JSON.stringify({quantity:qty})}); if (res) item.quantity = qty; }
      catch(e) { Notification.show(e?.data?.message || '更新數量失敗，請再試一次。','error'); }
      finally { item._updating = false; }
    }
    function confirmDelete(item) { selectedItem.value = item; removeDialog.value.showModal(); }
    async function handleDelete() {
      if (deleting.value || !selectedItem.value) return;
      deleting.value = true;
      try {
        const res = await apiFetch('/api/cart/' + selectedItem.value.id, {method:'DELETE'}); if (!res) return;
        items.value = items.value.filter(i => i.id !== selectedItem.value.id); removeDialog.value.close();
        Notification.show('已從購物車移除','success'); await Flower.refreshCart(); await nextTick(); document.getElementById('cart-title').focus();
      } catch(e) { Notification.show(e?.data?.message || '移除失敗，請再試一次。','error'); }
      finally { deleting.value = false; }
    }
    function goCheckout() { location.href = loggedIn ? '/checkout' : '/login?redirect=/checkout'; }
    onMounted(loadCart);
    return {items,loading,loadError,total,loggedIn,selectedItem,removeDialog,deleting,loadCart,updateQuantity,confirmDelete,handleDelete,goCheckout};
  }
});

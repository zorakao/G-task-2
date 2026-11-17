Flower.mount({
  setup() {
    const {ref,onMounted} = Vue;
    if (!Auth.requireAuth()) return {};
    const orders = ref([]), loading = ref(true), loadError = ref(false);
    async function loadOrders() {
      loading.value = true; loadError.value = false;
      try { const res = await apiFetch('/api/orders'); if (res) orders.value = res.data.orders; }
      catch (_) { loadError.value = true; } finally { loading.value = false; }
    }
    onMounted(loadOrders);
    return {orders,loading,loadError,loadOrders};
  }
});

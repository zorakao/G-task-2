Flower.mount({
  setup() {
    const {ref,computed,onMounted,nextTick} = Vue;
    if (!Auth.requireAuth()) return {};
    const user = Auth.getUser(), loading = ref(true), loadError = ref(false), submitting = ref(false), submitError = ref(''), cartItems = ref([]), errors = ref({});
    const form = ref({recipientName:user?.name || '',recipientEmail:user?.email || '',recipientAddress:''});
    const cartTotal = computed(() => cartItems.value.reduce((sum,item) => sum + item.product.price * item.quantity,0));
    function validate() {
      errors.value = {};
      if (!form.value.recipientName.trim()) errors.value.recipientName = '請填寫收件人姓名。';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.recipientEmail)) errors.value.recipientEmail = '請輸入完整的電子郵件，例如 name@example.com。';
      if (!form.value.recipientAddress.trim()) errors.value.recipientAddress = '請填寫收件地址，包含門牌與樓層。';
      if (Object.keys(errors.value).length) { nextTick(() => document.querySelector('[aria-invalid="true"]')?.focus()); return false; }
      return true;
    }
    async function submitOrder() {
      if (submitting.value || !validate()) return;
      submitting.value = true; submitError.value = '';
      try { const res = await apiFetch('/api/orders',{method:'POST',body:JSON.stringify(form.value)}); if (res) location.href = '/orders/' + res.data.id; }
      catch(e) { submitError.value = e?.data?.message || '請確認網路連線後再試一次。'; }
      finally { submitting.value = false; }
    }
    async function loadCart() {
      loading.value = true; loadError.value = false;
      try { const res = await apiFetch('/api/cart'); if (!res) return; cartItems.value = res.data.items; if (!cartItems.value.length) location.href = '/cart'; }
      catch (_) { loadError.value = true; } finally { loading.value = false; }
    }
    onMounted(loadCart);
    return {loading,loadError,submitting,submitError,cartItems,form,errors,cartTotal,submitOrder,loadCart};
  }
});

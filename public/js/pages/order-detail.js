Flower.mount({
  setup() {
    const {ref,computed,onMounted} = Vue;
    if (!Auth.requireAuth()) return {};
    const el = document.getElementById('app'), orderId = el.dataset.orderId;
    const returned = ref(!!el.dataset.paymentResult);
    const order = ref(null), loading = ref(true), loadError = ref(false), notFound = ref(false), paying = ref(false), verifying = ref(false), verifyError = ref('');
    const paymentNotice = computed(() => {
      if (!order.value) return null;
      if (verifying.value) return {status:'pending',text:'正在確認付款結果，請稍候…'};
      if (order.value.status === 'paid') return {status:'paid',text:'已確認付款，謝謝你的心意。'};
      if (verifyError.value) return {status:'failed',text:'暫時無法確認付款結果。請稍後重新查詢，目前訂單狀態尚未更新。'};
      if (order.value.status === 'failed') return {status:'failed',text:'付款未完成，請重新查詢付款結果，確認最新狀態。'};
      if (returned.value) return {status:'pending',text:'尚未確認付款完成，請稍後重新查詢。'};
      return null;
    });
    async function startEcpayCheckout() {
      if (!order.value || order.value.status !== 'pending' || paying.value || verifying.value) return;
      paying.value = true;
      try {
        const res = await apiFetch('/api/orders/' + order.value.id + '/ecpay/checkout-data', {method:'POST'}); if (!res) return;
        const checkout = res.data, form = document.createElement('form'); form.method = checkout.method || 'POST'; form.action = checkout.action;
        for (const [key,value] of Object.entries(checkout.fields || {})) { const input = document.createElement('input'); input.type = 'hidden'; input.name = key; input.value = value; form.append(input); }
        document.body.append(form); form.submit();
      } catch(e) { Notification.show(e?.data?.message || '建立付款失敗，請再試一次。','error'); paying.value = false; }
    }
    async function verifyOrderPayment(showToast = false) {
      if (!order.value || verifying.value || paying.value) return;
      verifying.value = true; verifyError.value = '';
      try {
        const res = await apiFetch('/api/orders/' + order.value.id + '/ecpay/verify', {method:'POST'}); if (!res) return;
        order.value = res.data.order; returned.value = true;
        if (showToast) Notification.show(order.value.status === 'paid' ? '已確認付款成功' : order.value.status === 'failed' ? '查詢結果為付款失敗' : '尚未確認付款完成，請稍後再查詢',order.value.status === 'paid' ? 'success' : 'warning');
      } catch(e) { verifyError.value = e?.data?.message || '查詢失敗'; }
      finally { verifying.value = false; }
    }
    async function loadOrder() {
      loading.value = true; loadError.value = false;
      try { const res = await apiFetch('/api/orders/' + orderId); if (!res) return; order.value = res.data; }
      catch(e) { notFound.value = e.status === 404; loadError.value = true; }
      finally { loading.value = false; }
      if (returned.value && order.value?.status === 'pending') await verifyOrderPayment();
    }
    onMounted(loadOrder);
    return {order,loading,loadError,notFound,paying,verifying,paymentNotice,startEcpayCheckout,verifyOrderPayment,loadOrder};
  }
});

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadPage(script, {search = '', payment = '', apiFetch = vi.fn(), fetch = vi.fn()} = {}) {
  let state;
  const auth = {requireAuth: () => true, getUser: () => null, getAuthHeaders: () => ({}), login: vi.fn()};
  const location = {search, href: '/login'};
  const context = {
    Vue: {ref: value => ({value}), computed: getter => ({get value() {return getter();}}), onMounted: () => {}, nextTick: () => {}},
    Flower: {mount: options => {state = options.setup();}},
    Auth: auth, apiFetch, fetch, location, URLSearchParams,
    Notification: {show: vi.fn()},
    document: {getElementById: () => ({dataset: {orderId:'test-order',paymentResult:payment}}),querySelector: () => null}
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/js/pages',script),'utf8'),context);
  return {state,auth,location};
}

describe('Storefront authentication', () => {
  it('keeps invalid registration fields on the form without sending a request', async () => {
    const fetch = vi.fn();
    const {state} = loadPage('login.js',{fetch});
    state.registerForm.value = {name:'',email:'invalid',password:'123'};
    await state.handleRegister();
    expect(fetch).not.toHaveBeenCalled();
    expect(Object.keys(state.errors.value)).toEqual(['name','email','password']);
  });

  it('shows an authentication failure without clearing the form or navigating', async () => {
    const fetch = vi.fn().mockResolvedValue({ok:false,json:async () => ({data:null,error:'UNAUTHORIZED',message:'電子郵件或密碼不正確'})});
    const {state,auth,location} = loadPage('login.js',{fetch});
    state.loginForm.value = {email:'test@example.com',password:'wrong-password'};
    await state.handleLogin();
    expect(state.authError.value).toBe('電子郵件或密碼不正確');
    expect(state.loginForm.value.email).toBe('test@example.com');
    expect(location.href).toBe('/login');
    expect(auth.login).not.toHaveBeenCalled();
    expect(state.submitting.value).toBe(false);
  });

  it.each([
    ['?redirect=%2Fcheckout','/checkout'],
    ['?redirect=https%3A%2F%2Fexample.com','/'],
    ['?redirect=%2F%2Fexample.com','/'],
    ['?redirect=%2F%5Cexample.com','/']
  ])('accepts only a local return path: %s', async (search, expected) => {
    const fetch = vi.fn().mockResolvedValue({ok:true,json:async () => ({data:{token:'test-token',user:{name:'Test'}}})});
    const {state,auth,location} = loadPage('login.js',{fetch,search});
    state.loginForm.value = {email:'test@example.com',password:'password123'};
    await state.handleLogin();
    expect(auth.login).toHaveBeenCalled();
    expect(location.href).toBe(expected);
  });
});

describe('Storefront verified payment state', () => {
  it('does not show paid from a success query parameter when verification fails', async () => {
    const apiFetch = vi.fn().mockResolvedValueOnce({data:{id:'test-order',status:'pending'}}).mockRejectedValueOnce({data:{message:'上游查詢失敗'}});
    const {state} = loadPage('order-detail.js',{apiFetch,payment:'success'});
    await state.loadOrder();
    expect(apiFetch).toHaveBeenLastCalledWith('/api/orders/test-order/ecpay/verify',{method:'POST'});
    expect(state.order.value.status).toBe('pending');
    expect(state.paymentNotice.value.text).toContain('訂單狀態尚未更新');
    expect(state.verifying.value).toBe(false);
  });

  it('shows paid only after the server verifies the order', async () => {
    const apiFetch = vi.fn().mockResolvedValueOnce({data:{id:'test-order',status:'pending'}}).mockResolvedValueOnce({data:{order:{id:'test-order',status:'paid'}}});
    const {state} = loadPage('order-detail.js',{apiFetch,payment:'return'});
    await state.loadOrder();
    expect(state.order.value.status).toBe('paid');
    expect(state.paymentNotice.value.status).toBe('paid');
  });

  it('prevents overlapping payment-verification requests', async () => {
    let finish;
    const apiFetch = vi.fn().mockResolvedValueOnce({data:{id:'test-order',status:'pending'}}).mockImplementationOnce(() => new Promise(resolve => {finish = resolve;}));
    const {state} = loadPage('order-detail.js',{apiFetch});
    await state.loadOrder();
    const first = state.verifyOrderPayment();
    await state.verifyOrderPayment();
    expect(apiFetch).toHaveBeenCalledTimes(2);
    finish({data:{order:{id:'test-order',status:'pending'}}});
    await first;
    expect(state.verifying.value).toBe(false);
  });
});

describe('Imported design photographs', () => {
  it.each([
    [{name:'粉色玫瑰花束',image_url:'https://images.unsplash.com/photo-1565279445322-30ab5314ff94?w=400'},'/images/flowers/rose.png?v=flower-life-2'],
    [{name:'粉色玫瑰花束',image_url:'https://example.com/custom-bouquet.jpg'},'https://example.com/custom-bouquet.jpg'],
    [{name:'粉色玫瑰花束',image_url:'https://images.unsplash.com/photo-custom-upload'},'https://images.unsplash.com/photo-custom-upload'],
    [{name:'新花禮',image_url:null},'/images/flowers/seasonal.png?v=flower-life-2']
  ])('preserves merchant photo overrides: %j', (product, expected) => {
    const context = vm.createContext({});
    vm.runInContext(fs.readFileSync(path.join(__dirname,'../public/js/storefront.js'),'utf8'),context);
    expect(vm.runInContext('Flower.image('+JSON.stringify(product)+')',context)).toBe(expected);
  });
});

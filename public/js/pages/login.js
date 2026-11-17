Flower.mount({
  setup() {
    const { ref, nextTick } = Vue;
    const activeTab = ref('login'), submitting = ref(false), showPassword = ref(false), errors = ref({}), authError = ref('');
    const loginForm = ref({email:'',password:''}), registerForm = ref({name:'',email:'',password:''});
    function switchTab(tab, focus = false) { if (submitting.value) return; activeTab.value = tab; errors.value = {}; authError.value = ''; showPassword.value = false; if (focus) nextTick(() => document.getElementById(tab + '-tab').focus()); }
    function setEmail(value) { (activeTab.value === 'login' ? loginForm : registerForm).value.email = value; }
    function setPassword(value) { (activeTab.value === 'login' ? loginForm : registerForm).value.password = value; }
    function redirectPath() { const path = new URLSearchParams(location.search).get('redirect'); return path && /^\/(?!\/)/.test(path) && !/[\\\u0000-\u001f]/.test(path) ? path : '/'; }
    function validate(isRegister) {
      errors.value = {}; authError.value = '';
      const form = isRegister ? registerForm.value : loginForm.value;
      form.email = form.email.trim();
      if (isRegister && !form.name.trim()) errors.value.name = '請填寫姓名。';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.value.email = '請輸入完整的電子郵件。';
      if (!form.password) errors.value.password = '請輸入密碼。';
      else if (isRegister && form.password.length < 6) errors.value.password = '密碼至少需要 6 個字元。';
      if (Object.keys(errors.value).length) { nextTick(() => document.querySelector('[aria-invalid="true"]')?.focus()); return false; }
      return true;
    }
    async function authenticate(isRegister) {
      if (submitting.value || !validate(isRegister)) return;
      submitting.value = true;
      try {
        // Authentication failures stay on this form instead of the global API redirect.
        const response = await fetch('/api/auth/' + (isRegister ? 'register' : 'login'), {method:'POST',headers:{'Content-Type':'application/json',...Auth.getAuthHeaders()},body:JSON.stringify(isRegister ? registerForm.value : loginForm.value)});
        const result = await response.json();
        if (!response.ok) { authError.value = result.message || '電子郵件或密碼不正確，請再試一次。'; return; }
        Auth.login(result.data.token,result.data.user); location.href = redirectPath();
      } catch (_) { authError.value = '暫時無法連線，請確認網路後再試一次。'; }
      finally { submitting.value = false; }
    }
    return {activeTab,submitting,showPassword,errors,authError,loginForm,registerForm,switchTab,setEmail,setPassword,handleLogin:() => authenticate(false),handleRegister:() => authenticate(true)};
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // Build user-controlled names as text, never interpolate them into HTML.
  const loggedIn = Auth.isLoggedIn();
  const user = Auth.getUser();
  const authNav = document.getElementById('auth-nav');
  function link(text, href, parent) {
    const el = document.createElement('a'); el.textContent = text; el.href = href; parent.append(el); return el;
  }
  function logout(parent, mobile) {
    const el = document.createElement('button'); el.type = 'button'; el.textContent = '登出';
    el.className = mobile ? 'button button-secondary w-full' : 'nav-logout';
    el.addEventListener('click', () => Auth.logout()); parent.append(el);
  }
  if (loggedIn && authNav) {
    authNav.replaceChildren();
    if (Auth.isAdmin()) link('後台管理', '/admin/products', authNav);
    const name = document.createElement('span'); name.textContent = user?.name || '會員'; authNav.append(name);
    logout(authNav, false);
  }
  for (const id of ['orders-link', 'mobile-orders-link']) {
    const el = document.getElementById(id); if (el) el.hidden = !loggedIn;
  }
  const adminLink = document.getElementById('mobile-admin-link'); if (adminLink) adminLink.hidden = !Auth.isAdmin();
  const mobileAuth = document.getElementById('mobile-auth-nav');
  if (loggedIn && mobileAuth) {
    mobileAuth.replaceChildren(); logout(mobileAuth, true);
    document.getElementById('mobile-greeting').textContent = '你好，' + (user?.name || '會員') + '。';
  }
  document.querySelectorAll('.store-nav nav a').forEach(el => { if (el.pathname === location.pathname) el.setAttribute('aria-current', 'page'); });
  const menu = document.getElementById('mobile-menu');
  const opener = document.getElementById('menu-open');
  if (menu && opener) {
    opener.addEventListener('click', () => { menu.showModal(); opener.setAttribute('aria-expanded', 'true'); });
    document.getElementById('menu-close').addEventListener('click', () => menu.close());
    menu.addEventListener('click', event => { if (event.target === menu && event.clientX > menu.getBoundingClientRect().right) menu.close(); });
    menu.addEventListener('close', () => { opener.setAttribute('aria-expanded', 'false'); opener.focus(); });
  }
  Flower.refreshCart();
});

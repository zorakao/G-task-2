const Notification = {
  _timeout: null,
  show(message, type = 'info') {
    const el = document.getElementById('notification-toast');
    if (!el) return;
    clearTimeout(this._timeout);
    el.className = 'notification-toast notification-' + (['success', 'error', 'warning', 'info'].includes(type) ? type : 'info');
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.textContent = message; el.hidden = false;
    this._timeout = setTimeout(() => { el.hidden = true; }, 5000);
  }
};

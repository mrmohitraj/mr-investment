/* ===================================================================
   MR COIN WALA — PROFILE PAGE LOGIC
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('profileRoot');
  if(!root) return;

  if(!Auth.isLoggedIn()){
    root.innerHTML = `<div class="empty-state">
      <div class="icon">👤</div><h3>You're not logged in</h3>
      <p>Login to view and manage your profile.</p>
      <a href="login.html" class="btn btn-primary">Login</a>
    </div>`;
    return;
  }

  const cu = Auth.currentUser();
  root.innerHTML = `
    <div class="content-card" style="text-align:center;">
      <div class="seller-avatar" style="width:76px;height:76px;font-size:28px;margin:0 auto 10px;">${cu.name.charAt(0)}</div>
      <h2 style="margin:0 0 2px;font-size:18px;">${cu.name}</h2>
      <p class="text-muted" style="font-size:12.5px;margin:0;">${cu.role === 'seller' ? '🌾 Seller Account' : '🧺 Buyer Account'}</p>
    </div>
    <div class="content-card">
      <form id="profileForm">
        <div class="form-group"><label>Full Name</label><input class="form-control" id="pfName" value="${cu.name}"></div>
        <div class="form-group"><label>Phone Number</label><input class="form-control" id="pfPhone" value="${cu.phone}" disabled></div>
        <div class="form-group"><label>Email</label><input class="form-control" id="pfEmail" value="${cu.email||''}" placeholder="you@example.com"></div>
        <button class="btn btn-primary btn-block" type="submit">Save Changes</button>
      </form>
    </div>
    <div class="content-card">
      <div style="display:flex;flex-direction:column;gap:2px;">
        <a href="my-orders.html" class="d-flex justify-between align-center" style="padding:12px 0;border-bottom:1px solid var(--border);font-size:13.5px;font-weight:600;">📦 My Orders <span>›</span></a>
        <a href="wishlist.html" class="d-flex justify-between align-center" style="padding:12px 0;border-bottom:1px solid var(--border);font-size:13.5px;font-weight:600;">♡ Wishlist <span>›</span></a>
        <a href="seller-dashboard.html" class="d-flex justify-between align-center" style="padding:12px 0;border-bottom:1px solid var(--border);font-size:13.5px;font-weight:600;">📊 Seller Dashboard <span>›</span></a>
        <a href="buyer-dashboard.html" class="d-flex justify-between align-center" style="padding:12px 0;font-size:13.5px;font-weight:600;">🧺 Buyer Dashboard <span>›</span></a>
      </div>
    </div>
    <button class="btn btn-outline btn-block" id="logoutBtn" style="margin:0 16px;max-width:calc(100% - 32px);color:var(--danger);border-color:var(--danger);">Logout</button>
  `;

  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    Auth.updateProfile({ name: document.getElementById('pfName').value.trim(), email: document.getElementById('pfEmail').value.trim() });
    showToast('Profile updated successfully', 'success');
  });
  document.getElementById('logoutBtn').addEventListener('click', () => {
    Auth.logout();
    showToast('Logged out', 'success');
    setTimeout(()=> location.href = 'index.html', 600);
  });
});

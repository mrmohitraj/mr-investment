/* ===================================================================
   MR COIN WALA — ADMIN PANEL LOGIC
   Simple client-side password gate + full control over every listing.
   NOTE: because this whole site runs without a real server, this panel
   can only see/edit listings that were added on THIS SAME device/browser.
   Products added by a seller on their own phone will not appear here
   unless everyone shares one central database (see the docs in data.js).
=================================================================== */

// Change this to your own password.
const ADMIN_PASSWORD = "admin123";

document.addEventListener('DOMContentLoaded', () => {
  const loginBox = document.getElementById('adminLoginBox');
  const panel = document.getElementById('adminPanel');
  if(!loginBox || !panel) return;

  const passwordInput = document.getElementById('adminPassword');
  const loginBtn = document.getElementById('adminLoginBtn');
  const searchInput = document.getElementById('adminSearch');
  const listWrap = document.getElementById('adminListings');

  const editModal = document.getElementById('editModal');
  const editOverlay = document.getElementById('editModalOverlay');
  let editingId = null;

  function unlock(){
    loginBox.style.display = 'none';
    panel.style.display = 'block';
    sessionStorage.setItem('mfw_admin_unlocked', '1');
    render();
  }

  if(sessionStorage.getItem('mfw_admin_unlocked') === '1'){ unlock(); }

  loginBtn.addEventListener('click', () => {
    if(passwordInput.value === ADMIN_PASSWORD){ unlock(); }
    else { showToast('Wrong password', 'error'); }
  });
  passwordInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') loginBtn.click(); });

  function render(){
    const query = (searchInput.value || '').toLowerCase();
    const all = Listings.getAll();
    document.getElementById('statTotalListings').textContent = all.length;
    document.getElementById('statCropListings').textContent = all.filter(p=>p.category==='crop').length;
    document.getElementById('statWasteListings').textContent = all.filter(p=>p.category==='waste').length;
    document.getElementById('statSellers').textContent = new Set(all.map(p=>p.seller)).size;

    const orders = Orders.getAll();
    document.getElementById('statTotalOrders').textContent = orders.length;
    const revenue = orders.reduce((s,o)=>s+(o.total||0), 0);
    document.getElementById('statRevenue').textContent = '₹' + revenue.toLocaleString('en-IN');
    const itemCount = {};
    orders.forEach(o => (o.items||[]).forEach(i => { itemCount[i.name] = (itemCount[i.name]||0) + i.qty; }));
    const topEntry = Object.entries(itemCount).sort((a,b)=>b[1]-a[1])[0];
    document.getElementById('statTopCrop').textContent = topEntry ? `${topEntry[0]} (${topEntry[1]})` : '—';

    const filtered = query
      ? all.filter(p => p.name.toLowerCase().includes(query) || (p.seller||'').toLowerCase().includes(query))
      : all;

    if(filtered.length === 0){
      listWrap.innerHTML = `<div class="empty-state">
        <div class="icon">📭</div><h3>No listings found</h3>
        <p>${all.length === 0 ? 'No products have been listed on this device yet.' : 'Try a different search term.'}</p>
      </div>`;
      return;
    }

    listWrap.innerHTML = filtered.map(p => `
      <div class="order-row" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <div style="flex:1;">
          <div style="font-weight:700;font-size:13px;">${p.name}</div>
          <div class="text-muted" style="font-size:11.5px;">₹${Number(p.price).toLocaleString('en-IN')}/${p.unit} • ${p.quantityAvailable} ${p.unit} left</div>
          <div class="text-muted" style="font-size:11px;">Seller: ${p.seller || 'Unknown'} • ${p.district || ''}, ${p.state || ''}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <button class="btn btn-sm btn-outline" data-edit="${p.id}">Edit</button>
          <button class="btn btn-sm btn-outline" data-delete="${p.id}" style="color:var(--danger);border-color:var(--danger);">Delete</button>
        </div>
      </div>`).join('');

    listWrap.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => openEdit(btn.getAttribute('data-edit')));
    });
    listWrap.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete');
        const product = Listings.getAll().find(p => p.id === id);
        if(confirm(`Delete "${product ? product.name : 'this product'}"? This cannot be undone.`)){
          Listings.remove(id);
          showToast('Product deleted', 'success');
          render();
        }
      });
    });
  }

  function openEdit(id){
    const product = Listings.getAll().find(p => p.id === id);
    if(!product) return;
    editingId = id;
    document.getElementById('editName').value = product.name || '';
    document.getElementById('editPrice').value = product.price || 0;
    document.getElementById('editQty').value = product.quantityAvailable || 0;
    document.getElementById('editImage').value = product.image || '';
    document.getElementById('editDescription').value = product.description || '';
    editModal.classList.add('open');
    editOverlay.classList.add('open');
  }

  function closeEdit(){
    editModal.classList.remove('open');
    editOverlay.classList.remove('open');
    editingId = null;
  }

  document.getElementById('closeEditModal').addEventListener('click', closeEdit);
  editOverlay.addEventListener('click', closeEdit);

  document.getElementById('saveEditBtn').addEventListener('click', () => {
    if(!editingId) return;
    Listings.update(editingId, {
      name: document.getElementById('editName').value.trim(),
      price: Number(document.getElementById('editPrice').value) || 0,
      quantityAvailable: Number(document.getElementById('editQty').value) || 0,
      image: document.getElementById('editImage').value.trim(),
      description: document.getElementById('editDescription').value.trim(),
    });
    showToast('Product updated', 'success');
    closeEdit();
    render();
  });

  searchInput.addEventListener('input', render);

  // ---- Tabs ----
  const tabListingsBtn = document.getElementById('tabListingsBtn');
  const tabOrdersBtn = document.getElementById('tabOrdersBtn');
  const listingsTab = document.getElementById('listingsTab');
  const ordersTab = document.getElementById('ordersTab');
  const ordersWrap = document.getElementById('adminOrders');

  tabListingsBtn.addEventListener('click', () => {
    listingsTab.style.display = 'block';
    ordersTab.style.display = 'none';
    tabListingsBtn.classList.replace('btn-outline','btn-primary');
    tabOrdersBtn.classList.replace('btn-primary','btn-outline');
  });
  tabOrdersBtn.addEventListener('click', () => {
    listingsTab.style.display = 'none';
    ordersTab.style.display = 'block';
    tabOrdersBtn.classList.replace('btn-outline','btn-primary');
    tabListingsBtn.classList.replace('btn-primary','btn-outline');
    renderOrders();
  });

  function renderOrders(){
    const orders = Orders.getAll();
    if(orders.length === 0){
      ordersWrap.innerHTML = `<div class="empty-state">
        <div class="icon">🧾</div><h3>No orders yet</h3>
        <p>Orders placed on this device will appear here.</p>
      </div>`;
      return;
    }
    ordersWrap.innerHTML = orders.map(o => `
      <div class="content-card" style="margin:0 0 14px;">
        <div class="d-flex justify-between align-center mb-16">
          <div>
            <div style="font-weight:700;font-size:13px;">Order #${o.id.slice(-6)}</div>
            <div class="text-muted" style="font-size:11px;">${o.buyer} • ${new Date(o.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
          </div>
          <span style="font-weight:800;">₹${o.total.toLocaleString('en-IN')}</span>
        </div>
        <div class="text-muted" style="font-size:11.5px;margin-bottom:10px;">${o.items.map(i=>i.name+' x'+i.qty).join(', ')}</div>
        <div class="form-group" style="margin-bottom:0;">
          <label style="font-size:11px;">Update Status</label>
          <select class="form-control" data-order="${o.id}">
            ${ORDER_STATUSES.map(s => `<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </div>
      </div>`).join('');

    ordersWrap.querySelectorAll('[data-order]').forEach(sel => {
      sel.addEventListener('change', () => {
        Orders.updateStatus(sel.getAttribute('data-order'), sel.value);
        showToast('Order status updated', 'success');
      });
    });
  }
});

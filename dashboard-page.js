/* ===================================================================
   MR COIN WALA — SELLER / BUYER DASHBOARD LOGIC
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* -------- Seller Dashboard -------- */
  const sellerRoot = document.getElementById('sellerDashboardRoot');
  if(sellerRoot){
    if(!Auth.isLoggedIn()){
      showToast('Please login to view your seller dashboard', 'error');
      setTimeout(()=> location.href = 'login.html', 900);
    } else {
      const listings = Listings.byCurrentSeller();
      const orders = Orders.getAll();
      const totalViews = listings.reduce((s,l)=> s + 40 + Math.floor(Math.random()*200), 0);
      document.getElementById('statListings').textContent = listings.length;
      document.getElementById('statViews').textContent = totalViews;
      document.getElementById('statOrders').textContent = orders.length;
      const revenue = listings.reduce((s,l)=> s + l.price * Math.min(3,l.quantityAvailable), 0);
      document.getElementById('statRevenue').textContent = '₹' + revenue.toLocaleString('en-IN');

      // This month's summary — derived from each listing's id timestamp (id: 'U' + Date.now())
      const now = new Date();
      const thisMonthListings = listings.filter(l => {
        const ts = Number(String(l.id).replace(/^U/, ''));
        if(isNaN(ts)) return false;
        const d = new Date(ts);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      const stockValue = listings.reduce((s,l) => s + l.price * l.quantityAvailable, 0);
      const topListing = [...listings].sort((a,b) => (b.price*b.quantityAvailable) - (a.price*a.quantityAvailable))[0];
      const monthlyWrap = document.getElementById('monthlySummary');
      if(monthlyWrap){
        if(listings.length === 0){
          monthlyWrap.innerHTML = `<p class="text-muted" style="margin:0;">List a product to see your monthly summary here.</p>`;
        } else {
          monthlyWrap.innerHTML = `
            <div class="d-flex justify-between"><span class="text-muted">New listings this month</span><span style="font-weight:700;">${thisMonthListings.length}</span></div>
            <div class="d-flex justify-between"><span class="text-muted">Total stock value</span><span style="font-weight:700;">₹${stockValue.toLocaleString('en-IN')}</span></div>
            ${topListing ? `<div class="d-flex justify-between"><span class="text-muted">Top listing</span><span style="font-weight:700;">${topListing.name}</span></div>` : ''}
          `;
        }
      }

      const listWrap = document.getElementById('myListings');
      if(listings.length === 0){
        listWrap.innerHTML = `<div class="empty-state">
          <div class="icon">📤</div><h3>No listings yet</h3>
          <p>Start selling your coins today.</p>
          <a href="sell-product.html" class="btn btn-primary">Create a Listing</a>
        </div>`;
      } else {
        listWrap.innerHTML = listings.map(l => `
          <div class="order-row">
            <img src="${l.image}" alt="${l.name}">
            <div style="flex:1;">
              <div style="font-weight:700;font-size:13px;">${l.name}</div>
              <div class="text-muted" style="font-size:11.5px;">₹${l.price.toLocaleString('en-IN')}/${l.unit} • ${l.quantityAvailable} ${l.unit} left</div>
            </div>
            <span class="status-pill status-Confirmed">Active</span>
          </div>`).join('');
      }
    }
  }

  /* -------- Buyer Dashboard -------- */
  const buyerRoot = document.getElementById('buyerDashboardRoot');
  if(buyerRoot){
    if(!Auth.isLoggedIn()){
      showToast('Please login to view your buyer dashboard', 'error');
      setTimeout(()=> location.href = 'login.html', 900);
    } else {
      const orders = Orders.getAll();
      const wishlist = Wishlist.getItems();
      const totalSpent = orders.reduce((s,o)=>s+o.total,0);
      document.getElementById('statOrdersB').textContent = orders.length;
      document.getElementById('statWishlistB').textContent = wishlist.length;
      document.getElementById('statSpentB').textContent = '₹' + totalSpent.toLocaleString('en-IN');
      document.getElementById('statCartB').textContent = Cart.count();

      const recentWrap = document.getElementById('recentOrdersB');
      if(orders.length === 0){
        recentWrap.innerHTML = `<div class="empty-state">
          <div class="icon">🧺</div><h3>No purchases yet</h3>
          <p>Explore coin listings.</p>
          <a href="buy-crops.html" class="btn btn-primary">Browse Now</a>
        </div>`;
      } else {
        recentWrap.innerHTML = orders.slice(0,5).map(o => `
          <div class="order-row">
            <img src="${o.items[0].image}" alt="">
            <div style="flex:1;">
              <div style="font-weight:700;font-size:13px;">${o.items[0].name}${o.items.length>1 ? ` + ${o.items.length-1} more` : ''}</div>
              <div class="text-muted" style="font-size:11.5px;">${new Date(o.date).toLocaleDateString('en-IN')}</div>
            </div>
            <span style="font-weight:800;font-size:13px;">₹${o.total.toLocaleString('en-IN')}</span>
          </div>`).join('');
      }
    }
  }

  /* -------- Tabs (shared) -------- */
  document.querySelectorAll('.tab-row').forEach(tabRow => {
    const buttons = tabRow.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.getAttribute('data-tab');
        const panels = document.querySelectorAll('.tab-panel[data-group="' + tabRow.getAttribute('data-group') + '"]');
        panels.forEach(p => p.classList.toggle('active', p.getAttribute('data-tab') === target));
      });
    });
  });
});

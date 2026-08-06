/* ===================================================================
   MR COIN WALA — SHARED COMPONENTS
   Injects header, mobile nav drawer, bottom nav, footer, floating
   chat button and scroll-to-top button into every page, and exposes
   reusable render helpers (product card, toast).
=================================================================== */

const CURRENT_PAGE = (location.pathname.split('/').pop() || 'index.html');

function headerHTML(){
  const cu = Auth.currentUser();
  const lang = getLang();
  return `
  <header class="site-header" id="siteHeader">
    <div class="header-inner">
      <button class="icon-btn" id="menuBtn" aria-label="Menu">☰</button>
      <a href="index.html" class="logo"><span class="logo-icon">🌾</span><span class="hide-sm">Mr Coin Wala</span></a>
      <div class="location-pill" id="locationPill">📍 <span>${t('selectLocation')}</span></div>
      <div class="header-search">
        <span>🔍</span>
        <input type="text" id="headerSearchInput" placeholder="${t('searchPlaceholder')}" />
      </div>
      <div class="header-actions">
        <button class="icon-btn" id="darkModeBtn" aria-label="Dark mode" style="font-size:15px;">🌙</button>
        <button class="icon-btn" id="langToggleBtn" aria-label="Language" style="font-size:11px;font-weight:800;">${lang === 'hi' ? 'EN' : 'हिं'}</button>
        <a href="wishlist.html" class="icon-btn" aria-label="Wishlist">♡<span class="badge-count" id="wishlistCount">0</span></a>
        <a href="cart.html" class="icon-btn" aria-label="Cart">🛒<span class="badge-count" id="cartCount">0</span></a>
        <a href="${cu ? 'profile.html' : 'login.html'}" class="icon-btn" aria-label="Account">👤</a>
      </div>
    </div>
  </header>
  <div class="nav-overlay" id="navOverlay"></div>
  <nav class="nav-drawer" id="navDrawer">
    <div class="nav-drawer-header">
      <div style="font-weight:800;font-size:16px;">${cu ? 'Hi, ' + cu.name.split(' ')[0] : t('welcome')}</div>
      <div style="font-size:12px;opacity:.85;margin-top:4px;">${cu ? cu.phone : t('loginToShop')}</div>
    </div>
    <ul>
      <li><a href="index.html">🏠 ${t('home')}</a></li>
      <li><a href="buy-crops.html">🪙 ${t('buyCrops')}</a></li>
      <li><a href="crop-waste.html">♻️ ${t('cropWaste')}</a></li>
      <li><a href="sell-product.html">📤 ${t('sellProduct')}</a></li>
      <li><a href="cart.html">🛒 ${t('myCart')}</a></li>
      <li><a href="wishlist.html">♡ ${t('wishlist')}</a></li>
      <li><a href="my-orders.html">📦 ${t('myOrders')}</a></li>
      <li><a href="seller-dashboard.html">📊 ${t('sellerDashboard')}</a></li>
      <li><a href="buyer-dashboard.html">🧺 ${t('buyerDashboard')}</a></li>
      <li><a href="profile.html">👤 ${t('profile')}</a></li>
      <li><a href="about.html">ℹ️ ${t('aboutUs')}</a></li>
      <li><a href="contact.html">✉️ ${t('contact')}</a></li>
      <li><a href="faq.html">❓ ${t('faq')}</a></li>
      <li><a href="privacy-policy.html">🔒 ${t('privacyPolicy')}</a></li>
      <li><a href="terms.html">📄 ${t('terms')}</a></li>
      ${cu ? `<li><a href="#" id="drawerLogout">🚪 ${t('logout')}</a></li>` : `<li><a href="login.html">🔑 ${t('login')}</a></li>`}
    </ul>
  </nav>`;
}

function bottomNavHTML(){
  const items = [
    ['index.html','🏠',t('home')], ['buy-crops.html','🪙',t('buy')],
    ['sell-product.html','📤',t('sell')], ['cart.html','🛒',t('cart')], ['profile.html','👤',t('profile')]
  ];
  return `<nav class="bottom-nav">${items.map(([href,icon,label])=>
    `<a href="${href}" class="${CURRENT_PAGE===href?'active':''}"><span class="bn-icon">${icon}</span>${label}</a>`
  ).join('')}</nav>`;
}

function footerHTML(){
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>Mr Coin Wala</h4>
          <ul>
            <li>India's dedicated marketplace for coins &amp; bulk coins.</li>
          </ul>
          <div class="social-row">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="Twitter">𝕏</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="about.html">${t('aboutUs')}</a></li>
            <li><a href="contact.html">${t('contact')}</a></li>
            <li><a href="seller-dashboard.html">Become a Seller</a></li>
            <li><a href="faq.html">${t('faq')}</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a href="buy-crops.html">${t('buyCrops')}</a></li>
            <li><a href="crop-waste.html">${t('cropWaste')}</a></li>
            <li><a href="cart.html">${t('myCart')}</a></li>
            <li><a href="my-orders.html">${t('myOrders')}</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="privacy-policy.html">${t('privacyPolicy')}</a></li>
            <li><a href="terms.html">${t('terms')}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear()} Mr Coin Wala. All rights reserved.</div>
    </div>
  </footer>
  <div class="scroll-top-btn" id="scrollTopBtn">↑</div>
  <a href="contact.html" class="floating-chat" aria-label="Chat with us">💬</a>
  <div class="toast-wrap" id="toastWrap"></div>
  <div class="zoom-modal" id="zoomModal"><span class="zoom-close" id="zoomClose">×</span><img id="zoomImg" src="" alt=""></div>
  <div class="filter-sheet-overlay" id="locationOverlay"></div>
  <div class="filter-sheet" id="locationModal">
    <div class="d-flex justify-between align-center mb-16">
      <h3 style="margin:0;">Set Delivery Location</h3>
      <button id="closeLocationModal" class="btn btn-sm btn-outline">✕</button>
    </div>
    <div class="form-group">
      <label>Village / City, District, State</label>
      <input type="text" id="locationInput" class="form-control" placeholder="e.g. Lakhisarai, Bihar">
    </div>
    <button class="btn btn-primary btn-block" id="saveLocationBtn">Save Location</button>
  </div>
  `;
}

function mountLayout(){
  document.getElementById('header-mount').innerHTML = headerHTML();
  document.getElementById('footer-mount').innerHTML = footerHTML() + bottomNavHTML();
  wireLayoutEvents();
  updateBadgeCounts();
}

function wireLayoutEvents(){
  const menuBtn = document.getElementById('menuBtn');
  const overlay = document.getElementById('navOverlay');
  const drawer = document.getElementById('navDrawer');
  function openDrawer(){ overlay.classList.add('open'); drawer.classList.add('open'); }
  function closeDrawer(){ overlay.classList.remove('open'); drawer.classList.remove('open'); }
  menuBtn && menuBtn.addEventListener('click', openDrawer);
  overlay && overlay.addEventListener('click', closeDrawer);

  const logout = document.getElementById('drawerLogout');
  logout && logout.addEventListener('click', (e)=>{ e.preventDefault(); Auth.logout(); showToast('Logged out successfully','success'); setTimeout(()=>location.href='index.html', 600); });

  const langBtn = document.getElementById('langToggleBtn');
  langBtn && langBtn.addEventListener('click', () => setLang(getLang() === 'hi' ? 'en' : 'hi'));

  const darkBtn = document.getElementById('darkModeBtn');
  if(darkBtn){
    if(Storage.get('darkMode', false)){ document.body.classList.add('dark-mode'); darkBtn.textContent = '☀️'; }
    darkBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      Storage.set('darkMode', isDark);
      darkBtn.textContent = isDark ? '☀️' : '🌙';
    });
  }

  const searchInput = document.getElementById('headerSearchInput');
  if(searchInput){
    searchInput.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' && searchInput.value.trim()){
        location.href = 'buy-crops.html?q=' + encodeURIComponent(searchInput.value.trim());
      }
    });
  }

  window.addEventListener('scroll', ()=>{
    const header = document.getElementById('siteHeader');
    const scrollBtn = document.getElementById('scrollTopBtn');
    if(window.scrollY > 40) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    if(scrollBtn){
      if(window.scrollY > 500) scrollBtn.classList.add('show'); else scrollBtn.classList.remove('show');
    }
  });
  const scrollBtn = document.getElementById('scrollTopBtn');
  scrollBtn && scrollBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  const zoomModal = document.getElementById('zoomModal');
  const zoomClose = document.getElementById('zoomClose');
  zoomClose && zoomClose.addEventListener('click', ()=> zoomModal.classList.remove('open'));
  zoomModal && zoomModal.addEventListener('click', (e)=>{ if(e.target===zoomModal) zoomModal.classList.remove('open'); });

  // location pill: inline modal (avoids window.prompt, which many
  // mobile browsers/webviews block or ignore silently)
  const pill = document.getElementById('locationPill');
  const locationModal = document.getElementById('locationModal');
  const locationOverlay = document.getElementById('locationOverlay');
  const locationInput = document.getElementById('locationInput');
  if(pill){
    const saved = Storage.get('location', null);
    if(saved) pill.querySelector('span').textContent = saved;
    pill.addEventListener('click', ()=>{
      locationInput.value = Storage.get('location','') || '';
      locationModal.classList.add('open');
      locationOverlay.classList.add('open');
      locationInput.focus();
    });
  }
  function closeLocationModal(){
    locationModal.classList.remove('open');
    locationOverlay.classList.remove('open');
  }
  const closeLocBtn = document.getElementById('closeLocationModal');
  closeLocBtn && closeLocBtn.addEventListener('click', closeLocationModal);
  locationOverlay && locationOverlay.addEventListener('click', closeLocationModal);
  const saveLocBtn = document.getElementById('saveLocationBtn');
  if(saveLocBtn){
    saveLocBtn.addEventListener('click', ()=>{
      const val = (locationInput.value || '').trim();
      if(val){
        Storage.set('location', val);
        pill.querySelector('span').textContent = val;
        showToast('Location updated','success');
      }
      closeLocationModal();
    });
    locationInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') saveLocBtn.click(); });
  }
}

function updateBadgeCounts(){
  const cc = document.getElementById('cartCount');
  const wc = document.getElementById('wishlistCount');
  if(cc) cc.textContent = Cart.count();
  if(wc) wc.textContent = Wishlist.count();
}

function showToast(message, type=''){
  const wrap = document.getElementById('toastWrap');
  if(!wrap) return;
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = message;
  wrap.appendChild(el);
  requestAnimationFrame(()=> el.classList.add('show'));
  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=> el.remove(), 300); }, 2200);
}

function openZoom(src){
  const modal = document.getElementById('zoomModal');
  document.getElementById('zoomImg').src = src;
  modal.classList.add('open');
}

/* ---------------- Product card renderer ---------------- */
function stockBadgeHTML(p){
  const qty = Number(p.quantityAvailable);
  if(isNaN(qty)) return '';
  if(qty <= 0) return '<span class="pc-badge" style="background:var(--danger);left:auto;right:8px;">Out of Stock</span>';
  if(qty <= 10) return `<span class="pc-badge" style="background:#e67e22;left:auto;right:8px;">Only ${qty} ${p.unit} left</span>`;
  return '';
}

function productCardHTML(p){
  const inWishlist = Wishlist.has(p.id);
  const outOfStock = Number(p.quantityAvailable) <= 0;
  return `
  <div class="product-card fade-in" data-id="${p.id}">
    <a href="product-details.html?id=${p.id}" style="display:block;">
      <div class="pc-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.verified ? '<span class="pc-badge">Verified</span>' : ''}
        ${stockBadgeHTML(p)}
      </div>
    </a>
    <button class="pc-wishlist ${inWishlist?'active':''}" data-wish="${p.id}">${inWishlist?'❤':'♡'}</button>
    <div class="pc-body">
      <a href="product-details.html?id=${p.id}"><h4 class="pc-name">${p.name}</h4></a>
      <p class="pc-loc">📍 ${p.district}, ${p.state}</p>
      <div class="pc-price-row"><span class="pc-price">₹${p.price.toLocaleString('en-IN')}</span><span class="pc-unit">/${p.unit}</span></div>
      <div class="pc-rating">★ ${p.rating}</div>
      <div class="pc-actions">
        <button class="btn btn-outline" data-cart="${p.id}" ${outOfStock?'disabled':''}>${t('add')}</button>
        <button class="btn btn-primary" data-buy="${p.id}" ${outOfStock?'disabled':''}>${outOfStock ? 'Out of Stock' : t('buyNow')}</button>
      </div>
    </div>
  </div>`;
}

function wireProductGridEvents(container){
  container.querySelectorAll('[data-wish]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault(); e.stopPropagation();
      const id = btn.getAttribute('data-wish');
      const product = DataAPI.getProductById(id);
      const added = Wishlist.toggle(product);
      btn.classList.toggle('active', added);
      btn.textContent = added ? '❤' : '♡';
      updateBadgeCounts();
      showToast(added ? 'Added to wishlist' : 'Removed from wishlist', 'success');
    });
  });
  container.querySelectorAll('[data-cart]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault(); e.stopPropagation();
      const id = btn.getAttribute('data-cart');
      const product = DataAPI.getProductById(id);
      const qty = Number(product.minOrderQty) > 1 ? Number(product.minOrderQty) : 1;
      Cart.add(product, qty);
      updateBadgeCounts();
      showToast(qty > 1 ? `Added ${qty} ${product.unit} to cart (minimum order)` : 'Added to cart', 'success');
    });
  });
  container.querySelectorAll('[data-buy]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault(); e.stopPropagation();
      const id = btn.getAttribute('data-buy');
      const product = DataAPI.getProductById(id);
      const qty = Number(product.minOrderQty) > 1 ? Number(product.minOrderQty) : 1;
      Cart.add(product, qty);
      updateBadgeCounts();
      location.href = 'cart.html';
    });
  });
}

function skeletonCards(n=6){
  let html='';
  for(let i=0;i<n;i++){
    html += `<div class="product-card"><div class="skeleton skeleton-card"></div><div style="padding:10px;">
      <div class="skeleton skeleton-text" style="width:80%;"></div>
      <div class="skeleton skeleton-text" style="width:50%;"></div>
      <div class="skeleton skeleton-text" style="width:40%;"></div>
    </div></div>`;
  }
  return html;
}

document.addEventListener('DOMContentLoaded', mountLayout);

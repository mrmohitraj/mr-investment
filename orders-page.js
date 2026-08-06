/* ===================================================================
   MR COIN WALA — MY ORDERS PAGE LOGIC
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('ordersList');
  if(!wrap) return;

  function render(){
    const orders = Orders.getAll();
    if(orders.length === 0){
      wrap.innerHTML = `<div class="empty-state">
        <div class="icon">📦</div><h3>No orders yet</h3>
        <p>Your placed orders will appear here.</p>
        <a href="buy-crops.html" class="btn btn-primary">Start Shopping</a>
      </div>`;
      return;
    }
    wrap.innerHTML = orders.map(o => {
      const status = o.status || 'Confirmed';
      const statusClass = status.replace(/\s+/g,'');
      const stepIdx = ORDER_STATUSES.indexOf(status);
      return `
      <div class="content-card" style="margin:0 0 14px;">
        <div class="d-flex justify-between align-center mb-16">
          <div>
            <div style="font-weight:700;font-size:13px;">Order #${o.id.slice(-6)}</div>
            <div class="text-muted" style="font-size:11px;">${new Date(o.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
          </div>
          <span class="status-pill status-${statusClass}">${status}</span>
        </div>
        <div class="order-progress">
          ${ORDER_STATUSES.map((s,i) => `<div class="order-progress-step ${i<=stepIdx?'done':''}"><span class="dot"></span>${s}</div>`).join('')}
        </div>
        ${o.items.map(i => `
          <div class="order-row">
            <img src="${i.image}" alt="${i.name}">
            <div style="flex:1;">
              <div style="font-weight:700;font-size:13px;">${i.name}</div>
              <div class="text-muted" style="font-size:11.5px;">Qty: ${i.qty} ${i.unit} × ₹${i.price.toLocaleString('en-IN')}</div>
              ${status === 'Delivered' ? `<button class="btn btn-sm btn-outline" data-review="${i.id}" data-name="${i.name}" style="margin-top:6px;">⭐ Rate this product</button>` : ''}
            </div>
          </div>`).join('')}
        <div class="d-flex justify-between align-center" style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--border);">
          <span class="text-muted" style="font-size:12px;">${o.address}</span>
          <span style="font-weight:800;">₹${o.total.toLocaleString('en-IN')}</span>
        </div>
        <button class="btn btn-sm btn-outline btn-block" data-repeat="${o.id}" style="margin-top:10px;">🔁 Repeat this order</button>
        <button class="btn btn-sm" data-dispute="${o.id}" style="background:none;color:var(--text-muted);text-decoration:underline;padding:8px 0 0;width:100%;">⚠️ Report a problem with this order</button>
      </div>`;
    }).join('');

    wrap.querySelectorAll('[data-review]').forEach(btn => {
      btn.addEventListener('click', () => openReviewModal(btn.getAttribute('data-review'), btn.getAttribute('data-name')));
    });
    wrap.querySelectorAll('[data-dispute]').forEach(btn => {
      btn.addEventListener('click', () => {
        const order = Orders.getAll().find(o => o.id === btn.getAttribute('data-dispute'));
        if(!order) return;
        const msg = `⚠️ Issue with Order #${order.id.slice(-6)}\nItems: ${order.items.map(i=>i.name).join(', ')}\nTotal: ₹${order.total.toLocaleString('en-IN')}\n\nProblem: `;
        window.location.href = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      });
    });
    wrap.querySelectorAll('[data-repeat]').forEach(btn => {
      btn.addEventListener('click', () => {
        const order = Orders.getAll().find(o => o.id === btn.getAttribute('data-repeat'));
        if(!order) return;
        let addedCount = 0;
        order.items.forEach(i => {
          const product = DataAPI.getProductById(i.id);
          if(product && Number(product.quantityAvailable) > 0){ Cart.add(product, i.qty); addedCount++; }
        });
        updateBadgeCounts();
        if(addedCount === 0){ showToast('These items are no longer available', 'error'); return; }
        showToast('Items added to cart', 'success');
        setTimeout(()=> location.href = 'cart.html', 600);
      });
    });
  }

  // ---- Review modal ----
  const reviewModal = document.getElementById('reviewModal');
  const reviewOverlay = document.getElementById('reviewOverlay');
  const starPicker = document.getElementById('starPicker');
  let currentRating = 0;
  let currentProductId = null;

  function paintStars(){
    starPicker.textContent = '★★★★★☆☆☆☆☆'.slice(5 - currentRating, 10 - currentRating);
  }

  if(starPicker){
    starPicker.addEventListener('click', (e) => {
      const rect = starPicker.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      currentRating = Math.max(1, Math.min(5, Math.ceil(pct * 5)));
      paintStars();
    });
  }

  window.openReviewModal = function(productId, productName){
    if(!reviewModal) return;
    currentProductId = productId;
    currentRating = 5;
    paintStars();
    document.getElementById('reviewProductName').textContent = 'Rate: ' + productName;
    document.getElementById('reviewText').value = '';
    reviewModal.classList.add('open');
    reviewOverlay.classList.add('open');
  };

  function closeReview(){
    reviewModal.classList.remove('open');
    reviewOverlay.classList.remove('open');
  }
  const closeBtn = document.getElementById('closeReviewModal');
  if(closeBtn) closeBtn.addEventListener('click', closeReview);
  if(reviewOverlay) reviewOverlay.addEventListener('click', closeReview);

  const submitBtn = document.getElementById('submitReviewBtn');
  if(submitBtn){
    submitBtn.addEventListener('click', () => {
      if(!currentProductId) return;
      const name = document.getElementById('reviewProductName').textContent.replace('Rate: ','');
      Reviews.add(currentProductId, name, currentRating, document.getElementById('reviewText').value.trim());
      showToast('Thanks for your review! ⭐', 'success');
      closeReview();
    });
  }
  render();
});

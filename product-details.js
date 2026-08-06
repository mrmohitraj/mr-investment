/* ===================================================================
   MR COIN WALA — PRODUCT DETAILS PAGE
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const root = document.getElementById('productDetailRoot');
  if(!root) return;

  const product = DataAPI.getProductById(id);
  if(!product){
    root.innerHTML = `<div class="empty-state"><div class="icon">📦</div><h3>Product not found</h3>
      <p>This listing may have been removed.</p><a href="buy-crops.html" class="btn btn-primary">Browse Products</a></div>`;
    return;
  }

  document.title = product.name + ' | Mr Coin Wala';
  RecentlyViewed.add(product.id);
  const isOutOfStock = Number(product.quantityAvailable) <= 0;
  const isLowStock = !isOutOfStock && Number(product.quantityAvailable) <= 10;
  const minOrderQty = Number(product.minOrderQty) > 1 ? Number(product.minOrderQty) : 1;
  let qty = isOutOfStock ? 0 : minOrderQty;
  const inWishlist = Wishlist.has(product.id);
  const reviewStats = Reviews.averageFor(product.id);
  const displayRating = reviewStats ? reviewStats.avg : product.rating;
  const displayReviewCount = reviewStats ? reviewStats.count : product.reviewCount;

  root.innerHTML = `
    <div class="gallery-main" id="mainImgWrap"><img id="mainImg" src="${product.gallery[0]}" alt="${product.name}"></div>
    <div class="gallery-thumbs" id="thumbRow">
      ${product.gallery.map((g,i)=>`<img src="${g}" class="${i===0?'active':''}" data-src="${g}">`).join('')}
    </div>
    <div class="content-card">
      <div class="d-flex justify-between align-center" style="margin-bottom:6px;">
        <span class="tag-pill">${product.subCategoryName}</span>
        ${product.verified ? '<span class="badge-verified">✔ Verified Seller</span>' : ''}
      </div>
      <h1 style="font-size:19px;font-weight:800;margin:4px 0;">${product.name}</h1>
      <div class="d-flex align-center gap-8" style="margin-bottom:8px;">
        <span class="pc-rating">★ ${displayRating}</span>
        <span class="text-muted" style="font-size:12px;">${displayReviewCount} reviews</span>
      </div>
      <div class="pc-price-row" style="margin-bottom:2px;">
        <span class="pc-price" style="font-size:24px;">₹${product.price.toLocaleString('en-IN')}</span>
        <span class="pc-unit">/${product.unit}</span>
      </div>
      <p class="text-muted" style="font-size:12.5px;">📍 ${product.district}, ${product.state} &nbsp;•&nbsp; 🚚 Delivery in ${product.deliveryDays} days</p>
      ${isOutOfStock ? '<p style="color:var(--danger);font-weight:700;font-size:13px;">Out of Stock</p>'
        : (isLowStock ? `<p style="color:#e67e22;font-weight:700;font-size:13px;">Only ${product.quantityAvailable} ${product.unit} left — order soon!</p>` : '')}

      <div class="qty-selector-detail">
        <span style="font-size:13px;font-weight:700;">Quantity:</span>
        <div class="qty-stepper">
          <button id="qtyMinus" ${isOutOfStock?'disabled':''}>−</button><span id="qtyVal">${isOutOfStock ? 0 : minOrderQty}</span><button id="qtyPlus" ${isOutOfStock?'disabled':''}>+</button>
        </div>
        <span class="text-muted" style="font-size:12px;">${product.quantityAvailable} ${product.unit} available${minOrderQty > 1 ? ` • Min order: ${minOrderQty} ${product.unit}` : ''}</span>
      </div>

      <div class="d-flex gap-8" style="margin:14px 0;">
        <button class="btn btn-outline btn-block" id="wishlistBtn">${inWishlist ? '❤ Wishlisted' : '♡ Wishlist'}</button>
        <button class="btn btn-outline btn-block" id="addCartBtn" ${isOutOfStock?'disabled':''}>Add to Cart</button>
      </div>
      <button class="btn btn-primary btn-block" id="buyNowBtn" style="margin-bottom:6px;" ${isOutOfStock?'disabled':''}>${isOutOfStock ? 'Out of Stock' : 'Buy Now'}</button>
      <div class="d-flex gap-8" style="margin-bottom:6px;">
        <button class="btn btn-outline btn-block" id="offerBtn" ${isOutOfStock?'disabled':''}>💰 Make an Offer</button>
        <button class="btn btn-outline btn-block" id="shareBtn">📤 Share</button>
      </div>
      <p class="text-muted" style="font-size:11.5px;margin:0 0 10px;">🚚 Cash on Delivery available &nbsp;•&nbsp; Payment directly to seller on delivery</p>

      <div class="seller-info-box mt-16">
        <div class="seller-avatar" style="margin:0;">${product.seller.charAt(0)}</div>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:13.5px;">${product.seller}</div>
          <div class="text-muted" style="font-size:11.5px;">${product.district}, ${product.state}</div>
        </div>
        <button class="btn btn-sm btn-outline" id="callSellerBtn">📞 Call</button>
        <button class="btn btn-sm btn-accent" id="chatSellerBtn">💬 Chat</button>
      </div>
      <button class="btn btn-sm" id="reportBtn" style="background:none;color:var(--text-muted);text-decoration:underline;padding:10px 0 0;">🚩 Report this listing</button>
    </div>

    <div class="content-card">
      <h3 class="section-title">Description</h3>
      <p style="font-size:13.5px;color:var(--text-muted);line-height:1.7;">${product.description}</p>
    </div>

    <div class="content-card">
      <h3 class="section-title">Specifications</h3>
      <table class="spec-table">
        <tr><td>Category</td><td>${product.category === 'crop' ? 'Coin' : 'Bulk Coins'}</td></tr>
        <tr><td>Sub-category</td><td>${product.subCategoryName}</td></tr>
        <tr><td>Unit</td><td>Per ${product.unit}</td></tr>
        <tr><td>Available Quantity</td><td>${product.quantityAvailable} ${product.unit}</td></tr>
        <tr><td>Seller</td><td>${product.seller}</td></tr>
        <tr><td>Location</td><td>${product.district}, ${product.state}</td></tr>
        <tr><td>Estimated Delivery</td><td>${product.deliveryDays} days</td></tr>
      </table>
    </div>

    <div class="content-card">
      <div class="d-flex justify-between align-center mb-16">
        <h3 class="section-title" style="margin:0;">Reviews (${displayReviewCount})</h3>
        <button class="btn btn-sm btn-outline" id="writeReviewBtn">✍️ Write a Review</button>
      </div>
      <div id="writeReviewBox" style="display:none;margin-bottom:14px;padding:12px;background:var(--bg-light);border-radius:12px;">
        <div class="form-group">
          <label>Your Rating</label>
          <div id="pdStarPicker" style="font-size:28px;letter-spacing:6px;cursor:pointer;">★★★★★</div>
        </div>
        <div class="form-group">
          <textarea id="pdReviewText" class="form-control" rows="2" placeholder="Share your experience with this product..."></textarea>
        </div>
        <button class="btn btn-primary btn-sm" id="pdSubmitReview">Submit</button>
      </div>
      <div id="detailReviews" class="stagger" style="display:flex;flex-direction:column;gap:10px;"></div>
    </div>

    <div class="content-card">
      <h3 class="section-title">Related Products</h3>
      <div class="grid-scroll" id="relatedProducts"></div>
    </div>
  `;

  // reviews — real reviews submitted by buyers, most recent first
  const rWrap = document.getElementById('detailReviews');
  function renderReviews(){
    const realReviews = Reviews.forProduct(product.id);
    if(realReviews.length === 0){
      rWrap.innerHTML = `<p class="text-muted" style="font-size:12.5px;">No reviews yet — be the first to review this product.</p>`;
      return;
    }
    rWrap.innerHTML = realReviews.map(r => `
      <div class="review-card" style="min-width:auto;">
        <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
        ${r.text ? `<p class="review-text">"${r.text}"</p>` : ''}
        <div class="review-user"><div class="seller-avatar" style="width:28px;height:28px;font-size:12px;margin:0;">${r.reviewer.charAt(0)}</div>${r.reviewer}</div>
      </div>`).join('');
  }
  renderReviews();

  // write a review
  let pdRating = 5;
  const pdStarPicker = document.getElementById('pdStarPicker');
  function paintPdStars(){ pdStarPicker.textContent = '★★★★★☆☆☆☆☆'.slice(5-pdRating, 10-pdRating); }
  pdStarPicker.addEventListener('click', (e) => {
    const rect = pdStarPicker.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    pdRating = Math.max(1, Math.min(5, Math.ceil(pct*5)));
    paintPdStars();
  });
  document.getElementById('writeReviewBtn').addEventListener('click', () => {
    if(!Auth.isLoggedIn()){ showToast('Please login to write a review', 'error'); setTimeout(()=>location.href='login.html', 800); return; }
    const box = document.getElementById('writeReviewBox');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  });
  document.getElementById('pdSubmitReview').addEventListener('click', () => {
    Reviews.add(product.id, product.name, pdRating, document.getElementById('pdReviewText').value.trim());
    document.getElementById('writeReviewBox').style.display = 'none';
    document.getElementById('pdReviewText').value = '';
    showToast('Thanks for your review! ⭐', 'success');
    renderReviews();
  });

  // related
  const relWrap = document.getElementById('relatedProducts');
  const related = DataAPI.getRelated(product, 6);
  relWrap.innerHTML = related.map(productCardHTML).join('');
  wireProductGridEvents(relWrap);

  // gallery
  document.getElementById('mainImgWrap').addEventListener('click', ()=> openZoom(document.getElementById('mainImg').src));
  document.querySelectorAll('#thumbRow img').forEach(img=>{
    img.addEventListener('click', ()=>{
      document.getElementById('mainImg').src = img.getAttribute('data-src');
      document.querySelectorAll('#thumbRow img').forEach(i=>i.classList.remove('active'));
      img.classList.add('active');
    });
  });

  // qty stepper
  const qtyVal = document.getElementById('qtyVal');
  document.getElementById('qtyMinus').addEventListener('click', ()=>{ if(qty>minOrderQty){ qty--; qtyVal.textContent = qty; } });
  document.getElementById('qtyPlus').addEventListener('click', ()=>{ if(qty<product.quantityAvailable){ qty++; qtyVal.textContent = qty; } });

  // wishlist
  const wishBtn = document.getElementById('wishlistBtn');
  wishBtn.addEventListener('click', ()=>{
    const added = Wishlist.toggle(product);
    wishBtn.textContent = added ? '❤ Wishlisted' : '♡ Wishlist';
    updateBadgeCounts();
    showToast(added ? 'Added to wishlist' : 'Removed from wishlist', 'success');
  });

  document.getElementById('addCartBtn').addEventListener('click', ()=>{
    Cart.add(product, qty);
    updateBadgeCounts();
    showToast(`${qty} ${product.unit} added to cart`, 'success');
  });
  document.getElementById('buyNowBtn').addEventListener('click', ()=>{
    Cart.add(product, qty);
    updateBadgeCounts();
    location.href = 'cart.html';
  });
  document.getElementById('callSellerBtn').addEventListener('click', ()=> {
    if(product.sellerPhone){ showToast('Seller contact number: ' + product.sellerPhone, ''); }
    else { showToast('Seller contact number not available for this listing.', 'error'); }
  });
  document.getElementById('chatSellerBtn').addEventListener('click', ()=> {
    const sellerNumber = (product.sellerPhone || '').replace(/\D/g,'');
    if(!sellerNumber){ showToast('Seller WhatsApp number not available — try the Contact page.', 'error'); return; }
    const number = sellerNumber.length === 10 ? '91' + sellerNumber : sellerNumber;
    const msg = `Hi, I'm interested in your listing "${product.name}" on Mr Coin Wala. Is it still available?`;
    window.location.href = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  });

  document.getElementById('shareBtn').addEventListener('click', ()=> {
    const shareMsg = `🌾 *${product.name}*\n₹${product.price.toLocaleString('en-IN')}/${product.unit} — ${product.district}, ${product.state}\n\nCheck it out on Mr Coin Wala:\n${location.href}`;
    window.location.href = `https://wa.me/?text=${encodeURIComponent(shareMsg)}`;
  });

  document.getElementById('offerBtn').addEventListener('click', ()=> {
    if(!Auth.isLoggedIn()){
      showToast('Please login to make an offer', 'error');
      setTimeout(()=> location.href = 'login.html', 800);
      return;
    }
    const cu = Auth.currentUser();
    const sellerNumber = (product.sellerPhone || '').replace(/\D/g,'');
    const number = sellerNumber ? (sellerNumber.length === 10 ? '91' + sellerNumber : sellerNumber) : OWNER_WHATSAPP_NUMBER;
    const msg = `Hi, I'm ${cu.name} from Mr Coin Wala. I'm interested in your listing "${product.name}" (₹${product.price}/${product.unit}). I'd like to negotiate the price for ${qty} ${product.unit}. Could we discuss?`;
    window.location.href = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  });

  document.getElementById('reportBtn').addEventListener('click', ()=> {
    const number = OWNER_WHATSAPP_NUMBER;
    const msg = `⚠️ Reporting a listing on Mr Coin Wala\nProduct: ${product.name} (ID: ${product.id})\nSeller: ${product.seller}\nReason: `;
    window.location.href = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  });
});

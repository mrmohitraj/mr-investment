/* ===================================================================
   MR COIN WALA — CART PAGE LOGIC
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const listWrap = document.getElementById('cartList');
  const summaryWrap = document.getElementById('cartSummary');
  const stickyWrap = document.getElementById('stickyCheckout');
  if(!listWrap) return;

  function render(){
    const items = Cart.getItems();
    if(items.length === 0){
      listWrap.innerHTML = `<div class="empty-state">
        <div class="icon">🛒</div><h3>${t('yourCartEmpty')}</h3>
        <p>${t('browseFreshCrops')}</p>
        <a href="buy-crops.html" class="btn btn-primary">Start Shopping</a>
      </div>`;
      if(summaryWrap) summaryWrap.innerHTML = '';
      if(stickyWrap) stickyWrap.style.display = 'none';
      updateBadgeCounts();
      return;
    }
    if(stickyWrap) stickyWrap.style.display = 'flex';
    listWrap.innerHTML = items.map(i => `
      <div class="cart-item" data-id="${i.id}">
        <img src="${i.image}" alt="${i.name}">
        <div class="ci-info">
          <h4>${i.name}</h4>
          <p class="text-muted" style="font-size:11.5px;margin:0 0 6px;">Seller: ${i.seller}</p>
          <div class="pc-price-row" style="margin-bottom:8px;">
            <span class="pc-price" style="font-size:14px;">₹${i.price.toLocaleString('en-IN')}</span>
            <span class="pc-unit">/${i.unit}</span>
          </div>
          <div class="d-flex align-center justify-between">
            <div class="qty-stepper">
              <button class="qm" data-id="${i.id}">−</button><span>${i.qty}</span><button class="qp" data-id="${i.id}">+</button>
            </div>
            <button class="btn btn-sm btn-outline rm-btn" data-id="${i.id}" style="color:var(--danger);border-color:var(--danger);">Remove</button>
          </div>
        </div>
      </div>`).join('');

    listWrap.querySelectorAll('.qm').forEach(b=>b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-id');
      const item = Cart.getItems().find(i=>i.id===id);
      Cart.updateQty(id, item.qty - 1);
      render();
    }));
    listWrap.querySelectorAll('.qp').forEach(b=>b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-id');
      const item = Cart.getItems().find(i=>i.id===id);
      Cart.updateQty(id, item.qty + 1);
      render();
    }));
    listWrap.querySelectorAll('.rm-btn').forEach(b=>b.addEventListener('click', ()=>{
      Cart.remove(b.getAttribute('data-id'));
      showToast('Item removed from cart', '');
      render();
    }));

    const subtotal = Cart.subtotal();
    const delivery = subtotal > 0 ? 199 : 0;
    const discount = bulkDiscountAmount(subtotal);
    const total = subtotal + delivery - discount;
    if(summaryWrap){
      summaryWrap.innerHTML = `
        <div class="cart-summary">
          <div class="summary-row"><span>Subtotal</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
          ${discount > 0 ? `<div class="summary-row" style="color:var(--primary-green);"><span>Bulk Discount (${bulkDiscountPercent(subtotal)}%)</span><span>−₹${discount.toLocaleString('en-IN')}</span></div>` : ''}
          <div class="summary-row"><span>Delivery Fee</span><span>₹${delivery}</span></div>
          <div class="summary-row total"><span>Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
        </div>`;
    }
    if(stickyWrap){
      stickyWrap.innerHTML = `
        <div><div class="text-muted" style="font-size:11px;">Total</div><div style="font-weight:800;font-size:16px;">₹${total.toLocaleString('en-IN')}</div></div>
        <button class="btn btn-primary" id="checkoutBtn" style="flex:1;max-width:220px;">${t('proceedToCheckout')}</button>`;
      document.getElementById('checkoutBtn').addEventListener('click', checkout);
    }
    updateBadgeCounts();
  }

  // Bulk order discount tiers (based on cart subtotal)
  function bulkDiscountPercent(subtotal){
    if(subtotal >= 100000) return 10;
    if(subtotal >= 50000) return 5;
    return 0;
  }
  function bulkDiscountAmount(subtotal){
    return Math.round(subtotal * bulkDiscountPercent(subtotal) / 100);
  }

  const checkoutOverlay = document.getElementById('checkoutOverlay');
  const checkoutModal = document.getElementById('checkoutModal');
  const addrHouse = document.getElementById('addrHouse');
  const addrArea = document.getElementById('addrArea');
  const addrCity = document.getElementById('addrCity');
  const addrState = document.getElementById('addrState');
  const addrPin = document.getElementById('addrPin');
  const addrName = document.getElementById('addrName');
  const addrPhone = document.getElementById('addrPhone');
  const useLocationBtn = document.getElementById('useLocationBtn');
  const locationStatus = document.getElementById('locationStatus');
  const bulkDiscountNote = document.getElementById('bulkDiscountNote');
  const closeCheckoutModalBtn = document.getElementById('closeCheckoutModal');
  const confirmCheckoutBtn = document.getElementById('confirmCheckoutBtn');

  function openCheckoutModal(){
    if(!checkoutModal) return;
    const cu = Auth.currentUser();
    // Pre-fill only name & phone from the account — the address itself always
    // starts blank so nobody accidentally ships to a leftover/old address.
    addrName.value = cu.name || '';
    addrPhone.value = cu.phone || '';
    const addressWarn = document.getElementById('addressWarn');
    if(addressWarn) addressWarn.style.display = 'none';
    if(locationStatus) locationStatus.style.display = 'none';
    const subtotal = Cart.subtotal();
    const pct = bulkDiscountPercent(subtotal);
    const nextTierMsg = subtotal < 50000
      ? `Order above ₹50,000 to get a 5% bulk discount!`
      : subtotal < 100000
        ? `You've unlocked a 5% bulk discount. Order above ₹1,00,000 for 10%!`
        : `🎉 You've unlocked the maximum 10% bulk discount!`;
    bulkDiscountNote.textContent = pct > 0 ? nextTierMsg : nextTierMsg;
    checkoutModal.classList.add('open');
    checkoutOverlay.classList.add('open');
  }
  function closeCheckoutModal(){
    checkoutModal.classList.remove('open');
    checkoutOverlay.classList.remove('open');
  }
  closeCheckoutModalBtn && closeCheckoutModalBtn.addEventListener('click', closeCheckoutModal);
  checkoutOverlay && checkoutOverlay.addEventListener('click', closeCheckoutModal);

  function checkout(){
    if(!Auth.isLoggedIn()){
      showToast('Please login to place an order', 'error');
      setTimeout(()=> location.href = 'login.html', 800);
      return;
    }
    openCheckoutModal();
  }

  // "Use my current location" — grabs GPS coords from the phone, then uses
  // a free reverse-geocoding lookup (no API key needed) to fill in the
  // area/city/state/PIN fields automatically. House number still needs to
  // be typed since GPS can't know your flat/house number.
  useLocationBtn && useLocationBtn.addEventListener('click', () => {
    if(!navigator.geolocation){
      locationStatus.style.display = 'block';
      locationStatus.style.color = 'var(--danger)';
      locationStatus.textContent = '⚠️ Ye phone/browser location support nahi karta. Address neeche manually likh dein.';
      return;
    }
    locationStatus.style.display = 'block';
    locationStatus.style.color = '';
    locationStatus.textContent = '📍 Location detect ho rahi hai…';
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try{
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
        const data = await res.json();
        const a = data.address || {};
        addrArea.value = a.suburb || a.neighbourhood || a.village || a.hamlet || a.road || '';
        addrCity.value = a.city || a.town || a.county || a.state_district || '';
        addrState.value = a.state || '';
        addrPin.value = a.postcode || '';
        locationStatus.textContent = '✅ Location bhar di gayi hai — check karke house number bhar dein.';
      }catch(e){
        locationStatus.style.color = 'var(--danger)';
        locationStatus.textContent = '⚠️ Location detect hui par address nahi mil paaya. Neeche manually bhar dein.';
      }
    }, (err) => {
      locationStatus.style.color = 'var(--danger)';
      locationStatus.textContent = '⚠️ Location permission nahi mili. Neeche address manually likh dein.';
    });
  });

  confirmCheckoutBtn && confirmCheckoutBtn.addEventListener('click', () => {
    const addressWarn = document.getElementById('addressWarn');
    const fields = [
      { el: addrHouse, label: 'House/Flat No. & Street' },
      { el: addrArea, label: 'Village/Area/Locality' },
      { el: addrCity, label: 'City/District' },
      { el: addrState, label: 'State' },
      { el: addrPin, label: 'PIN Code' },
      { el: addrName, label: 'Full Name' },
      { el: addrPhone, label: 'Mobile Number' },
    ];
    const missing = fields.filter(f => !(f.el.value || '').trim());
    const pinVal = (addrPin.value || '').trim();
    const phoneVal = (addrPhone.value || '').trim();
    let errorMsg = '';
    if(missing.length){
      errorMsg = `⚠️ Ye fields bharna zaroori hai: ${missing.map(f=>f.label).join(', ')}`;
    }else if(!/^\d{6}$/.test(pinVal)){
      errorMsg = '⚠️ PIN Code 6 digit ka hona chahiye.';
    }else if(!/^\d{10}$/.test(phoneVal)){
      errorMsg = '⚠️ Mobile number 10 digit ka hona chahiye.';
    }
    if(errorMsg){
      addressWarn.textContent = errorMsg;
      addressWarn.style.display = 'block';
      (missing[0] ? missing[0].el : (!/^\d{6}$/.test(pinVal) ? addrPin : addrPhone)).focus();
      showToast('Please complete the delivery details', 'error');
      return;
    }
    addressWarn.style.display = 'none';

    const address = `${addrHouse.value.trim()}, ${addrArea.value.trim()}, ${addrCity.value.trim()}, ${addrState.value.trim()} - ${pinVal}`;
    const buyerName = addrName.value.trim();
    const buyerPhone = phoneVal;

    const cu = Auth.currentUser();
    const items = Cart.getItems();
    if(items.length === 0){ closeCheckoutModal(); return; }

    const subtotal = Cart.subtotal();
    const discount = bulkDiscountAmount(subtotal);
    const order = Orders.create(items, address);
    order.discount = discount;
    order.total = subtotal + 199 - discount;
    Orders.save([order, ...Orders.getAll().filter(o=>o.id!==order.id)]);

    // Group items by seller so each seller gets their own WhatsApp order message
    const bySeller = {};
    items.forEach(i => {
      const key = i.sellerPhone || 'owner';
      if(!bySeller[key]) bySeller[key] = { sellerName: i.seller || 'Seller', sellerPhone: i.sellerPhone, items: [] };
      bySeller[key].items.push(i);
    });
    const sellerGroups = Object.values(bySeller);
    const multiSeller = sellerGroups.length > 1;

    const waLinks = sellerGroups.map(g => {
      const num = (g.sellerPhone || '').replace(/\D/g,'');
      const number = num ? (num.length === 10 ? '91' + num : num) : OWNER_WHATSAPP_NUMBER;
      let msg = `🌾 *New Order — Mr Coin Wala*\n`;
      msg += `Order ID: ${order.id}\n`;
      msg += `Buyer: ${buyerName} (${buyerPhone})\n`;
      msg += `Delivery Address: ${address}\n\n`;
      msg += `*Items${multiSeller ? ` (from ${g.sellerName})` : ''}:*\n`;
      g.items.forEach(i => { msg += `• ${i.name} — ${i.qty} ${i.unit} x ₹${i.price} = ₹${(i.qty*i.price).toLocaleString('en-IN')}\n`; });
      const groupTotal = g.items.reduce((s,i)=>s+i.qty*i.price,0);
      msg += `\n*Subtotal: ₹${groupTotal.toLocaleString('en-IN')}*`;
      if(!multiSeller && discount > 0) msg += `\nBulk Discount: −₹${discount.toLocaleString('en-IN')}\n*Total: ₹${order.total.toLocaleString('en-IN')}*`;
      return { url: `https://wa.me/${number}?text=${encodeURIComponent(msg)}`, sellerName: g.sellerName };
    });

    Cart.clear();
    closeCheckoutModal();
    showOrderSuccess(order, items, address, waLinks);

    // Auto-open WhatsApp with the order details right away — don't make the
    // buyer hunt for a second button. First seller opens in the same tab,
    // any additional sellers open in new tabs a moment later.
    waLinks.forEach((l, idx) => {
      setTimeout(()=>{ window.open(l.url, idx === 0 ? '_self' : '_blank'); }, idx === 0 ? 300 : 300 + idx * 600);
    });
  });

  function showOrderSuccess(order, items, address, waLinks){
    document.getElementById('cartList').closest('.content-card').style.display = 'none';
    document.getElementById('cartSummary').style.display = 'none';
    document.getElementById('stickyCheckout').style.display = 'none';

    const successView = document.getElementById('orderSuccessView');
    document.getElementById('orderSuccessId').textContent = `Order #${order.id.slice(-6)} • ${new Date(order.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}`;
    document.getElementById('orderSuccessItems').innerHTML = items.map(i => `
      <div class="d-flex justify-between align-center" style="margin-bottom:6px;font-size:13px;">
        <span>${i.name} × ${i.qty} ${i.unit}</span><span>₹${(i.qty*i.price).toLocaleString('en-IN')}</span>
      </div>`).join('');
    document.getElementById('orderSuccessAddress').textContent = address;
    document.getElementById('orderSuccessTotal').textContent = `₹${order.total.toLocaleString('en-IN')}`;
    successView.style.display = 'block';
    successView.scrollIntoView({behavior:'smooth', block:'start'});

    const waBtn = document.getElementById('confirmWhatsAppBtn');
    if(waLinks.length > 1){
      waBtn.textContent = `💬 Confirm with ${waLinks.length} Sellers on WhatsApp`;
    }
    waBtn.addEventListener('click', ()=>{
      waLinks.forEach((l, idx) => {
        setTimeout(()=>{ idx === 0 ? (window.location.href = l.url) : window.open(l.url, '_blank'); }, idx * 500);
      });
    }, { once:true });
  }

  render();
});

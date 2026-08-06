/* ===================================================================
   MR COIN WALA — WISHLIST PAGE LOGIC
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('wishlistGrid');
  if(!wrap) return;

  function render(){
    const items = Wishlist.getItems();
    if(items.length === 0){
      wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <div class="icon">♡</div><h3>Your wishlist is empty</h3>
        <p>Tap the heart icon on any product to save it here.</p>
        <a href="buy-crops.html" class="btn btn-primary">Explore Products</a>
      </div>`;
      return;
    }
    wrap.innerHTML = items.map(i => `
      <div class="product-card fade-in" data-id="${i.id}">
        <a href="product-details.html?id=${i.id}">
          <div class="pc-img-wrap"><img src="${i.image}" alt="${i.name}" loading="lazy"></div>
        </a>
        <button class="pc-wishlist active" data-rm="${i.id}">❤</button>
        <div class="pc-body">
          <a href="product-details.html?id=${i.id}"><h4 class="pc-name">${i.name}</h4></a>
          <p class="pc-loc">📍 ${i.district || ''}</p>
          <div class="pc-price-row"><span class="pc-price">₹${i.price.toLocaleString('en-IN')}</span><span class="pc-unit">/${i.unit}</span></div>
          <div class="pc-actions"><button class="btn btn-primary btn-block" data-cart="${i.id}">Add to Cart</button></div>
        </div>
      </div>`).join('');

    wrap.querySelectorAll('[data-rm]').forEach(b=>b.addEventListener('click', (e)=>{
      e.preventDefault();
      Wishlist.remove(b.getAttribute('data-rm'));
      updateBadgeCounts();
      showToast('Removed from wishlist', '');
      render();
    }));
    wrap.querySelectorAll('[data-cart]').forEach(b=>b.addEventListener('click', (e)=>{
      e.preventDefault();
      const product = DataAPI.getProductById(b.getAttribute('data-cart'));
      Cart.add(product, 1);
      updateBadgeCounts();
      showToast('Added to cart', 'success');
    }));
  }
  render();
});

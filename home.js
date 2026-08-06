/* ===================================================================
   MR COIN WALA — HOME PAGE LOGIC
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  // Category chips
  const catWrap = document.getElementById('categoryChips');
  if(catWrap){
    catWrap.innerHTML = CROP_CATEGORIES.map(c => `
      <a href="buy-crops.html?cat=${c.id}" class="category-chip">
        <div class="chip-circle">${c.icon}</div><span>${c.name}</span>
      </a>`).join('');
  }

  // Recently viewed
  const recentSection = document.getElementById('recentlyViewedSection');
  const recentWrap = document.getElementById('recentlyViewed');
  if(recentWrap && recentSection){
    const recentIds = RecentlyViewed.getIds();
    const recentProducts = recentIds.map(id => DataAPI.getProductById(id)).filter(Boolean);
    if(recentProducts.length > 0){
      recentSection.style.display = '';
      recentWrap.innerHTML = recentProducts.map(productCardHTML).join('');
      wireProductGridEvents(recentWrap);
    }
  }

  // Trending products
  const trendWrap = document.getElementById('trendingProducts');
  if(trendWrap){
    const products = DataAPI.getTrending(8);
    if(products.length === 0){
      trendWrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <div class="icon">🌾</div><h3>${t('noProductsListed')}</h3>
        <p>${t('beFirstToList')}</p>
        <a href="sell-product.html" class="btn btn-primary">Start Selling</a>
      </div>`;
    } else {
      trendWrap.innerHTML = products.map(productCardHTML).join('');
      wireProductGridEvents(trendWrap);
    }
  }

  // Popular crop waste
  const wasteWrap = document.getElementById('popularWaste');
  if(wasteWrap){
    const wasteProducts = DataAPI.getByCategory('waste').sort((a,b)=>b.rating-a.rating).slice(0,8);
    if(wasteProducts.length === 0){
      wasteWrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <div class="icon">♻️</div><h3>${t('noWasteListed')}</h3>
        <p>${t('sellWasteDesc')}</p>
        <a href="sell-product.html" class="btn btn-primary">Start Selling</a>
      </div>`;
    } else {
      wasteWrap.innerHTML = wasteProducts.map(productCardHTML).join('');
      wireProductGridEvents(wasteWrap);
    }
  }

  // Market prices
  const priceWrap = document.getElementById('marketPrices');
  if(priceWrap){
    priceWrap.innerHTML = MARKET_PRICES.map(m => `
      <div class="price-card">
        <div class="pt-name">${m.name}</div>
        <div class="pt-price">₹${m.price.toLocaleString('en-IN')}/${m.unit}</div>
        <div class="pt-change ${m.change>=0?'pt-up':'pt-down'}">${m.change>=0?'▲':'▼'} ${Math.abs(m.change)}%</div>
      </div>`).join('');
  }

  // Top sellers
  const sellerWrap = document.getElementById('topSellers');
  if(sellerWrap){
    const sellers = DataAPI.getTopSellers(8);
    if(sellers.length === 0){
      sellerWrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <div class="icon">🧑‍🌾</div><h3>No sellers yet</h3>
        <p>Sellers will appear here once they list products.</p>
      </div>`;
    } else {
      sellerWrap.innerHTML = sellers.map(s => `
        <div class="seller-card">
          <div class="seller-avatar">${s.name.charAt(0)}</div>
          <div style="font-size:12.5px;font-weight:700;margin-bottom:4px;">${s.name}</div>
          <div class="rating-stars" style="font-size:11px;">★★★★★</div>
          <div class="text-muted" style="font-size:10.5px;margin-top:4px;">${s.score}+ orders</div>
        </div>`).join('');
    }
  }

  // Reviews
  const reviewWrap = document.getElementById('farmerReviews');
  if(reviewWrap){
    reviewWrap.innerHTML = REVIEWS.map(r => `
      <div class="review-card">
        <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
        <p class="review-text">"${r.text}"</p>
        <div class="review-user"><div class="seller-avatar" style="width:30px;height:30px;font-size:12px;margin:0;">${r.name.charAt(0)}</div>${r.name}</div>
      </div>`).join('');
  }
});

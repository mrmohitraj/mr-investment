/* ===================================================================
   MR COIN WALA — PRODUCT LISTING PAGE LOGIC
   Powers buy-crops.html and crop-waste.html.
   Reads window.PAGE_CATEGORY = 'crop' | 'waste' set inline on each page.
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const pageCategory = window.PAGE_CATEGORY;
  const catalog = pageCategory === 'waste' ? WASTE_CATEGORIES : CROP_CATEGORIES;

  const params = new URLSearchParams(location.search);
  const state = {
    query: params.get('q') || '',
    subCategory: params.get('cat') || '',
    sort: 'relevance',
    maxPrice: null,
  };

  const chipWrap = document.getElementById('subCategoryChips');
  const grid = document.getElementById('productGrid');
  const resultCount = document.getElementById('resultCount');
  const searchBox = document.getElementById('pageSearchInput');
  const sortSelect = document.getElementById('sortSelect');
  const filterBtn = document.getElementById('filterBtn');
  const filterSheet = document.getElementById('filterSheet');
  const filterOverlay = document.getElementById('filterOverlay');
  const priceRange = document.getElementById('priceRange');
  const priceRangeVal = document.getElementById('priceRangeVal');
  const districtSelect = document.getElementById('districtSelect');
  const applyFilterBtn = document.getElementById('applyFilterBtn');
  const clearFilterBtn = document.getElementById('clearFilterBtn');
  state.district = '';

  if(searchBox) searchBox.value = state.query;

  // populate district dropdown from currently listed products
  if(districtSelect){
    const districts = [...new Set(DataAPI.getByCategory(pageCategory).map(p => p.district).filter(Boolean))].sort();
    districtSelect.innerHTML = '<option value="">All Districts</option>' +
      districts.map(d => `<option value="${d}">${d}</option>`).join('');
  }

  // sub-category chips
  if(chipWrap){
    chipWrap.innerHTML = `<button class="filter-pill ${!state.subCategory?'active':''}" data-cat="">All</button>` +
      catalog.map(c => `<button class="filter-pill ${state.subCategory===c.id?'active':''}" data-cat="${c.id}">${c.icon} ${c.name}</button>`).join('');
    chipWrap.querySelectorAll('[data-cat]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        state.subCategory = btn.getAttribute('data-cat');
        chipWrap.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        render();
      });
    });
  }

  function getFiltered(){
    let list = DataAPI.getByCategory(pageCategory);
    if(state.query) list = DataAPI.search(state.query, list);
    if(state.subCategory) list = list.filter(p => p.subCategory === state.subCategory);
    if(state.maxPrice) list = list.filter(p => p.price <= state.maxPrice);
    if(state.district) list = list.filter(p => p.district === state.district);
    switch(state.sort){
      case 'price-low': list = [...list].sort((a,b)=>a.price-b.price); break;
      case 'price-high': list = [...list].sort((a,b)=>b.price-a.price); break;
      case 'rating': list = [...list].sort((a,b)=>b.rating-a.rating); break;
      default: break;
    }
    return list;
  }

  function render(){
    if(!grid) return;
    const items = getFiltered();
    if(resultCount) resultCount.textContent = `${items.length} ${t('productsFound')}`;
    if(items.length === 0){
      const hasFilters = state.query || state.subCategory || state.maxPrice || state.district;
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <div class="icon">🔍</div><h3>No products found</h3>
        <p>${hasFilters ? 'Try a different search term or clear your filters.' : 'No listings yet in this category — check back soon or list your own.'}</p>
        <a href="sell-product.html" class="btn btn-primary">Sell a Product</a>
      </div>`;
      return;
    }
    grid.innerHTML = items.map(productCardHTML).join('');
    wireProductGridEvents(grid);
  }

  if(searchBox){
    searchBox.addEventListener('input', ()=>{ state.query = searchBox.value; });
    searchBox.addEventListener('keydown', (e)=>{ if(e.key==='Enter') render(); });
  }
  const searchGoBtn = document.getElementById('pageSearchBtn');
  searchGoBtn && searchGoBtn.addEventListener('click', render);

  if(sortSelect){
    sortSelect.addEventListener('change', ()=>{ state.sort = sortSelect.value; render(); });
  }

  if(filterBtn){
    filterBtn.addEventListener('click', ()=>{ filterSheet.classList.add('open'); filterOverlay.classList.add('open'); });
  }
  filterOverlay && filterOverlay.addEventListener('click', ()=>{ filterSheet.classList.remove('open'); filterOverlay.classList.remove('open'); });
  if(priceRange){
    priceRange.addEventListener('input', ()=>{ priceRangeVal.textContent = '₹' + Number(priceRange.value).toLocaleString('en-IN'); });
  }
  applyFilterBtn && applyFilterBtn.addEventListener('click', ()=>{
    state.maxPrice = priceRange ? Number(priceRange.value) : null;
    state.district = districtSelect ? districtSelect.value : '';
    filterSheet.classList.remove('open'); filterOverlay.classList.remove('open');
    render();
  });
  clearFilterBtn && clearFilterBtn.addEventListener('click', ()=>{
    state.maxPrice = null;
    state.district = '';
    if(priceRange){ priceRange.value = priceRange.max; priceRangeVal.textContent = 'Any price'; }
    if(districtSelect){ districtSelect.value = ''; }
    filterSheet.classList.remove('open'); filterOverlay.classList.remove('open');
    render();
  });

  render();
});

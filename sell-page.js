/* ===================================================================
   MR COIN WALA — SELL PRODUCT PAGE LOGIC
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sellForm');
  if(!form) return;

  if(!Auth.isLoggedIn()){
    showToast('Please login to list a product for sale', 'error');
    setTimeout(()=> location.href = 'login.html', 900);
  }

  const catSelect = document.getElementById('sellCategory');
  const subCatSelect = document.getElementById('sellSubCategory');
  const mainCatRadios = document.querySelectorAll('input[name="mainCat"]');
  const fileInput = document.getElementById('sellImages');
  const previewRow = document.getElementById('imgPreviewRow');
  let images = [];

  function populateSubCategories(main){
    const list = main === 'waste' ? WASTE_CATEGORIES : CROP_CATEGORIES;
    subCatSelect.innerHTML = list.map(c => `<option value="${c.id}" data-name="${c.name}" data-unit="${c.unit}">${c.icon} ${c.name}</option>`).join('');
  }
  populateSubCategories('crop');
  mainCatRadios.forEach(r => r.addEventListener('change', ()=> populateSubCategories(r.value)));

  fileInput.addEventListener('change', () => {
    Array.from(fileInput.files).slice(0,5).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        images.push(e.target.result);
        renderPreviews();
      };
      reader.readAsDataURL(file);
    });
  });

  function renderPreviews(){
    previewRow.innerHTML = images.map((src,i) => `
      <div class="img-preview"><img src="${src}"><span class="rm" data-i="${i}">×</span></div>`).join('');
    previewRow.querySelectorAll('.rm').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        images.splice(Number(btn.getAttribute('data-i')),1);
        renderPreviews();
      });
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = {
      name: document.getElementById('sellName'),
      quantity: document.getElementById('sellQuantity'),
      price: document.getElementById('sellPrice'),
      district: document.getElementById('sellDistrict'),
      state: document.getElementById('sellState'),
      description: document.getElementById('sellDescription'),
      phone: document.getElementById('sellPhone'),
    };
    let valid = true;
    Object.values(fields).forEach(f => f.closest('.form-group').classList.remove('invalid'));

    if(fields.name.value.trim().length < 2){ fields.name.closest('.form-group').classList.add('invalid'); valid=false; }
    if(!fields.quantity.value || Number(fields.quantity.value) <= 0){ fields.quantity.closest('.form-group').classList.add('invalid'); valid=false; }
    if(!fields.price.value || Number(fields.price.value) <= 0){ fields.price.closest('.form-group').classList.add('invalid'); valid=false; }
    if(fields.district.value.trim().length < 2){ fields.district.closest('.form-group').classList.add('invalid'); valid=false; }
    if(!fields.state.value){ fields.state.closest('.form-group').classList.add('invalid'); valid=false; }
    if(fields.description.value.trim().length < 10){ fields.description.closest('.form-group').classList.add('invalid'); valid=false; }
    if(!/^\d{10}$/.test(fields.phone.value.trim())){ fields.phone.closest('.form-group').classList.add('invalid'); valid=false; }

    if(!valid){ showToast('Please fix the highlighted fields', 'error'); return; }

    const mainCat = document.querySelector('input[name="mainCat"]:checked').value;
    const opt = subCatSelect.options[subCatSelect.selectedIndex];
    const cu = Auth.currentUser();
    const placeholderImg = `https://picsum.photos/seed/mfwuser${Date.now()}/600/600`;

    const listing = {
      id: 'U' + Date.now(),
      name: fields.name.value.trim(),
      category: mainCat,
      subCategory: opt.value,
      subCategoryName: opt.getAttribute('data-name'),
      icon: mainCat === 'waste' ? '♻️' : '🌾',
      price: Number(fields.price.value),
      unit: opt.getAttribute('data-unit'),
      quantityAvailable: Number(fields.quantity.value),
      minOrderQty: Number(document.getElementById('sellMinOrder').value) || 1,
      seller: cu ? cu.name : 'Independent Seller',
      sellerId: cu ? cu.id : null,
      sellerPhone: fields.phone.value.trim(),
      district: fields.district.value.trim(),
      state: fields.state.value,
      rating: '4.5', reviewCount: 0, deliveryDays: 4,
      image: images[0] || placeholderImg,
      gallery: images.length ? images : [placeholderImg],
      description: fields.description.value.trim(),
      verified: false,
    };

    Listings.add(listing);
    showToast('Your listing is now live! 🎉', 'success');
    form.reset(); images = []; renderPreviews(); populateSubCategories('crop');
    setTimeout(()=> location.href = 'seller-dashboard.html', 900);
  });
});

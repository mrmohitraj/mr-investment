/* ===================================================================
   MR COIN WALA — STORAGE MODULE
   Thin wrapper around localStorage. Keeping every read/write behind
   this object means the whole app can be pointed at Firebase /
   Supabase later by rewriting only this file.
=================================================================== */

const Storage = {
  get(key, fallback){
    try{
      const raw = localStorage.getItem('mfw_' + key);
      return raw ? JSON.parse(raw) : (fallback !== undefined ? fallback : null);
    }catch(e){ return fallback !== undefined ? fallback : null; }
  },
  set(key, value){
    try{ localStorage.setItem('mfw_' + key, JSON.stringify(value)); return true; }
    catch(e){ return false; }
  },
  remove(key){ localStorage.removeItem('mfw_' + key); }
};

/* ---------------- Auth ---------------- */
const Auth = {
  getUsers(){ return Storage.get('users', []); },
  saveUsers(users){ Storage.set('users', users); },
  currentUser(){ return Storage.get('currentUser', null); },
  isLoggedIn(){ return !!this.currentUser(); },

  signup({name, phone, email, password, role}){
    const users = this.getUsers();
    if(users.find(u => u.phone === phone)){
      return { ok:false, error:'An account with this phone number already exists.' };
    }
    const user = {
      id: 'U' + Date.now(),
      name, phone, email: email || '', password, role: role || 'buyer',
      joined: new Date().toISOString(),
    };
    users.push(user);
    this.saveUsers(users);
    this.setCurrentUser(user);
    return { ok:true, user };
  },

  login(phone, password){
    const users = this.getUsers();
    const user = users.find(u => u.phone === phone && u.password === password);
    if(!user) return { ok:false, error:'Invalid phone number or password.' };
    this.setCurrentUser(user);
    return { ok:true, user };
  },

  setCurrentUser(user){
    const { password, ...safe } = user;
    Storage.set('currentUser', safe);
  },

  updateProfile(updates){
    const cu = this.currentUser();
    if(!cu) return;
    const merged = { ...cu, ...updates };
    Storage.set('currentUser', merged);
    const users = this.getUsers().map(u => u.id === cu.id ? { ...u, ...updates } : u);
    this.saveUsers(users);
  },

  logout(){ Storage.remove('currentUser'); }
};

/* ---------------- Cart ---------------- */
const Cart = {
  getItems(){ return Storage.get('cart', []); },
  save(items){ Storage.set('cart', items); },
  count(){ return this.getItems().reduce((s,i)=>s+i.qty,0); },
  add(product, qty=1){
    const items = this.getItems();
    const existing = items.find(i => i.id === product.id);
    if(existing){ existing.qty += qty; }
    else{
      items.push({
        id:product.id, name:product.name, image:product.image, price:product.price,
        unit:product.unit, seller:product.seller, sellerPhone:product.sellerPhone, qty, quantityAvailable: product.quantityAvailable
      });
    }
    this.save(items);
    return items;
  },
  updateQty(id, qty){
    let items = this.getItems();
    if(qty <= 0){ items = items.filter(i => i.id !== id); }
    else{ items = items.map(i => i.id === id ? {...i, qty} : i); }
    this.save(items);
    return items;
  },
  remove(id){ this.save(this.getItems().filter(i => i.id !== id)); },
  clear(){ this.save([]); },
  subtotal(){ return this.getItems().reduce((s,i)=> s + i.price*i.qty, 0); }
};

/* ---------------- Wishlist ---------------- */
const Wishlist = {
  getItems(){ return Storage.get('wishlist', []); },
  save(items){ Storage.set('wishlist', items); },
  count(){ return this.getItems().length; },
  has(id){ return this.getItems().some(i => i.id === id); },
  toggle(product){
    let items = this.getItems();
    if(this.has(product.id)){
      items = items.filter(i => i.id !== product.id);
      this.save(items);
      return false;
    }else{
      items.push({ id:product.id, name:product.name, image:product.image, price:product.price,
        unit:product.unit, seller:product.seller, district:product.district, rating:product.rating });
      this.save(items);
      return true;
    }
  },
  remove(id){ this.save(this.getItems().filter(i => i.id !== id)); }
};

/* ---------------- Recently Viewed ---------------- */
const RecentlyViewed = {
  getIds(){ return Storage.get('recentlyViewed', []); },
  add(id){
    let ids = this.getIds().filter(x => x !== id);
    ids.unshift(id);
    ids = ids.slice(0, 10);
    Storage.set('recentlyViewed', ids);
  }
};

/* ---------------- Orders ---------------- */
const Orders = {
  getAll(){ return Storage.get('orders', []); },
  save(orders){ Storage.set('orders', orders); },
  create(items, address){
    const orders = this.getAll();
    const order = {
      id:'ORD' + Date.now(),
      items, address,
      total: items.reduce((s,i)=>s+i.price*i.qty,0),
      status:'Confirmed',
      date: new Date().toISOString(),
      buyer: Auth.currentUser() ? Auth.currentUser().name : 'Guest',
    };
    orders.unshift(order);
    this.save(orders);
    return order;
  },
  updateStatus(id, status){
    const orders = this.getAll().map(o => o.id === id ? { ...o, status } : o);
    this.save(orders);
  }
};
const ORDER_STATUSES = ['Confirmed','Packed','Shipped','Out for Delivery','Delivered'];

/* ---------------- Custom (seller) listings ---------------- */
const Listings = {
  getAll(){ return Storage.get('customListings', []); },
  save(list){ Storage.set('customListings', list); },
  add(listing){
    const list = this.getAll();
    list.unshift(listing);
    this.save(list);
    return listing;
  },
  update(id, updates){
    const list = this.getAll().map(l => l.id === id ? { ...l, ...updates } : l);
    this.save(list);
  },
  remove(id){
    this.save(this.getAll().filter(l => l.id !== id));
  },
  byCurrentSeller(){
    const cu = Auth.currentUser();
    if(!cu) return [];
    return this.getAll().filter(l => l.sellerId === cu.id);
  }
};

/* ---------------- Product reviews ---------------- */
const Reviews = {
  getAll(){ return Storage.get('reviews', []); },
  save(list){ Storage.set('reviews', list); },
  forProduct(productId){
    return this.getAll().filter(r => r.productId === productId).sort((a,b)=> new Date(b.date)-new Date(a.date));
  },
  add(productId, productName, rating, text){
    const cu = Auth.currentUser();
    const review = {
      id: 'REV' + Date.now(),
      productId, productName,
      rating: Number(rating),
      text: text || '',
      reviewer: cu ? cu.name : 'Guest',
      date: new Date().toISOString(),
    };
    const list = this.getAll();
    list.unshift(review);
    this.save(list);
    return review;
  },
  averageFor(productId){
    const revs = this.forProduct(productId);
    if(revs.length === 0) return null;
    const avg = revs.reduce((s,r)=>s+r.rating,0) / revs.length;
    return { avg: Math.round(avg*10)/10, count: revs.length };
  },
  hasReviewed(productId){
    const cu = Auth.currentUser();
    if(!cu) return false;
    return this.getAll().some(r => r.productId === productId && r.reviewer === cu.name);
  }
};

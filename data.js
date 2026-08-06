/* ===================================================================
   MR COIN WALA — DATA MODULE
   Static catalog data + helpers. In a backend-connected build this
   file would be replaced by API/Firestore/Supabase calls, which is
   why every read goes through the DataAPI functions below.
=================================================================== */

const CROP_CATEGORIES = [
  { id:'iron-coin',     name:'Iron Coin',        icon:'🪙', unit:'piece' },
  { id:'antique-coin',  name:'Antique Coin',     icon:'🪙', unit:'piece' },
  { id:'religious-coin',name:'Religious Coin',   icon:'🛕', unit:'piece' },
  { id:'zodiac-coin',   name:'Zodiac Coin',      icon:'♈', unit:'piece' },
  { id:'gift-coin',     name:'Gift Coin',        icon:'🎁', unit:'piece' },
  { id:'wedding-coin',  name:'Wedding Coin',     icon:'💍', unit:'piece' },
  { id:'currency-coin', name:'Currency Themed',  icon:'💰', unit:'piece' },
  { id:'custom-coin',   name:'Custom Engraved',  icon:'✍️', unit:'piece' },
  { id:'trophy-coin',   name:'Trophy Coin',      icon:'🏆', unit:'piece' },
  { id:'coin-set',      name:'Coin Set',         icon:'📦', unit:'set' },
];

const WASTE_CATEGORIES = [
  { id:'bulk-iron-coin',      name:'Bulk Iron Coins',      icon:'🪙', unit:'kg' },
  { id:'bulk-antique-coin',   name:'Bulk Antique Coins',   icon:'🪙', unit:'kg' },
  { id:'bulk-gift-coin',      name:'Bulk Gift Coins',      icon:'🎁', unit:'kg' },
  { id:'bulk-custom-coin',    name:'Bulk Custom Coins',    icon:'✍️', unit:'kg' },
];

const LOCATIONS = [
  ['Ludhiana','Punjab'], ['Karnal','Haryana'], ['Meerut','Uttar Pradesh'],
  ['Indore','Madhya Pradesh'], ['Nashik','Maharashtra'], ['Kota','Rajasthan'],
  ['Guntur','Andhra Pradesh'], ['Mysuru','Karnataka'], ['Coimbatore','Tamil Nadu'],
  ['Patna','Bihar'], ['Bhopal','Madhya Pradesh'], ['Rajkot','Gujarat'],
  ['Amritsar','Punjab'], ['Hisar','Haryana'], ['Nagpur','Maharashtra'],
  ['Jalgaon','Maharashtra'], ['Bathinda','Punjab'], ['Kanpur','Uttar Pradesh'],
];

const SELLERS = [
  'Mohit Coin House','Bihar Coin Traders','Lakhisarai Coin Bhandar','Royal Mint Collectibles',
  'Heritage Coin Works','Sacred Coin Traders','Prestige Coin Gallery','Golden Touch Coins',
  'Coin Craft Studio','Bharat Coin Exports','Antique Coin Hub','Legacy Coin House'
];

function seededRandom(seed){
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const CROP_DESCRIPTIONS = {
  'iron-coin':'Solid iron coin, sturdy build and clean finish — a simple keepsake or gifting piece.',
  'antique-coin':'Antique-style coin with an aged, vintage look — a nice collectible or display piece.',
  'religious-coin':'Coin featuring religious motifs, popular for pooja thalis and gifting on festivals.',
  'zodiac-coin':'Coin featuring zodiac/rashi designs, a popular personalised gift choice.',
  'gift-coin':'Nicely finished coin, ready to gift for birthdays, weddings and festive occasions.',
  'wedding-coin':'Coin designed for wedding favours and shagun, available in bulk for functions.',
  'currency-coin':'Coin with a currency-inspired design, a fun collectible/novelty piece.',
  'custom-coin':'Coin that can be custom engraved with a name, date or message — great for personalised gifts.',
  'trophy-coin':'Coin styled like a medal/trophy piece — used for mementoes and small awards.',
  'coin-set':'A set of coins packaged together, ideal for gifting or starting a small collection.',
};
const WASTE_DESCRIPTIONS = {
  'bulk-iron-coin':'Iron coins available in bulk quantity (sold by weight) — good for functions, giveaways or resale.',
  'bulk-antique-coin':'Antique-style coins in bulk quantity (sold by weight) for resellers and event organisers.',
  'bulk-gift-coin':'Gift coins in bulk quantity (sold by weight) — suitable for weddings, functions and corporate gifting.',
  'bulk-custom-coin':'Custom-design coins available in bulk quantity (sold by weight) for large orders.',
};

const STATIC_PRODUCTS = []; // Demo products removed — only seller-added listings show here now.

const MARKET_PRICES = CROP_CATEGORIES.slice(0,8).map((c,i)=>({
  name:c.name,
  price: Math.round((40+seededRandom(i*3+1)*260)/5)*5,
  unit:c.unit,
  change: (seededRandom(i*9+2)*6 - 3).toFixed(1),
}));

const REVIEWS = [
  { name:'Harpreet Singh', text:'Bought a few coins as gifts — quality was exactly as described and delivery was quick.', stars:5 },
  { name:'Lakshmi Naidu',  text:'Great platform for selling coins directly to buyers, no middlemen commission.', stars:5 },
  { name:'Manoj Patel',    text:'Prices were fair and the seller was verified. Will order again for the next function.', stars:4 },
  { name:'Ayesha Khatoon', text:'Sold my bulk coin stock within two days of listing. Very smooth experience.', stars:5 },
  { name:'Ravi Teja',      text:'The app made comparing coin prices really simple.', stars:4 },
  { name:'Devinder Kaur',  text:'Customer support helped resolve a delivery delay quickly. Appreciate the service.', stars:4 },
];

/* ============== DataAPI — swap internals for a real backend later ============== */
const DataAPI = {
  getAllProducts(){
    const custom = Storage.get('customListings', []);
    return [...custom, ...STATIC_PRODUCTS];
  },
  getProductById(id){
    return this.getAllProducts().find(p => p.id === id);
  },
  getByCategory(category){
    return this.getAllProducts().filter(p => p.category === category);
  },
  search(query, list){
    const src = list || this.getAllProducts();
    if(!query) return src;
    const q = query.toLowerCase();
    return src.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.subCategoryName.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.seller.toLowerCase().includes(q)
    );
  },
  getRelated(product, count=6){
    return this.getAllProducts()
      .filter(p => p.subCategory === product.subCategory && p.id !== product.id)
      .concat(this.getAllProducts().filter(p=>p.category===product.category && p.subCategory!==product.subCategory))
      .slice(0, count);
  },
  getTrending(count=8){
    return [...this.getAllProducts()].sort((a,b)=>b.rating-a.rating).slice(0,count);
  },
  getTopSellers(count=8){
    const map = {};
    this.getAllProducts().forEach(p=>{ map[p.seller] = (map[p.seller]||0) + (p.reviewCount||1); });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,count).map(([name,score])=>({name,score}));
  }
};

/* WhatsApp number that receives order notifications. Replace with your own number
   in international format, no + or spaces — e.g. 919876543210 for +91 98765 43210 */
const OWNER_WHATSAPP_NUMBER = "916200873964";

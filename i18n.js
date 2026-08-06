/* ===================================================================
   MR COIN WALA — LANGUAGE (i18n) SYSTEM
   Simple key-based translation for Hindi / English.
   Usage: t('key') returns the string in the currently selected language.
   Add more keys to both `en` and `hi` below to extend translation
   coverage to more of the site.
=================================================================== */

const TRANSLATIONS = {
  en: {
    home: "Home", buy: "Buy", buyCrops: "Buy Coins", sell: "Sell", sellProduct: "Sell Product",
    cart: "Cart", myCart: "My Cart", wishlist: "Wishlist", profile: "Profile",
    myOrders: "My Orders", cropWaste: "Bulk Coins", sellerDashboard: "Seller Dashboard",
    buyerDashboard: "Buyer Dashboard", aboutUs: "About Us", contact: "Contact", faq: "FAQ",
    privacyPolicy: "Privacy Policy", terms: "Terms", login: "Login / Signup", logout: "Logout",
    welcome: "Welcome!", loginToShop: "Login to buy & sell coins", selectLocation: "Select Location",
    searchPlaceholder: "Search coins, sellers...",
    addToCart: "Add to Cart", buyNow: "Buy Now", add: "Add", startShopping: "Start Shopping",
    topCategories: "Top Categories", trendingProducts: "Trending Products", seeAll: "See all",
    todaysMarketPrices: "Today's Prices", popularCropWaste: "Popular Bulk Coins",
    topSellers: "Top Sellers", whatFarmersSaying: "What Our Customers Are Saying",
    haveCropsToSell: "Have coins to sell?",
    listProduceDesc: "List your coins in minutes and reach verified buyers across India.",
    proceedToCheckout: "Proceed to Checkout", yourCartEmpty: "Your cart is empty",
    browseFreshCrops: "Browse coins to get started.",
    noProductsListed: "No products listed yet", beFirstToList: "Be the first to list your coins for sale.",
    noWasteListed: "No bulk coins listed yet", sellWasteDesc: "Sell your bulk coins to buyers looking for them.",
    productsFound: "products found",
  },
  hi: {
    home: "होम", buy: "खरीदें", buyCrops: "सिक्के खरीदें", sell: "बेचें", sellProduct: "उत्पाद बेचें",
    cart: "कार्ट", myCart: "मेरा कार्ट", wishlist: "पसंदीदा", profile: "प्रोफ़ाइल",
    myOrders: "मेरे ऑर्डर", cropWaste: "थोक सिक्के", sellerDashboard: "विक्रेता डैशबोर्ड",
    buyerDashboard: "खरीदार डैशबोर्ड", aboutUs: "हमारे बारे में", contact: "संपर्क करें", faq: "सामान्य प्रश्न",
    privacyPolicy: "गोपनीयता नीति", terms: "नियम व शर्तें", login: "लॉगिन / साइनअप", logout: "लॉगआउट",
    welcome: "स्वागत है!", loginToShop: "सिक्के खरीदने-बेचने के लिए लॉगिन करें", selectLocation: "स्थान चुनें",
    searchPlaceholder: "सिक्के, विक्रेता खोजें...",
    addToCart: "कार्ट में डालें", buyNow: "अभी खरीदें", add: "जोड़ें", startShopping: "खरीदारी शुरू करें",
    topCategories: "मुख्य श्रेणियाँ", trendingProducts: "ट्रेंडिंग उत्पाद", seeAll: "सभी देखें",
    todaysMarketPrices: "आज के भाव", popularCropWaste: "लोकप्रिय थोक सिक्के",
    topSellers: "टॉप विक्रेता", whatFarmersSaying: "ग्राहक क्या कहते हैं",
    haveCropsToSell: "सिक्के बेचने हैं?",
    listProduceDesc: "मिनटों में अपने सिक्के लिस्ट करें और पूरे भारत के खरीदारों तक पहुँचें।",
    proceedToCheckout: "चेकआउट करें", yourCartEmpty: "आपका कार्ट खाली है",
    browseFreshCrops: "शुरू करने के लिए सिक्के देखें।",
    noProductsListed: "अभी कोई उत्पाद नहीं है", beFirstToList: "अपने सिक्के बेचने वाले सबसे पहले व्यक्ति बनें।",
    noWasteListed: "अभी कोई थोक सिक्के नहीं हैं", sellWasteDesc: "थोक सिक्के खरीदने वालों को अपने सिक्के बेचें।",
    productsFound: "उत्पाद मिले",
  }
};

function getLang(){ return localStorage.getItem('mfw_lang') || 'en'; }
function setLang(lang){ localStorage.setItem('mfw_lang', lang); location.reload(); }
function t(key){
  const lang = getLang();
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key;
}

// Apply translations to any static element marked with data-i18n="key"
function applyStaticTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
}
document.addEventListener('DOMContentLoaded', applyStaticTranslations);

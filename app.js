const products = [
  {id:1,name:"Studio Wireless Headphones",category:"Electronics",price:2850,emoji:"🎧",color:"#e8e0f5",badge:"BESTSELLER"},
  {id:2,name:"Everyday Smart Watch",category:"Electronics",price:3250,emoji:"⌚",color:"#e2e9e5",badge:"NEW"},
  {id:3,name:"Classic Cotton Tee",category:"Fashion",price:890,emoji:"👕",color:"#f4e5d9",badge:""},
  {id:4,name:"Weekend Sneakers",category:"Fashion",price:2450,emoji:"👟",color:"#e4eaf1",badge:"POPULAR"},
  {id:5,name:"Sunday Sunglasses",category:"Accessories",price:780,emoji:"🕶️",color:"#f1e7cf",badge:""},
  {id:6,name:"City Explorer Backpack",category:"Accessories",price:1750,emoji:"🎒",color:"#e8dfd7",badge:""},
  {id:7,name:"Mini Bluetooth Speaker",category:"Electronics",price:1650,emoji:"🔊",color:"#dcebe8",badge:""},
  {id:8,name:"Soft Knit Cushion",category:"Home",price:950,emoji:"🛋️",color:"#eee1e9",badge:""},
  {id:9,name:"Ceramic Coffee Mug",category:"Home",price:520,emoji:"☕",color:"#f1e5d6",badge:""},
  {id:10,name:"Daily Carry Cap",category:"Fashion",price:650,emoji:"🧢",color:"#e5e8dc",badge:""},
  {id:11,name:"Desk Plant Pot",category:"Home",price:430,emoji:"🪴",color:"#e2ebdc",badge:""},
  {id:12,name:"Minimal Wrist Watch",category:"Accessories",price:1980,emoji:"⌚",color:"#e9e4dc",badge:"LIMITED"}
];

const STORAGE = {cart:"shopease-enhanced-cart", wishlist:"shopease-enhanced-wishlist"};
let cart = readStorage(STORAGE.cart, []);
let wishlist = readStorage(STORAGE.wishlist, []);
let activeCategory = "All";
let wishlistOnly = false;

function readStorage(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : fallback; }
  catch { return fallback; }
}
function saveStorage() {
  localStorage.setItem(STORAGE.cart, JSON.stringify(cart));
  localStorage.setItem(STORAGE.wishlist, JSON.stringify(wishlist));
}
function money(value) { return "৳" + value.toLocaleString("en-BD"); }
function productById(id) { return products.find(product => product.id === id); }

function renderProducts() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  let shown = products.filter(product => {
    const categoryMatch = activeCategory === "All" || product.category === activeCategory;
    const queryMatch = (product.name + " " + product.category).toLowerCase().includes(query);
    const wishMatch = !wishlistOnly || wishlist.includes(product.id);
    return categoryMatch && queryMatch && wishMatch;
  });
  const sort = document.getElementById("sortSelect").value;
  if (sort === "low") shown.sort((a,b) => a.price-b.price);
  if (sort === "high") shown.sort((a,b) => b.price-a.price);
  if (sort === "name") shown.sort((a,b) => a.name.localeCompare(b.name));

  document.getElementById("productGrid").innerHTML = shown.map(product => `
    <article class="product-card">
      <div class="product-image" style="background:${product.color}">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <button class="heart-button ${wishlist.includes(product.id) ? "liked" : ""}" data-wish="${product.id}" aria-label="Toggle ${product.name} wishlist">${wishlist.includes(product.id) ? "♥" : "♡"}</button>
        <span class="product-emoji" aria-hidden="true">${product.emoji}</span>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category === "Home" ? "HOME & LIVING" : product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-bottom"><span class="product-price">${money(product.price)}</span><button class="add-button" data-add="${product.id}">+ Add to bag</button></div>
      </div>
    </article>`).join("");
  document.getElementById("emptyState").hidden = shown.length !== 0;
  document.getElementById("productGrid").hidden = shown.length === 0;
  document.getElementById("resultsLabel").textContent = wishlistOnly
    ? `Showing ${shown.length} saved favourite${shown.length === 1 ? "" : "s"}`
    : `Showing ${shown.length} of ${products.length} products`;
  document.getElementById("allCount").textContent = products.length;
}

function renderCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum,item) => sum + productById(item.id).price * item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerItemCount").textContent = `(${count})`;
  document.getElementById("cartSubtotal").textContent = money(subtotal);
  document.getElementById("checkoutTotal").textContent = money(subtotal);
  document.getElementById("cartItems").innerHTML = cart.length ? cart.map(item => {
    const product = productById(item.id);
    return `<div class="cart-item">
      <div class="cart-item-art" style="background:${product.color}">${product.emoji}</div>
      <div><h4>${product.name}</h4><small>${money(product.price)}</small>
        <div class="quantity-control"><button data-quantity="${product.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-change="1" aria-label="Increase quantity">+</button></div>
      </div>
      <button class="remove-item" data-remove="${product.id}">Remove</button>
    </div>`;
  }).join("") : `<div class="cart-empty"><span>▢</span>Your bag is waiting for a good find.<br><br>Add something you love!</div>`;
  document.getElementById("checkoutButton").disabled = cart.length === 0;
  document.getElementById("checkoutButton").style.opacity = cart.length ? "1" : ".45";
}
function renderWishlistCount() { document.getElementById("wishlistCount").textContent = wishlist.length; }

function addToCart(id) {
  const item = cart.find(entry => entry.id === id);
  if (item) item.quantity++;
  else cart.push({id,quantity:1});
  saveStorage(); renderCart(); showToast("Added to your shopping bag");
}
function changeQuantity(id, change) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== id);
  saveStorage(); renderCart();
}
function toggleWishlist(id) {
  wishlist = wishlist.includes(id) ? wishlist.filter(item => item !== id) : [...wishlist,id];
  saveStorage(); renderWishlistCount(); renderProducts();
  showToast(wishlist.includes(id) ? "Saved to your favourites" : "Removed from favourites");
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2100);
}
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("drawerBackdrop").classList.add("show");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","false");
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("drawerBackdrop").classList.remove("show");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","true");
}
function closeCheckout() { document.getElementById("checkoutModal").classList.remove("show"); }

document.getElementById("productGrid").addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const wish = event.target.closest("[data-wish]");
  if (add) addToCart(Number(add.dataset.add));
  if (wish) toggleWishlist(Number(wish.dataset.wish));
});
document.querySelector(".category-sidebar").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category; wishlistOnly = false;
  document.querySelectorAll(".category-button").forEach(item => item.classList.toggle("selected", item === button));
  renderProducts();
});
document.getElementById("searchInput").addEventListener("input", () => { wishlistOnly = false; renderProducts(); });
document.getElementById("sortSelect").addEventListener("change", renderProducts);
document.getElementById("clearFilters").addEventListener("click", () => {
  activeCategory = "All"; wishlistOnly = false;
  document.getElementById("searchInput").value = "";
  document.getElementById("sortSelect").value = "featured";
  document.querySelectorAll(".category-button").forEach(button => button.classList.toggle("selected", button.dataset.category === "All"));
  renderProducts();
});
document.getElementById("resetSearch").addEventListener("click", () => document.getElementById("clearFilters").click());
document.getElementById("wishlistHeader").addEventListener("click", () => {
  wishlistOnly = !wishlistOnly; activeCategory = "All";
  document.querySelectorAll(".category-button").forEach(button => button.classList.toggle("selected", button.dataset.category === "All"));
  document.getElementById("searchInput").value = "";
  renderProducts();
  document.getElementById("shop").scrollIntoView({behavior:"smooth"});
});
document.getElementById("cartItems").addEventListener("click", event => {
  const quantity = event.target.closest("[data-quantity]");
  const remove = event.target.closest("[data-remove]");
  if (quantity) changeQuantity(Number(quantity.dataset.quantity), Number(quantity.dataset.change));
  if (remove) {
    cart = cart.filter(item => item.id !== Number(remove.dataset.remove));
    saveStorage(); renderCart(); showToast("Item removed from your bag");
  }
});
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("drawerBackdrop").addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) return;
  closeCart(); document.getElementById("checkoutModal").classList.add("show");
});
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);
document.getElementById("checkoutModal").addEventListener("click", event => {
  if (event.target.id === "checkoutModal") closeCheckout();
});
document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!cart.length) return;
  const name = document.getElementById("customerName").value.trim();
  const total = cart.reduce((sum,item) => sum + productById(item.id).price * item.quantity, 0);
  const orderNumber = "SE" + String(Date.now()).slice(-6);
  alert(`Thank you, ${name}!\n\nYour order summary ${orderNumber} is ready.\nOrder total: ${money(total)}\n\nPlease note: your details have not been sent to a store. Contact the store directly to confirm an order.`);
  cart = []; saveStorage(); renderCart(); closeCheckout();
  document.getElementById("checkoutForm").reset();
  showToast("Your order summary is ready. Thank you!");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { closeCart(); closeCheckout(); }
});

renderProducts();
renderCart();
renderWishlistCount();

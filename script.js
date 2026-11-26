const products = [
  {id:1,brand:"URBAN THREAD",name:"Relaxed fit cotton shirt",category:"Men",price:899,oldPrice:1499,discount:"40% OFF",image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80"},
  {id:2,brand:"THE STYLE EDIT",name:"Printed summer dress",category:"Women",price:1299,oldPrice:1999,discount:"35% OFF",image:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80"},
  {id:3,brand:"NORTH STREET",name:"Classic everyday sneakers",category:"Men",price:1599,oldPrice:2499,discount:"36% OFF",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"},
  {id:4,brand:"MELLOW",name:"Minimal shoulder bag",category:"Women",price:1099,oldPrice:1699,discount:"35% OFF",image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80"},
  {id:5,brand:"PLAYDAY",name:"Kids casual co-ord set",category:"Kids",price:799,oldPrice:1199,discount:"33% OFF",image:"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=80"},
  {id:6,brand:"FORM & FIBRE",name:"Textured cushion cover",category:"Home",price:499,oldPrice:799,discount:"38% OFF",image:"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80"},
  {id:7,brand:"GLOW THEORY",name:"Daily skincare essentials",category:"Beauty",price:699,oldPrice:999,discount:"30% OFF",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80"},
  {id:8,brand:"DENIM DAYS",name:"Straight fit blue jeans",category:"Women",price:1399,oldPrice:2199,discount:"36% OFF",image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80"},
  {id:9,brand:"MONOCHROME",name:"Everyday graphic tee",category:"Men",price:599,oldPrice:999,discount:"40% OFF",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"},
  {id:10,brand:"LITTLE LOOP",name:"Kids weekend outfit",category:"Kids",price:899,oldPrice:1299,discount:"31% OFF",image:"https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=700&q=80"},
  {id:11,brand:"CASA LIVING",name:"Soft neutral throw",category:"Home",price:1199,oldPrice:1799,discount:"33% OFF",image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80"},
  {id:12,brand:"EVERYDAY",name:"Lightweight running shoes",category:"Men",price:1899,oldPrice:2799,discount:"32% OFF",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"}
];

let activeCategory = "All";
let searchTerm = "";
let wishlist = [];
let bag = [];

const productGrid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function getVisibleProducts() {
  let visible = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const searchable = `${product.brand} ${product.name} ${product.category}`.toLowerCase();
    return matchesCategory && searchable.includes(searchTerm.toLowerCase());
  });

  const sort = document.getElementById("sortSelect").value;
  if (sort === "low") visible.sort((a,b) => a.price - b.price);
  if (sort === "high") visible.sort((a,b) => b.price - a.price);
  return visible;
}

function renderProducts() {
  const visible = getVisibleProducts();
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="heart-button ${wishlist.includes(product.id) ? "saved" : ""}"
          data-wishlist="${product.id}" aria-label="Add ${product.name} to wishlist">
          ${wishlist.includes(product.id) ? "♥" : "♡"}
        </button>
      </div>
      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <p class="product-name">${product.name}</p>
        <div class="price-line">
          <span class="price">₹${product.price.toLocaleString("en-IN")}</span>
          <span class="old-price">₹${product.oldPrice.toLocaleString("en-IN")}</span>
          <span class="discount">(${product.discount})</span>
        </div>
        <button class="add-button" data-add="${product.id}">ADD TO BAG +</button>
      </div>
    </article>
  `).join("");

  resultCount.textContent = `Showing ${visible.length} of ${products.length} products`;
  emptyState.hidden = visible.length !== 0;
  productGrid.hidden = visible.length === 0;
}

function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".filter-chip").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === category);
  });
  renderProducts();
}

function updateCounts() {
  document.getElementById("wishlistCount").textContent = wishlist.length;
  document.getElementById("bagCount").textContent = bag.length;
}

productGrid.addEventListener("click", event => {
  const wishlistButton = event.target.closest("[data-wishlist]");
  const addButton = event.target.closest("[data-add]");

  if (wishlistButton) {
    const id = Number(wishlistButton.dataset.wishlist);
    wishlist = wishlist.includes(id) ? wishlist.filter(item => item !== id) : [...wishlist, id];
    updateCounts();
    renderProducts();
    showToast(wishlist.includes(id) ? "Added to wishlist" : "Removed from wishlist");
  }

  if (addButton) {
    const product = products.find(item => item.id === Number(addButton.dataset.add));
    bag.push(product.id);
    updateCounts();
    showToast(`${product.name} added to your bag`);
  }
});

document.getElementById("filterRow").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (button) setCategory(button.dataset.filter);
});

document.querySelectorAll(".category-tile").forEach(tile => {
  tile.addEventListener("click", () => {
    setCategory(tile.dataset.filter);
    document.getElementById("products").scrollIntoView({behavior:"smooth"});
  });
});

document.querySelectorAll(".main-nav [data-category]").forEach(link => {
  link.addEventListener("click", () => setCategory(link.dataset.category));
});

document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = document.getElementById("searchInput").value.trim();
  renderProducts();
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
});

document.getElementById("searchInput").addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderProducts();
});

document.getElementById("sortSelect").addEventListener("change", renderProducts);

document.getElementById("resetButton").addEventListener("click", () => {
  searchTerm = "";
  document.getElementById("searchInput").value = "";
  document.getElementById("sortSelect").value = "featured";
  setCategory("All");
});

document.getElementById("wishlistButton").addEventListener("click", () => {
  if (wishlist.length === 0) return showToast("Your wishlist is empty — tap a heart to save a product");
  const names = wishlist.map(id => products.find(product => product.id === id).name);
  showToast(`Wishlist: ${names.slice(0,2).join(", ")}${names.length > 2 ? "…" : ""}`);
});

document.getElementById("bagButton").addEventListener("click", () => {
  if (bag.length === 0) return showToast("Your bag is empty — add a product to get started");
  const total = bag.reduce((sum,id) => sum + products.find(product => product.id === id).price, 0);
  showToast(`${bag.length} item(s) in bag • Total: ₹${total.toLocaleString("en-IN")}`);
});

document.getElementById("profileButton").addEventListener("click", () => {
  showToast("Profile demo — sign-in is not connected in this frontend project");
});

document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("emailInput").value.trim();
  document.getElementById("newsletterMessage").textContent = `Thanks! ${email} has been added to this demo list.`;
  event.target.reset();
});

const menuToggle = document.getElementById("menuToggle");
menuToggle.addEventListener("click", () => {
  const nav = document.getElementById("mainNav");
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

renderProducts();
updateCounts();

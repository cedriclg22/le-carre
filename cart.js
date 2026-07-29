/* ============================================================
   LE CARRÉ — panier (partagé entre index.html et checkout.html)
   Persistance : localStorage. API publique : window.Cart
   ============================================================ */
(function () {
  const KEY = "lecarre_cart";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    refresh();
    document.dispatchEvent(new CustomEvent("cart:change"));
  }

  const count = () => read().reduce((n, it) => n + it.qty, 0);
  const total = () => read().reduce((s, it) => s + it.price * it.qty, 0);

  function add(item) {
    const items = read();
    const found = items.find((it) => it.id === item.id);
    if (found) found.qty += item.qty || 1;
    else items.push(Object.assign({ qty: 1 }, item));
    write(items);
  }
  function setQty(id, qty) {
    let items = read();
    const it = items.find((x) => x.id === id);
    if (!it) return;
    it.qty = qty;
    if (it.qty <= 0) items = items.filter((x) => x.id !== id);
    write(items);
  }
  const remove = (id) => write(read().filter((x) => x.id !== id));
  const clear = () => write([]);

  /* ---- rendu (compteur + tiroir) --------------------------- */
  function refresh() {
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = count();
      el.classList.toggle("has-items", count() > 0);
    });
    renderDrawer();
  }

  function renderDrawer() {
    const body = document.getElementById("cartBody");
    if (!body) return;
    const items = read();
    const totalEl = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("cartCheckout");

    if (!items.length) {
      body.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
      if (totalEl) totalEl.textContent = "0€";
      if (checkoutBtn) checkoutBtn.setAttribute("disabled", "");
      return;
    }
    body.innerHTML = items.map((it) => `
      <div class="cart-line" data-id="${it.id}">
        <img class="cl-img" src="${it.img}" alt="${it.productName}">
        <div class="cl-info">
          <p class="cl-name">${it.productName}</p>
          <p class="cl-variant">${it.gamme ? it.gamme + " · " : ""}${it.size}</p>
          <div class="cl-qty">
            <button class="qty-btn qty-dec" aria-label="Diminuer">−</button>
            <span class="qty-val">${it.qty}</span>
            <button class="qty-btn qty-inc" aria-label="Augmenter">+</button>
            <button class="cl-remove" aria-label="Retirer l'article">Retirer</button>
          </div>
        </div>
        <p class="cl-price">${it.price * it.qty}€</p>
      </div>`).join("");
    if (totalEl) totalEl.textContent = total() + "€";
    if (checkoutBtn) checkoutBtn.removeAttribute("disabled");

    body.querySelectorAll(".cart-line").forEach((line) => {
      const id = line.dataset.id;
      const cur = () => (read().find((x) => x.id === id) || { qty: 1 }).qty;
      line.querySelector(".qty-dec").onclick = () => setQty(id, cur() - 1);
      line.querySelector(".qty-inc").onclick = () => setQty(id, cur() + 1);
      line.querySelector(".cl-remove").onclick = () => remove(id);
    });
  }

  const openDrawer = () => {
    document.getElementById("cartDrawer") && document.getElementById("cartDrawer").classList.add("is-open");
    document.getElementById("cartOverlay") && document.getElementById("cartOverlay").classList.add("is-open");
  };
  const closeDrawer = () => {
    document.getElementById("cartDrawer") && document.getElementById("cartDrawer").classList.remove("is-open");
    document.getElementById("cartOverlay") && document.getElementById("cartOverlay").classList.remove("is-open");
  };

  function init() {
    refresh();
    document.querySelectorAll(".header-cart").forEach((b) =>
      b.addEventListener("click", openDrawer)
    );
    const c = document.getElementById("cartClose");
    if (c) c.addEventListener("click", closeDrawer);
    const ov = document.getElementById("cartOverlay");
    if (ov) ov.addEventListener("click", closeDrawer);
    const co = document.getElementById("cartCheckout");
    if (co) co.addEventListener("click", () => { if (count()) location.href = "checkout.html"; });

    // Menu (hamburger, haut-gauche)
    const md = document.getElementById("menuDrawer");
    const mov = document.getElementById("menuOverlay");
    const menuOpen = () => { if (md) md.classList.add("is-open"); if (mov) mov.classList.add("is-open"); };
    const menuClose = () => { if (md) md.classList.remove("is-open"); if (mov) mov.classList.remove("is-open"); };
    document.querySelectorAll(".header-menu").forEach((b) => b.addEventListener("click", menuOpen));
    const mc = document.getElementById("menuClose");
    if (mc) mc.addEventListener("click", menuClose);
    if (mov) mov.addEventListener("click", menuClose);
    document.querySelectorAll("#menuDrawer a").forEach((a) => a.addEventListener("click", menuClose));
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();

  window.Cart = { add, read, total, count, clear, setQty, remove, open: openDrawer, close: closeDrawer };
})();

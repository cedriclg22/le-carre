/* ============================================================
   LE CARRÉ — page de paiement
   Récapitulatif depuis le panier + formulaire + point Stripe.
   ============================================================ */
(function () {
  const items = window.Cart.read();
  const subtotalEl = document.getElementById("sumSubtotal");
  const totalEl = document.getElementById("sumTotal");
  const payTotalEl = document.getElementById("payTotal");
  const itemsEl = document.getElementById("summaryItems");
  const payBtn = document.getElementById("payBtn");
  const form = document.getElementById("checkoutForm");

  function money(n) { return n + "€"; }

  function renderSummary() {
    const list = window.Cart.read();
    const total = window.Cart.total();

    if (!list.length) {
      itemsEl.innerHTML = '<p class="co-empty">Votre panier est vide.</p>';
      subtotalEl.textContent = totalEl.textContent = payTotalEl.textContent = money(0);
      payBtn.setAttribute("disabled", "");
      return;
    }
    itemsEl.innerHTML = list.map((it) => `
      <div class="co-item">
        <div class="co-item-thumb">
          <img src="${it.img}" alt="${it.productName}">
          <span class="co-item-qty">${it.qty}</span>
        </div>
        <div class="co-item-info">
          <p class="co-item-name">${it.productName}</p>
          <p class="co-item-variant">${it.color} · ${it.thread} · taille ${it.size}</p>
        </div>
        <p class="co-item-price">${it.price * it.qty}€</p>
      </div>`).join("");

    subtotalEl.textContent = money(total);
    totalEl.textContent = money(total);
    payTotalEl.textContent = money(total);
    payBtn.removeAttribute("disabled");
  }

  renderSummary();
  document.addEventListener("cart:change", renderSummary);

  /* ---- Point d'intégration Stripe -------------------------------------
     Quand vous connecterez Stripe :
       1. Ajoutez <script src="https://js.stripe.com/v3/"></script> dans checkout.html
       2. const stripe = Stripe("pk_live_…");
       3. Créez un PaymentIntent côté serveur, montez les Stripe Elements
          dans #stripeMount, puis appelez stripe.confirmPayment() ici.
     Pour l'instant, le bouton valide le formulaire et affiche un message. */
  function initStripe() {
    // TODO: initialiser Stripe et monter les Elements dans #stripeMount
    return null;
  }
  initStripe();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!window.Cart.count()) { toast("Votre panier est vide."); return; }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Stripe non connecté -> message clair (aucun paiement réel n'est traité)
    toast("Commande prête — connectez Stripe pour activer le paiement.");
    payBtn.textContent = "Paiement à connecter (Stripe)";
    payBtn.setAttribute("disabled", "");
    setTimeout(() => {
      payBtn.removeAttribute("disabled");
      payBtn.innerHTML = 'Payer <span id="payTotal">' + money(window.Cart.total()) + "</span>";
    }, 2600);
  });

  /* ---- petit toast (autonome sur cette page) ---- */
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById("cartToast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2800);
  }
})();

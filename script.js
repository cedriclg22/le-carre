/* ============================================================
   LE CARRÉ — interactions
   ============================================================ */

/* ---- Données produit ---------------------------------------
   Prix selon le fil de couture :
   Tshirt   : argenté 89€  | doré 139€
   Pantalon : argenté 129€ | doré 219€
------------------------------------------------------------- */
const PRODUCTS = {
  tshirt: {
    name: "Le Tshirt",
    prices: { argente: 89, dore: 139 },
  },
  pantalon: {
    name: "Le Pantalon",
    prices: { argente: 129, dore: 219 },
  },
};

/* ---- Photos par variante (fil + couleur) ------------------ */
const IMAGES = {
  tshirt: {
    "argente-blanc": ["images/tshirt-blanc-argent-1.jpg", "images/tshirt-blanc-argent-2.jpg"],
    "argente-noir":  ["images/tshirt-noir-argent-1.jpg",  "images/tshirt-noir-argent-2.jpg"],
    "dore-blanc":    ["images/tshirt-blanc-dore-1.jpg",   "images/tshirt-blanc-dore-2.jpg"],
    "dore-noir":     ["images/tshirt-noir-dore-1.jpg",    "images/tshirt-noir-dore-2.jpg"],
  },
  pantalon: {
    "argente-clair": ["images/pantalon-clair-argent-1.jpg", "images/pantalon-clair-argent-2.jpg"],
    "argente-noir":  ["images/pantalon-noir-argent-1.jpg",  "images/pantalon-noir-argent-2.jpg"],
    "dore-clair":    ["images/pantalon-clair-dore-1.jpg",   "images/pantalon-clair-dore-2.jpg"],
    "dore-noir":     ["images/pantalon-noir-dore-1.jpg",    "images/pantalon-noir-dore-2.jpg"],
  },
};

const THREAD_COLOR = { argente: "#c1c6cd", dore: "#c6a24e" };

/* ---- Illustrations SVG (fallback : produits sans photo) --- */
function squares(list, thread) {
  return list
    .map(
      (s) => `
      <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.w}"
        transform="rotate(${s.r} ${s.x + s.w / 2} ${s.y + s.w / 2})"
        fill="none" stroke="${thread}" stroke-width="1.4"
        stroke-dasharray="3 2.4" opacity="0.9"/>`
    )
    .join("");
}

function pantalonSVG(thread, view) {
  const layouts = [
    [ {x:66,y:120,w:26,r:-8}, {x:150,y:180,w:22,r:10}, {x:80,y:210,w:18,r:6} ],
    [ {x:100,y:150,w:48,r:6} ],
    [ {x:70,y:100,w:18,r:-6}, {x:150,y:100,w:18,r:8},
      {x:74,y:190,w:18,r:10}, {x:150,y:190,w:18,r:-6} ],
  ];
  return `
  <svg viewBox="0 0 260 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Le Pantalon">
    <defs>
      <linearGradient id="denim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#232a3b"/>
        <stop offset="1" stop-color="#171d2b"/>
      </linearGradient>
    </defs>
    <path d="M74 30 L186 30 L182 70 L196 300 L150 300 L132 120 L128 300 L82 300
             L64 70 Z"
          fill="url(#denim)" stroke="#0f1420" stroke-width="1.5"/>
    <line x1="74" y1="44" x2="186" y2="44" stroke="#0f1420" stroke-width="1.2" opacity="0.6"/>
    ${squares(layouts[view % layouts.length], thread)}
  </svg>`;
}

const SVG_RENDER = { pantalon: pantalonSVG };

/* ---- Couture dans les pastilles (fil doré / argenté) ------ */
function swatchStitchColor(sw) {
  const dark = sw.classList.contains("swatch-black") || sw.classList.contains("swatch-navy");
  if (sw.classList.contains("gold")) return dark ? "#d9b45a" : "#c19a3f";
  return dark ? "#d3d7dc" : "#8b929c";
}
document.querySelectorAll(".swatch").forEach((sw) => {
  const c = swatchStitchColor(sw);
  sw.innerHTML =
    '<svg viewBox="0 0 42 34" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
    '<polyline points="9,24 22,10 33,20" fill="none" stroke="' + c + '"' +
    ' stroke-width="1.7" stroke-dasharray="2.6 2" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";
});

/* Dispo :
   - fil doré   -> disponible en permanence (achat direct)
   - fil argenté-> édition limitée, le 2 de chaque mois (formulaire "prévenez-moi")

   Précharge toutes les photos de variantes -> bascule instantanée, pas de saut. */
window.addEventListener("load", () => setTimeout(() => {
  Object.keys(IMAGES).forEach((pk) =>
    Object.keys(IMAGES[pk]).forEach((v) =>
      IMAGES[pk][v].forEach((src) => { const im = new Image(); im.src = src; })
    )
  );
}, 250));

/* ---- État ------------------------------------------------- */
const state = {};

/* ---- Init des produits ------------------------------------ */
document.querySelectorAll(".product").forEach((card) => {
  const key = card.dataset.product;
  const hasImages = !!(card.querySelector(".variants") && IMAGES[key]);

  state[key] = { thread: "argente", color: "blanc", size: null, view: 0 };

  // variante par défaut = pastille pré-sélectionnée dans le HTML
  const preselected = card.querySelector(".swatch-btn.is-selected");
  if (hasImages && preselected) {
    state[key].thread = preselected.dataset.thread;
    state[key].color = preselected.dataset.color;
  }

  const track = card.querySelector(".carousel-track");
  const dotsWrap = card.querySelector(".carousel-dots");
  const btn = card.querySelector(".add-to-cart");

  const notifyPriceEl = card.querySelector(".notify-price");
  if (notifyPriceEl) notifyPriceEl.textContent = PRODUCTS[key].prices.argente + "€";

  /* liste des vues (HTML) selon le mode --------------------- */
  function slidesHTML() {
    if (hasImages) {
      const variant = state[key].thread + "-" + state[key].color;
      return IMAGES[key][variant].map(
        (src) => `<img src="${src}" alt="${PRODUCTS[key].name}" loading="lazy">`
      );
    }
    const thread = THREAD_COLOR[state[key].thread];
    return [0, 1, 2].map((i) => SVG_RENDER[key](thread, i));
  }

  /* --- carrousel infini : « suivant » avance toujours vers la droite ---
     Vues physiques : [clone(dernier), vues…, clone(premier)]. */
  let n = 0;
  let phys = 1;
  let animating = false;

  function logicalIndex() { return (((phys - 1) % n) + n) % n; }

  function updateDots() {
    const li = logicalIndex();
    dotsWrap.querySelectorAll(".dot").forEach((d, i) =>
      d.classList.toggle("is-active", i === li)
    );
  }

  function place(i, animate) {
    phys = i;
    if (!animate) track.style.transition = "none";
    track.style.transform = `translateX(-${phys * 100}%)`;
    if (!animate) {
      track.getBoundingClientRect(); // force le reflow
      track.style.transition = "";
    }
    updateDots();
  }

  function paintSlides() {
    const html = slidesHTML();
    n = html.length;
    const seq = [html[n - 1]].concat(html, [html[0]]);
    track.innerHTML = "";
    seq.forEach((h) => {
      const s = document.createElement("div");
      s.className = "slide";
      s.innerHTML = h;
      track.appendChild(s);
    });
    dotsWrap.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", "Vue " + (i + 1));
      dot.addEventListener("click", () => {
        if (animating || i + 1 === phys) return;
        animating = true;
        place(i + 1, true);
      });
      dotsWrap.appendChild(dot);
    }
    place(1, false); // démarre sur la 1re vraie vue
  }

  function step(dir) {
    if (animating || n < 2) return;
    animating = true;
    place(phys + dir, true);
  }

  track.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;
    if (phys === n + 1) place(1, false);      // au-delà de la fin -> 1re vue
    else if (phys === 0) place(n, false);     // avant le début -> dernière vue
    animating = false;
  });

  card.querySelector(".carousel-arrow.prev").addEventListener("click", () => step(-1));
  card.querySelector(".carousel-arrow.next").addEventListener("click", () => step(1));

  // fil argenté -> mode "prévenez-moi" ; fil doré -> achat direct
  function updateCTA() {
    const silver = state[key].thread === "argente";
    card.classList.toggle("notify-mode", silver);
    if (!silver) {
      const price = PRODUCTS[key].prices.dore;
      btn.dataset.price = price;
      btn.textContent = `Ajouter au panier — ${price}€`;
    }
  }

  /* --- MODE PHOTOS : pastilles couleur + fil --- */
  if (hasImages) {
    card.querySelectorAll(".swatch-btn").forEach((sw) => {
      sw.addEventListener("click", () => {
        state[key].thread = sw.dataset.thread;
        state[key].color = sw.dataset.color;
        card.querySelectorAll(".swatch-btn").forEach((s) =>
          s.classList.toggle("is-selected", s === sw)
        );
        updateCTA();
        paintSlides();
      });
    });
  } else {
    /* --- MODE SVG : fil doré / argenté --- */
    card.querySelectorAll(".thread").forEach((tBtn) => {
      tBtn.addEventListener("click", () => {
        state[key].thread = tBtn.dataset.thread;
        card.querySelectorAll(".thread").forEach((t) =>
          t.classList.toggle("is-selected", t === tBtn)
        );
        updateCTA();
        paintSlides();
      });
    });
  }

  /* tailles */
  card.querySelectorAll(".size").forEach((sBtn) => {
    sBtn.addEventListener("click", () => {
      state[key].size = sBtn.textContent;
      card.querySelectorAll(".size").forEach((s) =>
        s.classList.toggle("is-selected", s === sBtn)
      );
    });
  });

  /* fil argenté : formulaire "prévenez-moi la veille du 2" */
  const notifyForm = card.querySelector(".notify-form");
  if (notifyForm) {
    notifyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      e.target.reset();
      toast("Merci ! Vous serez prévenu·e la veille du prochain 2.");
    });
  }

  /* ajouter au panier (fil doré) */
  btn.addEventListener("click", () => {
    if (!state[key].size) {
      toast("Merci de choisir une taille.");
      card.querySelector(".sizes").animate(
        [{ opacity: 0.35 }, { opacity: 1 }],
        { duration: 500 }
      );
      return;
    }
    const p = PRODUCTS[key];
    const variant = state[key].thread + "-" + state[key].color;
    const price = p.prices[state[key].thread];
    const fil = state[key].thread === "dore" ? "fil doré" : "fil argenté";
    window.Cart.add({
      id: key + "-" + variant + "-" + state[key].size,
      product: key,
      productName: p.name,
      thread: fil,
      color: state[key].color,
      size: state[key].size,
      price: price,
      img: (IMAGES[key] && IMAGES[key][variant]) ? IMAGES[key][variant][0] : "",
    });
    window.Cart.open();
    toast(`${p.name} ajouté au panier`);
  });

  updateCTA();
  paintSlides();
});

/* ---- Toast panier ----------------------------------------- */
let toastTimer;
function toast(msg) {
  const el = document.getElementById("cartToast");
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
}

/* ---- Newsletter ------------------------------------------- */
document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  toast("Merci ! Vous êtes inscrit·e à la newsletter.");
});

/* ---- Header : apparaît uniquement au scroll --------------- */
const header = document.getElementById("siteHeader");
function onScroll() {
  const scrolled = window.scrollY > 120;
  header.classList.toggle("is-visible", scrolled);
  header.style.boxShadow = scrolled ? "0 6px 24px rgba(0,0,0,0.05)" : "none";
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

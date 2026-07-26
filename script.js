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

/* Seul le fil argenté est disponible (le 2 de chaque mois).
   Le fil doré est visible en aperçu mais pas encore achetable. */
const AVAILABLE_THREADS = ["argente"];

/* ---- État ------------------------------------------------- */
let cartCount = 0;
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

  /* liste des slides (HTML) selon le mode ------------------- */
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

  function paintSlides() {
    const slides = slidesHTML();
    track.innerHTML = "";
    slides.forEach((html) => {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.innerHTML = html;
      track.appendChild(slide);
    });
    // points (créés une seule fois d'après le nb de vues)
    if (dotsWrap.children.length !== slides.length) {
      dotsWrap.innerHTML = "";
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "dot";
        dot.setAttribute("aria-label", "Vue " + (i + 1));
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }
    if (state[key].view >= slides.length) state[key].view = 0;
    goTo(state[key].view);
  }

  function goTo(i) {
    const n = track.children.length || 1;
    state[key].view = (i + n) % n;
    track.style.transform = `translateX(-${state[key].view * 100}%)`;
    dotsWrap.querySelectorAll(".dot").forEach((d, idx) =>
      d.classList.toggle("is-active", idx === state[key].view)
    );
  }

  card.querySelector(".carousel-arrow.prev")
    .addEventListener("click", () => goTo(state[key].view - 1));
  card.querySelector(".carousel-arrow.next")
    .addEventListener("click", () => goTo(state[key].view + 1));

  function isAvailable() {
    return AVAILABLE_THREADS.indexOf(state[key].thread) !== -1;
  }

  function setPrice() {
    if (isAvailable()) {
      const price = PRODUCTS[key].prices[state[key].thread];
      btn.dataset.price = price;
      btn.classList.remove("is-unavailable");
      btn.textContent = `Ajouter au panier — ${price}€`;
    } else {
      btn.classList.add("is-unavailable");
      btn.textContent = "Fil doré — bientôt disponible";
    }
  }

  /* --- MODE PHOTOS : pastilles couleur + fil --- */
  if (hasImages) {
    card.querySelectorAll(".swatch-btn").forEach((sw) => {
      sw.addEventListener("click", () => {
        state[key].thread = sw.dataset.thread;
        state[key].color = sw.dataset.color;
        state[key].view = 0;
        card.querySelectorAll(".swatch-btn").forEach((s) =>
          s.classList.toggle("is-selected", s === sw)
        );
        setPrice();
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
        setPrice();
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

  /* ajouter au panier */
  btn.addEventListener("click", () => {
    if (!isAvailable()) {
      toast("Le fil doré arrive bientôt — seul le fil argenté est proposé, le 2 de chaque mois.");
      return;
    }
    if (!state[key].size) {
      toast("Merci de choisir une taille.");
      card.querySelector(".sizes").animate(
        [{ opacity: 0.35 }, { opacity: 1 }],
        { duration: 500 }
      );
      return;
    }
    cartCount++;
    document.getElementById("cartCount").textContent = cartCount;
    const p = PRODUCTS[key];
    const fil = state[key].thread === "dore" ? "fil doré" : "fil argenté";
    const couleur = hasImages ? " · " + state[key].color : "";
    toast(`${p.name}${couleur} · ${fil} · taille ${state[key].size} — ${p.prices[state[key].thread]}€`);
  });

  setPrice();
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

/* ---- Header au scroll ------------------------------------- */
const header = document.getElementById("siteHeader");
addEventListener("scroll", () => {
  header.style.boxShadow = window.scrollY > 40
    ? "0 6px 24px rgba(0,0,0,0.04)"
    : "none";
});

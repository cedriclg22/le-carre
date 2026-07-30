/* ============================================================
   LE CARRÉ — interactions
   ============================================================ */

/* ---- Données produit ---------------------------------------
   Prix selon le fil de couture :
   Tshirt   : argenté 89€  | doré 139€
   Pantalon : argenté 129€ | doré 219€
------------------------------------------------------------- */
const PRODUCTS = {
  // prix par gamme : Carbone (placeholder) < Platine (ex-argenté) < Or (ex-doré)
  tshirt:            { name: "Le Tshirt · Homme",   prices: { carbone: 59,  platine: 89,  or: 139 } },
  pantalon:          { name: "Le Pantalon · Homme", prices: { carbone: 99,  platine: 129, or: 219 } },
  "tshirt-femme":    { name: "Le Tshirt · Femme",   prices: { carbone: 59,  platine: 89,  or: 139 } },
  "pantalon-femme":  { name: "Le Pantalon · Femme", prices: { carbone: 99,  platine: 129, or: 219 } },
  "chaussure":       { name: "La Chaussure · Homme", prices: { carbone: 130, platine: 280, or: 790 } },
  "chaussure-femme": { name: "La Chaussure · Femme", prices: { carbone: 130, platine: 280, or: 790 } },
};

/* ---- Photos ---------------------------------------------------------
   Vêtements : IMAGES[produit][gamme][couleur] = [vues]  (gamme + couleur)
   Chaussure : IMAGES[produit][gamme]          = [vues]  (gamme seule)
--------------------------------------------------------------------- */
const IMAGES = {
  tshirt: {
    carbone: { blanc: ["images/tshirt-blanc-carbone-1.jpg","images/tshirt-blanc-carbone-2.jpg"], noir: ["images/tshirt-noir-carbone-1.jpg","images/tshirt-noir-carbone-2.jpg"] },
    platine: { blanc: ["images/tshirt-blanc-argent-1.jpg","images/tshirt-blanc-argent-2.jpg"], noir: ["images/tshirt-noir-argent-1.jpg","images/tshirt-noir-argent-2.jpg"] },
    or:      { blanc: ["images/tshirt-blanc-dore-1.jpg","images/tshirt-blanc-dore-2.jpg"], noir: ["images/tshirt-noir-dore-1.jpg","images/tshirt-noir-dore-2.jpg"] },
  },
  pantalon: {
    carbone: { clair: ["images/pantalon-clair-carbone-1.jpg","images/pantalon-clair-carbone-2.jpg"], noir: ["images/pantalon-noir-carbone-1.jpg","images/pantalon-noir-carbone-2.jpg"] },
    platine: { clair: ["images/pantalon-clair-argent-1.jpg","images/pantalon-clair-argent-2.jpg"], noir: ["images/pantalon-noir-argent-1.jpg","images/pantalon-noir-argent-2.jpg"] },
    or:      { clair: ["images/pantalon-clair-dore-1.jpg","images/pantalon-clair-dore-2.jpg"], noir: ["images/pantalon-noir-dore-1.jpg","images/pantalon-noir-dore-2.jpg"] },
  },
  "tshirt-femme": {
    carbone: { blanc: ["images/femme-tshirt-blanc-carbone-1.jpg","images/femme-tshirt-blanc-carbone-2.jpg"], noir: ["images/femme-tshirt-noir-carbone-1.jpg","images/femme-tshirt-noir-carbone-2.jpg"] },
    platine: { blanc: ["images/femme-tshirt-blanc-argent-1.jpg","images/femme-tshirt-blanc-argent-2.jpg"], noir: ["images/femme-tshirt-noir-argent-1.jpg","images/femme-tshirt-noir-argent-2.jpg"] },
    or:      { blanc: ["images/femme-tshirt-blanc-dore-1.jpg","images/femme-tshirt-blanc-dore-2.jpg"], noir: ["images/femme-tshirt-noir-dore-1.jpg","images/femme-tshirt-noir-dore-2.jpg"] },
  },
  "pantalon-femme": {
    carbone: { clair: ["images/femme-pantalon-clair-carbone-1.jpg","images/femme-pantalon-clair-carbone-2.jpg"], noir: ["images/femme-pantalon-noir-carbone-1.jpg","images/femme-pantalon-noir-carbone-2.jpg"] },
    platine: { clair: ["images/femme-pantalon-clair-argent-1.jpg","images/femme-pantalon-clair-argent-2.jpg"], noir: ["images/femme-pantalon-noir-argent-1.jpg","images/femme-pantalon-noir-argent-2.jpg"] },
    or:      { clair: ["images/femme-pantalon-clair-dore-1.jpg","images/femme-pantalon-clair-dore-2.jpg"], noir: ["images/femme-pantalon-noir-dore-1.jpg","images/femme-pantalon-noir-dore-2.jpg"] },
  },
  chaussure: {
    carbone: { blanc: ["images/chaussure-blanc-noir.jpg"], noir: ["images/chaussure-noir-noir.jpg"] },
    platine: { blanc: ["images/chaussure-blanc-gris.jpg"], noir: ["images/chaussure-noir-argent.jpg"] },
    or:      { blanc: ["images/chaussure-blanc-or.jpg"], noir: ["images/chaussure-noir-or.jpg"] },
  },
  "chaussure-femme": {
    carbone: { blanc: ["images/chaussure-blanc-noir.jpg"], noir: ["images/chaussure-noir-noir.jpg"] },
    platine: { blanc: ["images/chaussure-blanc-gris.jpg"], noir: ["images/chaussure-noir-argent.jpg"] },
    or:      { blanc: ["images/chaussure-blanc-or.jpg"], noir: ["images/chaussure-noir-or.jpg"] },
  },
};

const GAMME_NAME = { carbone: "Carbone", platine: "Platine", or: "Or" };
const COLOR_NAME = { blanc: "blanc", noir: "noir", clair: "clair" };

/* ---- Phrase matière, sous les gammes (change avec la sélection) ---- */
const MATERIAL_TEXT = {
  vetement: {
    carbone: "100% coton et véritable carbone 1K",
    platine: "100% coton et véritable platine pur 99,99%",
    or:      "100% coton et véritable or 18k",
  },
  chaussure: {
    carbone: "Cuir synthétique + caoutchouc + véritable carbone 1K",
    platine: "Cuir synthétique + caoutchouc + véritable platine pur 99,99%",
    or:      "Cuir synthétique + caoutchouc + véritable or 18k",
  },
};

/* Précharge toutes les photos -> bascule instantanée, pas de saut. */
window.addEventListener("load", () => setTimeout(() => {
  Object.values(IMAGES).forEach((prod) =>
    Object.values(prod).forEach((g) => {
      const lists = Array.isArray(g) ? [g] : Object.values(g);
      lists.forEach((list) => list.forEach((src) => { const im = new Image(); im.src = src; }));
    })
  );
}, 250));

/* ---- État ------------------------------------------------- */
const state = {};

/* ---- Init des produits ------------------------------------ */
document.querySelectorAll(".product").forEach((card) => {
  const key = card.dataset.product;

  // gamme par défaut = bouton pré-sélectionné, sinon 1re gamme dispo
  const preselected = card.querySelector(".gamme-btn.is-selected") || card.querySelector(".gamme-btn");
  const preColor = card.querySelector(".color-btn.is-selected") || card.querySelector(".color-btn");
  state[key] = {
    gamme: preselected ? preselected.dataset.gamme : "carbone",
    color: preColor ? preColor.dataset.color : null,
    size: null,
  };
  if (preselected) card.querySelectorAll(".gamme-btn").forEach((g) => g.classList.toggle("is-selected", g === preselected));
  if (preColor) card.querySelectorAll(".color-btn").forEach((c) => c.classList.toggle("is-selected", c === preColor));

  // photos de la sélection courante (gamme [+ couleur pour les vêtements])
  function currentImages() {
    const g = IMAGES[key][state[key].gamme];
    if (!g) return [];
    if (Array.isArray(g)) return g;                       // chaussure : liste directe
    return g[state[key].color] || g[Object.keys(g)[0]];   // vêtement : par couleur
  }

  const track = card.querySelector(".carousel-track");
  const dotsWrap = card.querySelector(".carousel-dots");
  const carousel = card.querySelector(".carousel");
  const btn = card.querySelector(".add-to-cart");

  /* --- carrousel : « suivant » avance toujours vers la droite --- */
  let n = 0;
  let phys = 1;
  let animating = false;

  function logicalIndex() { return n ? (((phys - 1) % n) + n) % n : 0; }

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

  function buildDots() {
    dotsWrap.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", "Vue " + (i + 1));
      dot.addEventListener("click", () => {
        if (animating || n < 2 || i + 1 === phys) return;
        animating = true;
        place(i + 1, true);
      });
      dotsWrap.appendChild(dot);
    }
  }

  function paintSlides() {
    const srcs = currentImages();
    n = srcs.length;
    carousel.classList.toggle("single", n < 2);
    // >1 vue : on ajoute des clones aux extrémités pour un défilement infini
    const seq = n > 1 ? [srcs[n - 1]].concat(srcs, [srcs[0]]) : srcs.slice();

    const imgs = track.querySelectorAll(".slide img");
    if (imgs.length === seq.length && seq.length > 0) {
      imgs.forEach((img, i) => {
        if (img.getAttribute("src") !== seq[i]) img.setAttribute("src", seq[i]);
      });
    } else {
      track.innerHTML = "";
      seq.forEach((src) => {
        const s = document.createElement("div");
        s.className = "slide";
        const im = document.createElement("img");
        im.src = src; im.alt = PRODUCTS[key].name; im.loading = "lazy";
        s.appendChild(im);
        track.appendChild(s);
      });
      buildDots();
    }
    place(n > 1 ? 1 : 0, false);
  }

  function step(dir) {
    if (animating || n < 2) return;
    animating = true;
    place(phys + dir, true);
  }

  track.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform" || n < 2) return;
    if (phys === n + 1) place(1, false);      // au-delà de la fin -> 1re vue
    else if (phys === 0) place(n, false);     // avant le début -> dernière vue
    animating = false;
  });

  card.querySelector(".carousel-arrow.prev").addEventListener("click", () => step(-1));
  card.querySelector(".carousel-arrow.next").addEventListener("click", () => step(1));

  function currentPrice() { return PRODUCTS[key].prices[state[key].gamme]; }

  const materialNote = card.querySelector(".material-note");
  const materialKind = key.startsWith("chaussure") ? "chaussure" : "vetement";

  function updateCTA() {
    const price = currentPrice();
    btn.dataset.price = price;
    btn.textContent = `Ajouter au panier — ${price}€`;
    if (materialNote) materialNote.textContent = MATERIAL_TEXT[materialKind][state[key].gamme];
  }

  /* --- sélection de la gamme (Carbone / Platine / Or) --- */
  card.querySelectorAll(".gamme-btn").forEach((gb) => {
    gb.addEventListener("click", () => {
      state[key].gamme = gb.dataset.gamme;
      card.querySelectorAll(".gamme-btn").forEach((g) =>
        g.classList.toggle("is-selected", g === gb)
      );
      updateCTA();
      paintSlides();
    });
  });

  /* --- sélection de la couleur du vêtement --- */
  card.querySelectorAll(".color-btn").forEach((cb) => {
    cb.addEventListener("click", () => {
      state[key].color = cb.dataset.color;
      card.querySelectorAll(".color-btn").forEach((c) =>
        c.classList.toggle("is-selected", c === cb)
      );
      paintSlides();
    });
  });

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
    if (!state[key].size) {
      toast("Merci de choisir une taille.");
      card.querySelector(".sizes").animate(
        [{ opacity: 0.35 }, { opacity: 1 }],
        { duration: 500 }
      );
      return;
    }
    const p = PRODUCTS[key];
    const gamme = state[key].gamme;
    const color = state[key].color;
    const imgs = currentImages();
    window.Cart.add({
      id: key + "-" + gamme + "-" + (color || "") + "-" + state[key].size,
      product: key,
      productName: p.name,
      gamme: GAMME_NAME[gamme] || gamme,
      color: color ? (COLOR_NAME[color] || color) : "",
      size: state[key].size,
      price: currentPrice(),
      img: imgs[0] || "",
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

/* ---- Switch Homme / Femme --------------------------------- */
document.querySelectorAll(".gender-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const g = btn.dataset.gender;
    document.querySelectorAll(".gender-btn").forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.querySelectorAll(".products[data-gender]").forEach((p) => {
      p.hidden = p.dataset.gender !== g;
    });
  });
});

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

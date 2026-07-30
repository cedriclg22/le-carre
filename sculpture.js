/* ============================================================
   LE CARRÉ — page La Sculpture
   Les 3 pièces sont listées l'une sous l'autre ; chacune a son
   propre carrousel (Carbone -> Argent -> Or) navigué aux flèches,
   avec prix et ajout au panier pour la version affichée.
   ============================================================ */
(function () {
  const PRICES = { carbone: 890, platine: 1490, or: 2890 };
  const GAMME_LABEL = { carbone: "Carbone", platine: "Platine", or: "Or" };
  const ORDER = ["carbone", "platine", "or"];

  const SCULPTURES = [
    {
      key: "eclate",
      name: "L'Éclaté",
      images: {
        carbone: "images/sculpture-eclate-carbone.jpg",
        platine: "images/sculpture-eclate-platine.jpg",
        or:      "images/sculpture-eclate-or.jpg",
      },
    },
    {
      key: "compacte",
      name: "Le Compacté",
      images: {
        carbone: "images/sculpture-compacte-carbone.jpg",
        platine: "images/sculpture-compacte-platine.jpg",
        or:      "images/sculpture-compacte-or.jpg",
      },
    },
    {
      key: "colonne",
      name: "La colonne",
      images: {
        carbone: "images/sculpture-colonne-carbone.jpg",
        platine: "images/sculpture-colonne-platine.jpg",
        or:      "images/sculpture-colonne-or.jpg",
      },
    },
  ];

  const list = document.getElementById("sculptureList");

  SCULPTURES.forEach((s) => {
    const section = document.createElement("section");
    section.className = "sculpture-piece";
    // [clone(dernier), carbone, platine, or, clone(premier)] -> la flèche droite
    // avance TOUJOURS vers la droite, y compris au passage Or -> Carbone.
    const seq = [ORDER[ORDER.length - 1]].concat(ORDER, [ORDER[0]]);
    section.innerHTML = `
      <h2 class="sculpture-piece-title">${s.name}</h2>
      <div class="sc-carousel">
        <button class="sc-arrow prev" aria-label="Version précédente">&lt;</button>
        <div class="sc-viewport"><div class="sc-track">
          ${seq.map((g) => `<div class="sc-slide"><img src="${s.images[g]}" alt="${s.name} — version ${GAMME_LABEL[g]}" loading="lazy" /></div>`).join("")}
        </div></div>
        <button class="sc-arrow next" aria-label="Version suivante">&gt;</button>
      </div>
      <span class="sc-caption"></span>
      <p class="sc-price"></p>
      <button class="sc-add">Ajouter au panier</button>`;
    list.appendChild(section);

    const track = section.querySelector(".sc-track");
    const captionEl = section.querySelector(".sc-caption");
    const priceEl = section.querySelector(".sc-price");
    const addBtn = section.querySelector(".sc-add");

    const n = ORDER.length;
    let phys = 1; // 1 = carbone (1re vraie vue)
    let animating = false;

    function logicalIndex() { return (((phys - 1) % n) + n) % n; }

    function updateInfo() {
      const g = ORDER[logicalIndex()];
      captionEl.textContent = GAMME_LABEL[g];
      captionEl.className = "sc-caption " + g;
      priceEl.textContent = PRICES[g] + "€";
      addBtn.dataset.gamme = g;
    }

    function place(p, animate) {
      phys = p;
      if (!animate) track.style.transition = "none";
      track.style.transform = `translateX(-${phys * 100}%)`;
      if (!animate) {
        track.getBoundingClientRect(); // force le reflow
        track.style.transition = "";
      }
      updateInfo();
    }

    // Le déverrouillage se fait par minuteur (et non via l'évènement
    // "transitionend", qui ne se déclenche pas de façon fiable partout,
    // notamment quand les animations sont réduites) : robuste dans tous les cas.
    function step(dir) {
      if (animating) return;
      animating = true;
      const target = phys + dir;
      place(target, true);
      setTimeout(() => {
        if (target === n + 1) place(1, false);      // au-delà d'Or -> revient sur Carbone (même sens)
        else if (target === 0) place(n, false);     // avant Carbone -> revient sur Or
        animating = false;
      }, 520);
    }

    section.querySelector(".sc-arrow.prev").addEventListener("click", () => step(-1));
    section.querySelector(".sc-arrow.next").addEventListener("click", () => step(1));

    place(1, false);

    addBtn.addEventListener("click", () => {
      const g = addBtn.dataset.gamme;
      window.Cart.add({
        id: "sculpture-" + s.key + "-" + g,
        product: "sculpture-" + s.key,
        productName: "La Sculpture · " + s.name,
        gamme: GAMME_LABEL[g],
        size: "",
        price: PRICES[g],
        img: s.images[g],
      });
      window.Cart.open();
      const toast = document.getElementById("cartToast");
      if (toast) {
        toast.textContent = `${s.name} (${GAMME_LABEL[g]}) ajouté au panier`;
        toast.classList.add("is-visible");
        setTimeout(() => toast.classList.remove("is-visible"), 2600);
      }
    });
  });

  /* précharge toutes les photos */
  SCULPTURES.forEach((s) =>
    Object.values(s.images).forEach((src) => { const im = new Image(); im.src = src; })
  );
})();

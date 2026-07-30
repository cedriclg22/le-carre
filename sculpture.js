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
    section.innerHTML = `
      <h2 class="sculpture-piece-title">${s.name}</h2>
      <div class="sc-carousel">
        <button class="sc-arrow prev" aria-label="Version précédente">&lt;</button>
        <div class="sc-viewport"><div class="sc-track">
          ${ORDER.map((g) => `<div class="sc-slide"><img src="${s.images[g]}" alt="${s.name} — version ${GAMME_LABEL[g]}" loading="lazy" /></div>`).join("")}
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

    let i = 0; // index dans ORDER
    let animating = false;

    function render() {
      const g = ORDER[i];
      track.style.transform = `translateX(-${i * 100}%)`;
      captionEl.textContent = GAMME_LABEL[g];
      captionEl.className = "sc-caption " + g;
      priceEl.textContent = PRICES[g] + "€";
      addBtn.dataset.gamme = g;
    }

    function step(dir) {
      if (animating) return;
      animating = true;
      i = (i + dir + ORDER.length) % ORDER.length;
      render();
      setTimeout(() => { animating = false; }, 500);
    }

    section.querySelector(".sc-arrow.prev").addEventListener("click", () => step(-1));
    section.querySelector(".sc-arrow.next").addEventListener("click", () => step(1));

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

    render();
  });

  /* précharge toutes les photos */
  SCULPTURES.forEach((s) =>
    Object.values(s.images).forEach((src) => { const im = new Image(); im.src = src; })
  );
})();

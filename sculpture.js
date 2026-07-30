/* ============================================================
   LE CARRÉ — page La Sculpture
   Liste les 3 pièces, chacune en 3 gammes (Carbone / Platine / Or)
   affichées côte à côte, avec prix et ajout au panier.
   ============================================================ */
(function () {
  const PRICES = { carbone: 890, platine: 1490, or: 2890 };
  const GAMME_LABEL = { carbone: "Carbone", platine: "Platine", or: "Or" };

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

  function pieceHTML(s, gamme, extraClass) {
    return `
      <div class="sc-piece ${extraClass}">
        <figure>
          <div class="sc-media"><img src="${s.images[gamme]}" alt="${s.name} — version ${GAMME_LABEL[gamme]}" loading="lazy" /></div>
        </figure>
        <span class="sc-caption ${gamme}">${GAMME_LABEL[gamme]}</span>
        <p class="sc-price">${PRICES[gamme]}€</p>
        <button class="sc-add" data-sculpture="${s.key}" data-gamme="${gamme}">Ajouter au panier</button>
      </div>`;
  }

  SCULPTURES.forEach((s) => {
    const section = document.createElement("section");
    section.className = "sculpture-piece";
    section.innerHTML = `
      <h2 class="sculpture-piece-title">${s.name}</h2>
      <div class="sculpture-gallery">
        ${pieceHTML(s, "carbone", "")}
        ${pieceHTML(s, "platine", "sc-center")}
        ${pieceHTML(s, "or", "")}
      </div>`;
    list.appendChild(section);
  });

  list.querySelectorAll(".sc-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sculptureKey = btn.dataset.sculpture;
      const gamme = btn.dataset.gamme;
      const s = SCULPTURES.find((x) => x.key === sculptureKey);
      window.Cart.add({
        id: "sculpture-" + sculptureKey + "-" + gamme,
        product: "sculpture-" + sculptureKey,
        productName: "La Sculpture · " + s.name,
        gamme: GAMME_LABEL[gamme],
        size: "",
        price: PRICES[gamme],
        img: s.images[gamme],
      });
      window.Cart.open();
      const toast = document.getElementById("cartToast");
      if (toast) {
        toast.textContent = `${s.name} (${GAMME_LABEL[gamme]}) ajouté au panier`;
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

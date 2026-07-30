/* ============================================================
   LE CARRÉ — page La Sculpture
   Une sculpture à la fois (flèches ‹ › pour changer de pièce) ;
   3 photos Carbone/Platine/Or côte à côte ; on clique une photo
   pour la sélectionner, prix + achat partagés pour la sélection.
   ============================================================ */
(function () {
  const PRICES = { carbone: 890, platine: 1490, or: 2890 };

  const SCULPTURES = [
    {
      name: "L'Éclaté",
      images: {
        carbone: "images/sculpture-eclate-carbone.jpg",
        platine: "images/sculpture-eclate-platine.jpg",
        or:      "images/sculpture-eclate-or.jpg",
      },
    },
    {
      name: "Le Compacté",
      images: {
        carbone: "images/sculpture-compacte-carbone.jpg",
        platine: "images/sculpture-compacte-platine.jpg",
        or:      "images/sculpture-compacte-or.jpg",
      },
    },
    {
      name: "La colonne",
      images: {
        carbone: "images/sculpture-colonne-carbone.jpg",
        platine: "images/sculpture-colonne-platine.jpg",
        or:      "images/sculpture-colonne-or.jpg",
      },
    },
  ];

  let index = 2;          // démarre sur « La colonne »
  let gamme = "platine";  // version sélectionnée par défaut

  const titleEl = document.getElementById("sculptureTitle");
  const imgCarbone = document.getElementById("scImgCarbone");
  const imgPlatine = document.getElementById("scImgPlatine");
  const imgOr = document.getElementById("scImgOr");
  const medias = document.querySelectorAll(".sc-media");
  const pieces = document.querySelectorAll(".sc-piece");
  const priceEl = document.getElementById("scPrice");
  const addBtn = document.getElementById("scAdd");

  function updatePurchase() {
    priceEl.textContent = PRICES[gamme] + "€";
    pieces.forEach((p) => p.classList.toggle("is-selected", p.dataset.gamme === gamme));
  }

  function setImages() {
    const s = SCULPTURES[index];
    titleEl.textContent = s.name;
    imgCarbone.src = s.images.carbone;
    imgCarbone.alt = s.name + " — version Carbone";
    imgPlatine.src = s.images.platine;
    imgPlatine.alt = s.name + " — version Platine";
    imgOr.src = s.images.or;
    imgOr.alt = s.name + " — version Or";
  }

  function render(animate) {
    if (!animate) {
      setImages();
      updatePurchase();
      return;
    }
    titleEl.classList.add("is-fading");
    medias.forEach((m) => m.classList.add("is-fading"));
    setTimeout(() => {
      setImages();
      updatePurchase();
      titleEl.classList.remove("is-fading");
      medias.forEach((m) => m.classList.remove("is-fading"));
    }, 220);
  }

  function go(dir) {
    index = (index + dir + SCULPTURES.length) % SCULPTURES.length;
    render(true);
  }

  document.getElementById("scPrev").addEventListener("click", () => go(-1));
  document.getElementById("scNext").addEventListener("click", () => go(1));

  pieces.forEach((p) => {
    p.addEventListener("click", () => {
      gamme = p.dataset.gamme;
      updatePurchase();
    });
    p.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        gamme = p.dataset.gamme;
        updatePurchase();
      }
    });
  });

  addBtn.addEventListener("click", () => {
    const s = SCULPTURES[index];
    window.Cart.add({
      id: "sculpture-" + index + "-" + gamme,
      product: "sculpture",
      productName: "La Sculpture · " + s.name,
      gamme: gamme.charAt(0).toUpperCase() + gamme.slice(1),
      size: "",
      price: PRICES[gamme],
      img: s.images[gamme],
    });
    window.Cart.open();
    const toast = document.getElementById("cartToast");
    if (toast) {
      toast.textContent = `${s.name} (${gamme}) ajouté au panier`;
      toast.classList.add("is-visible");
      setTimeout(() => toast.classList.remove("is-visible"), 2600);
    }
  });

  /* précharge toutes les photos */
  SCULPTURES.forEach((s) =>
    Object.values(s.images).forEach((src) => { const im = new Image(); im.src = src; })
  );

  render(false);
})();

/* ============================================================
   LE CARRÉ — page La Sculpture
   Navigue entre les sculptures ; chaque sculpture montre ses
   3 versions (Carbone / Platine / Or) côte à côte.
   ============================================================ */
(function () {
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

  let index = 2; // démarre sur « La colonne »

  const titleEl = document.getElementById("sculptureTitle");
  const imgCarbone = document.getElementById("scImgCarbone");
  const imgPlatine = document.getElementById("scImgPlatine");
  const imgOr = document.getElementById("scImgOr");
  const medias = document.querySelectorAll(".sc-media");

  function render(animate) {
    const s = SCULPTURES[index];
    if (!animate) {
      titleEl.textContent = s.name;
      imgCarbone.src = s.images.carbone;
      imgCarbone.alt = s.name + " — version Carbone";
      imgPlatine.src = s.images.platine;
      imgPlatine.alt = s.name + " — version Platine";
      imgOr.src = s.images.or;
      imgOr.alt = s.name + " — version Or";
      return;
    }
    titleEl.classList.add("is-fading");
    medias.forEach((m) => m.classList.add("is-fading"));
    setTimeout(() => {
      titleEl.textContent = s.name;
      imgCarbone.src = s.images.carbone;
      imgCarbone.alt = s.name + " — version Carbone";
      imgPlatine.src = s.images.platine;
      imgPlatine.alt = s.name + " — version Platine";
      imgOr.src = s.images.or;
      imgOr.alt = s.name + " — version Or";
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

  /* précharge toutes les photos */
  SCULPTURES.forEach((s) =>
    Object.values(s.images).forEach((src) => { const im = new Image(); im.src = src; })
  );

  render(false);
})();

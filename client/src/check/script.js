const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const classColor = card.getAttribute("data-class");
    window.location.href = `class/?class=${classColor}`;
  });
});

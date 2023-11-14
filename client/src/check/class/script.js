const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("checked-in")) {
      card.classList.remove("checked-in");
      card.classList.add("checked-out");
    } else {
      card.classList.add("checked-in");
      card.classList.remove("checked-out");
    }
  });
});

const backBtn = document.querySelector(".back-btn");

backBtn.addEventListener("click", () => {
  window.location.href = "../";
});

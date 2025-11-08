// Menu hamburguer - abre/fecha
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu-items");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("show");
  });
});

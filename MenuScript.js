// Pequeño dinamismo para el menú
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".menu-btn");

  buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      btn.style.textShadow = "0 0 10px #39ff14, 0 0 20px #0ff";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.textShadow = "none";
    });
  });
});

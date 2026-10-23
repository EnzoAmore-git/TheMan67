export function initGallery() {
  const dialog = document.querySelector("#lightbox");
  if (!dialog?.showModal) return;
  const links = [...document.querySelectorAll(".work-link")],
    image = dialog.querySelector(".lightbox-image");
  const count = dialog.querySelector("[data-counter]"),
    caption = dialog.querySelector(".lightbox-caption"),
    error = dialog.querySelector(".lightbox-error");
  let index = 0,
    opener = null,
    start = null;
  function show(next) {
    index = (next + links.length) % links.length;
    const link = links[index];
    image.src = link.href;
    image.alt = link.querySelector("img").alt;
    caption.textContent = image.alt;
    count.textContent = index + 1 + " / " + links.length;
    error.textContent = "";
  }
  image.addEventListener("error", () => {
    error.textContent = "Фото не загрузилось. Попробуйте открыть его отдельно.";
  });
  links.forEach((link, i) =>
    link.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      opener = link;
      show(i);
      dialog.showModal();
      document.body.classList.add("locked");
    }),
  );
  dialog
    .querySelector("[data-close]")
    .addEventListener("click", () => dialog.close());
  dialog
    .querySelector("[data-prev]")
    .addEventListener("click", () => show(index - 1));
  dialog
    .querySelector("[data-next]")
    .addEventListener("click", () => show(index + 1));
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("locked");
    opener?.focus();
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      show(index - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      show(index + 1);
    }
  });
  image.addEventListener(
    "touchstart",
    (e) => {
      start = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    },
    { passive: true },
  );
  image.addEventListener(
    "touchend",
    (e) => {
      if (!start) return;
      const dx = e.changedTouches[0].clientX - start.x,
        dy = e.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy))
        show(index + (dx < 0 ? 1 : -1));
      start = null;
    },
    { passive: true },
  );
}

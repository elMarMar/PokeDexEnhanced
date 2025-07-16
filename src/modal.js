export function showModal(content, options = {}) {
  // TODO: Learn this syntax better
  const { blur = true, closable = true } = options;

  const modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal-wrapper");

  if (blur) modalWrapper.classList.add("blurred-backdrop");

  if (typeof content === "object") modalWrapper.appendChild(content);
  else modalWrapper.innerHTML = content;

  if (closable) {
    modalWrapper.addEventListener("click", (e) => {
      if (e.target == modalWrapper) closeModal(modalWrapper);
    });

    const exitBtn = content.querySelector(".js-exit-btn");
    if (exitBtn)
      exitBtn.addEventListener("click", () => {
        closeModal(modalWrapper);
      });
  }

  document.body.appendChild(modalWrapper);
  return modalWrapper;
}

export function closeModal(modalWrapper) {
  const modal = modalWrapper || document.querySelector(".modal-wrapper");
  if (!modal) return;

  // revoke image previews to prevent memory leaks
  modal.querySelectorAll("img").forEach((img) => {
    const src = img.src;
    if (src.startsWith("blob:")) {
      URL.revokeObjectURL(src);
    }
  });

  modal.remove();
}

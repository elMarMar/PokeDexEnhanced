export function showModal(content, shouldBlurBackdrop) {
  const modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal-wrapper");

  modalWrapper.addEventListener("click", (e) => {
    if (e.target == modalWrapper) closeModal(modalWrapper);
  });

  if (shouldBlurBackdrop) modalWrapper.classList.add("blurred-backdrop");

  if (typeof content === "string") modalWrapper.innerHTML = `${content}`;
  else modalWrapper.appendChild(content);

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

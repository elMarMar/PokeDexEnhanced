import { state, updateFavorites } from "../state.js";
import { cloneTemplate, formatId } from "../util.js";
import { showModal } from "../modal.js";
import { buildCard } from "./card.js";

export function initFavoritesUI() {
  const favoritesBtn = document.getElementById("favorites-btn");
  favoritesBtn.addEventListener("click", () => {
    showPokemonFavoritesModal();
  });
}

export function showPokemonFavoritesModal() {
  const content = cloneTemplate("pokemon-favorites-modal-template");
  const container = content.querySelector(".modal-favorites-container");

  if (state.favorites.length <= 0) {
    showEmptyFavoritesMessage(container);
  }

  state.favorites.forEach((fav) => {
    container.appendChild(createCard(fav));
  });

  const refreshBtn = content.querySelector(".js-favorites-refresh-btn");

  refreshBtn.addEventListener("click", () => {
    refreshFavoriteCards(container);
  });

  showModal(content, true);
}

function createCard(favorite) {
  const modalCard = cloneTemplate("pokemon-card-template");

  modalCard.querySelector(".pokemon-name").textContent = favorite.name;
  modalCard.querySelector(".pokemon-id").textContent = formatId(favorite.id);
  modalCard.querySelector(".pokemon-species").textContent = favorite.species;
  modalCard.querySelector(".pokemon-type1").textContent = favorite.type1;
  modalCard.querySelector(".pokemon-type2").textContent =
    favorite.type2 ?? "N/A";
  modalCard.querySelector(".pokemon-pixel-sprite").src =
    favorite.pixelSpriteOverride
      ? URL.createObjectURL(favorite.pixelSpriteOverride)
      : favorite.pixelSprite;
  modalCard.querySelector(".pokemon-pixel-sprite").alt = favorite.name;

  modalCard.dataset.id = favorite.id;
  modalCard.addEventListener("click", () => {
    buildCard(favorite);
  });

  return modalCard;
}

function showEmptyFavoritesMessage(container) {
  const message = document.createElement("div");
  message.textContent = "No Pokemon has been favorited!";
  message.classList.add("empty-favorites-message");
  container.appendChild(message);
}

function refreshFavoriteCards(container) {
  container.querySelectorAll("img").forEach((img) => {
    const src = img.src;
    if (src.startsWith("blob:")) {
      URL.revokeObjectURL(src);
    }
  });

  container.innerHTML = "";
  updateFavorites();
  state.favorites.forEach((fav) => {
    container.appendChild(createCard(fav));
  });
}

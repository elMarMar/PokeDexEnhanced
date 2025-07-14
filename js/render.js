import { formatId, refreshView } from "./util.js";
import { state } from "./state.js";

const grid = document.getElementById("pokemon-grid");
export function renderPokemonCards(pokemonData) {
  const template = document.getElementById("pokemon-card-template");

  grid.innerHTML = "";

  const start = (state.currentPage - 1) * state.pageSize;
  const page = pokemonData.slice(start, start + state.pageSize);

  page.forEach((pokemon) => {
    const card = template.content.cloneNode(true);
    card.querySelector(".card").dataset.id = pokemon.id;
    card.querySelector(".pokemon-pixel-sprite").src =
      pokemon.pixelSpriteOverride
        ? URL.createObjectURL(pokemon.pixelSpriteOverride)
        : pokemon.pixelSprite;
    card.querySelector(".pokemon-pixel-sprite").alt = pokemon.name;
    card.querySelector(".pokemon-name").textContent = pokemon.name;
    card.querySelector(".pokemon-id").textContent = formatId(pokemon.id);
    card.querySelector(".pokemon-species").textContent = pokemon.species;
    card.querySelector(".pokemon-type1").textContent = pokemon.type1;
    card.querySelector(".pokemon-type2").textContent = pokemon.type2 ?? "N/A";

    grid.appendChild(card);
  });

  renderPager();
}

function renderPager() {
  let wrapper = document.getElementById("pager");
  wrapper.innerHTML = "";

  const pages = Math.ceil(state.view.length / state.pageSize);

  if (state.currentPage > 1)
    wrapper.appendChild(makeBtn("« Prev", state.currentPage - 1));

  for (let p = 1; p <= pages; p++) {
    wrapper.appendChild(makeBtn(p, p));
  }

  if (state.currentPage < pages)
    wrapper.appendChild(makeBtn("Next »", state.currentPage + 1));
}

function makeBtn(txt, page) {
  const b = document.createElement("button");
  b.textContent = txt;
  b.disabled = page === state.currentPage;
  b.addEventListener("click", () => {
    state.currentPage = page;
    refreshView();
  });
  return b;
}

import { formatId } from "./util.js";

export function renderPokemonCards(pokemonData) {
  const container = document.getElementById("pokemon-grid");
  const template = document.getElementById("pokemon-card-template");

  container.innerHTML = "";

  pokemonData.forEach((pokemon) => {
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

    container.appendChild(card);
  });
}

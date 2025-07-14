import { formatId } from "./util.js";
import { buildCard } from "./ui/card.js";

const container = document.getElementById("hero-slideshow-container");
const template = document.getElementById("hero-pokemon-template");

let currentSlide = null;

function showRandomPokemonSlide(pokemonList) {
  if (currentSlide) currentSlide.remove();

  const pokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];

  const slide = template.content.cloneNode(true);
  // TODO: ALLOW CUSTOM IMAGE ON SLIDESHOW
  slide.querySelector(".hero-hire-img").src = pokemon.hireImg;
  slide.querySelector(".hero-hire-img").alt = pokemon.hireImg;
  slide.querySelector(".hero-name").textContent = pokemon.name;
  slide.querySelector(".hero-id").textContent = formatId(pokemon.id);
  slide.querySelector(".hero-species").textContent = pokemon.species;
  slide.querySelector(".hero-type1").textContent = pokemon.type1;
  slide.querySelector(".hero-type2").textContent = pokemon.type2 ?? "N/A";
  slide.querySelector(".hero-description").textContent = pokemon.description;

  const slideElement = document.createElement("div");
  slideElement.classList.add("hero-slide");
  slideElement.addEventListener("click", () => {
    buildCard(pokemon);
  });

  slideElement.appendChild(slide);
  container.appendChild(slideElement);
  currentSlide = slideElement;
}

export function startHeroSlideshow(pokemonList) {
  showRandomPokemonSlide(pokemonList); // initial slide

  setInterval(() => {
    showRandomPokemonSlide(pokemonList);
  }, 10000);
}

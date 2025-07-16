import { getNumberOutOfString } from "./util.js";

export class Pokemon {
  constructor(
    name,
    id,
    species,
    type1,
    type2,
    pixelSprite,
    hireImg,
    description,
    height,
    weight,
    hp,
    attack,
    defense,
    speed,
    // custom user input
    favorite,
    pixelSpriteOverride,
    hireImgOverride
  ) {
    this.name = name;
    this.id = getNumberOutOfString(id);
    this.species = species;
    this.type1 = String(type1).toLowerCase();
    this.type2 = type2 ? String(type2).toLowerCase() : null;

    // existing
    this.pixelSprite = pixelSprite;
    this.hireImg = hireImg;

    // new files
    this.pixelSpriteOverride = pixelSpriteOverride ?? null;
    this.hireImgOverride = hireImgOverride ?? null;

    this.description = description;
    this.height = getNumberOutOfString(height);
    this.weight = getNumberOutOfString(weight);
    this.hp = getNumberOutOfString(hp);
    this.attack = getNumberOutOfString(attack);
    this.defense = getNumberOutOfString(defense);
    this.speed = getNumberOutOfString(speed);

    this.favorite = favorite ?? false;
  }

  toggleFavorite() {
    if (this.favorite) this.favorite = false;
    else this.favorite = true;
  }

  static createEmptyPokemon() {
    return new Pokemon("", 0, "", "", null, "", "", "", 0, 0, 0, 0, 0, 0);
  }

  clone() {
    return new Pokemon(
      this.name,
      this.id,
      this.species,
      this.type1,
      this.type2,
      this.pixelSprite,
      this.hireImg,
      this.description,
      this.height,
      this.weight,
      this.hp,
      this.attack,
      this.defense,
      this.speed
    );
  }

  static types = [
    "normal",
    "fire",
    "water",
    "grass",
    "electric",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dark",
    "dragon",
    "steel",
    "fairy",
  ];
}

export const initialPokemonData = {
  arr: [],
};

export async function initData(paths) {
  let data = null;

  try {
    data = await tryLoadData(paths);
  } catch (error) {
    throw error;
  }
  storePokemonData(data);
  return initialPokemonData.arr;
}

async function tryLoadData(paths) {
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

    try {
      const response = await fetch(path);
      if (!response.ok)
        throw new Error(`Response Status: ${response.status} at ${path}`);

      const data = await response.json();
      console.log(`Loaded Pokedex from: ${path}`);
      return data;
    } catch (error) {
      console.warn(`Failed to load from ${path}:`, error.message);
    }
  }

  throw new Error("All pokedex.json paths failed.");
}

function storePokemonData(data) {
  for (let i = 0; i < data.length; i++) {
    let temp = data[i];
    initialPokemonData.arr[i] = new Pokemon(
      temp.name.english,
      temp.id,
      temp.species,
      temp.type[0],
      temp.type[1],
      temp.image.sprite,
      temp.image.hires,
      temp.description,
      temp.profile.height,
      temp.profile.weight,
      temp.base.HP,
      temp.base.Attack,
      temp.base.Defense,
      temp.base.Speed
    );
  }
}

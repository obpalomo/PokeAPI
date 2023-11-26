const url = "https://pokeapi.co/api/v2/pokemon/?limit=150";
const myMain$$ = document.querySelector("main");
let allPokemonList = [];

const catchPokemon = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
  }
};

const fetchPokemonDetails = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const addPokemonList = async (typeFilter = "all", searchTerm = "") => {
  const container = document.querySelector(".pokemon-list");
  container.innerHTML = "";

  try {
    if (!allPokemonList.length) {
      allPokemonList = await catchPokemon();
    }

    const filteredAndUniquePokemonList = await Promise.all(
      allPokemonList.map(async (pokemon) => {
        const pokemonDetails = await fetchPokemonDetails(pokemon.url);
        return { pokemon, details: pokemonDetails };
      })
    );

    const filteredList = filteredAndUniquePokemonList.filter(
      ({ pokemon, details }) => {
        const matchesType =
          typeFilter === "all" ||
          details.types.some(
            (t) => t.type.name.toLowerCase() === typeFilter
          );

        const matchesSearch =
          searchTerm === "" ||
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesType && matchesSearch;
      }
    );

    filteredList.forEach(({ pokemon, details }) => {
      const pokemonElement = createPokemonElement(pokemon, details);
      container.appendChild(pokemonElement);
    });
  } catch (error) {
    console.error(error);
  }
};

const filterAndUniquePokemonList = (pokemonList, typeFilter, searchTerm) => {
  const uniqueList = [];
  const addedIds = new Set();

  for (const { pokemon, details } of pokemonList) {
    const matchesType =
      typeFilter === "all" ||
      details.types.some((t) => t.type.name.toLowerCase() === typeFilter);

    const matchesSearch =
      searchTerm === "" ||
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (matchesType && matchesSearch && !addedIds.has(details.id)) {
      uniqueList.push({ pokemon, details });
      addedIds.add(details.id);
    }
  }

  return uniqueList;
};



const createPokemonElement = (pokemon, details) => {
  const pokemonElement = document.createElement("div");
  pokemonElement.classList.add("pokemon-item");

  const pokemonImage = document.createElement("img");
  pokemonImage.classList.add("pokemon-image", "clickable");
  pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${details.id}.svg`;
  pokemonImage.alt = pokemon.name;

  const pokeballImage = document.createElement("img");
  pokeballImage.src = "./fotos/pokeball.png";
  pokeballImage.alt = "Pokeball";
  pokeballImage.classList.add("pokeball-image");

  const pokemonNameID = document.createElement("span");
  const pokemonName = document.createElement("h3");
  pokemonName.textContent =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  pokemonName.classList.add("pokemon-detail");
  const pokemonId = document.createElement("h3");
  pokemonId.classList.add("id");
  pokemonId.textContent = `No. #${details.id.toString().padStart(3, "0")}`;
  pokemonNameID.appendChild(pokemonId);
  pokemonNameID.appendChild(pokemonName);

  const pokemonTypes = document.createElement("p");
  pokemonTypes.classList.add("poke-type");

  details.types.forEach((type) => {
    const typeSpan = document.createElement("span");
    typeSpan.textContent = type.type.name.toUpperCase();
    typeSpan.style.backgroundColor = getTypeColor(type.type.name);
    typeSpan.style.color = "#fff";
    pokemonTypes.appendChild(typeSpan);
  });

  pokemonElement.appendChild(pokemonImage);
  pokemonElement.appendChild(pokemonNameID);
  pokemonElement.appendChild(pokemonTypes);
  pokemonElement.appendChild(pokeballImage);

  return pokemonElement;
};

const filterBySearch = (searchTerm) => {
  const container = document.querySelector(".pokemon-list");
  container.innerHTML = "";

  allPokemonList.forEach(async (pokemon) => {
    if (pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      const pokemonDetails = await fetchPokemonDetails(pokemon.url);
      const pokemonElement = createPokemonElement(pokemon, pokemonDetails);
      container.appendChild(pokemonElement);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const typeFilter = button.getAttribute("data-type");
      const searchTerm = document.querySelector("#miInput").value.trim();
      addPokemonList(typeFilter, searchTerm);
    });
  });

/*   const buscarButton = document.querySelector("#buscarButton");
  buscarButton.addEventListener("click", () => {
    const searchTerm = document.querySelector("#miInput").value.trim();
    addPokemonList("all", searchTerm);
  }); */

  const miInput = document.querySelector("#miInput");
  miInput.addEventListener("input", () => {
    const searchTerm = miInput.value.trim();
    addPokemonList("all", searchTerm);
  });

  addPokemonList(); // Asegúrate de que esta línea esté presente
});


document.addEventListener("DOMContentLoaded", function () {
  const menuButtons = document.querySelectorAll(".filter-button");

  menuButtons.forEach((button) => {
    const type = button.dataset.type;
    const color = getTypeColor(type);
    button.style.backgroundColor = color;
  });
});

const getTypeColor = (type) => {
  const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };

  return typeColors[type] || "#B0B0B0";
};

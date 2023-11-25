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

//NUEVO
const fetchPokemonAttacks = async (pokemonId) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    return data.moves.slice(0, 5); // Obtener los primeros 5 ataques (ajusta según sea necesario)
  } catch (error) {
    console.error("Error al obtener ataques:", error);
    return [];
  }
};
//NUEVO
//NUEVO
const showPokemonDetails = async (details) => {
  if (!details) {
    return; // Evitar que se ejecute si no hay detalles
  }

  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalDetails = document.getElementById("modalDetails");

  // Llenar los elementos con los detalles del Pokémon
  modalTitle.textContent = details.name.charAt(0).toUpperCase() + details.name.slice(1);
  modalImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${details.id}.svg`;
  modalImage.alt = details.name;

  // Obtener los ataques del Pokémon
  const attacks = await fetchPokemonAttacks(details.id);
  const attacksList = attacks.map((attack) => attack.move.name);

  // Mostrar detalles adicionales
  modalDetails.innerHTML = `
    Altura: ${details.height} | Peso: ${details.weight} <br>
    <strong>Ataques:</strong> ${attacksList.join(", ")}
  `;

  // Mostrar el modal
  const modal = document.getElementById("pokemonModal");
  modal.style.display = "block";
};
//NUEVO

//NUEVO
const closeModal = () => {
  const modal = document.getElementById("pokemonModal");
  modal.style.display = "none";
};
//NUEVO

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
          details.types.some((t) => t.type.name.toLowerCase() === typeFilter);

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
  pokemonElement.classList.add("backInLeft");
  //NUEVO
  pokemonElement.dataset.details = JSON.stringify(details);
  //NUEVO

  const pokemonImage = document.createElement("img");
  //NUEVO
  pokemonImage.addEventListener("click", () => {
    showPokemonDetails(details);
  });
  //NUEVO
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

  /*   //Nuevo
  // Agrega un manejador de eventos de clic al elemento del Pokémon
  pokemonElement.addEventListener("click", () => {
    // Llama a la función para mostrar detalles
    showPokemonDetails(details);
  });
  //Nuevo */

  pokemonElement.addEventListener("click", () => {
    showPokemonDetails(details);
  });

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

  const miInput = document.querySelector("#miInput");
  miInput.addEventListener("input", () => {
    const searchTerm = miInput.value.trim();
    addPokemonList("all", searchTerm);
  });

  addPokemonList();

  // NUEVO
  const pokemonListContainer = document.querySelector(".pokemon-list");
  pokemonListContainer.addEventListener("click", (event) => {
    const clickedPokemon = event.target.closest(".pokemon-item");
    if (clickedPokemon) {
      const pokemonDetails = JSON.parse(clickedPokemon.dataset.details);
      showPokemonDetails(pokemonDetails);
      //NUEVO
    }
  });
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



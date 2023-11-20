const url = `https://pokeapi.co/api/v2/pokemon/?limit=150`;

const myMain$$ = document.querySelector("main");

const catchPokemon = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    /* console.log(data); */
    return data;
  } catch (error) {
    console.error(error);
  }
};

const fetchPokemonDetails = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    /* console.log(data); */
    return data;
  } catch (error) {
    console.error(error);
  }
};

const filterButtons = document.querySelectorAll(".filter-button");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const typeFilter = button.getAttribute("data-type");
    addPokemonList(typeFilter);
  });
});

const addPokemonList = async (typeFilter = "all") => {
  const container = document.querySelector(".pokemon-list");

  container.innerHTML = "";

  try {
    const data = await catchPokemon();
    const pokemonList = data.results;
    /* console.log(pokemonList); */

    for (let i = 0; i < pokemonList.length; i++) {
      const pokemonDetails = await fetchPokemonDetails(pokemonList[i].url);
      const abilities = pokemonDetails.abilities.map(
        (ability) => ability.ability.name
      );
      /* console.log(pokemonDetails); */

      // Crear un elemento para cada Pokémon
      const pokemonElement = document.createElement("div");
      pokemonElement.classList.add("pokemon-item");

      // Imagen
      const pokemonImage = document.createElement("img");
      pokemonImage.classList.add("pokemon-image");
      pokemonImage.classList.add("clickable");
      pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
        i + 1
      }.svg`;
      pokemonImage.alt = pokemonList[i].name;

      // Name
      const pokemonNameID = document.createElement("span");
      const pokemonName = document.createElement("h3");
      pokemonName.textContent =
        pokemonList[i].name.charAt(0).toUpperCase() +
        pokemonList[i].name.slice(1);
      pokemonName.classList.add("pokemon-detail");
      const pokemonId = document.createElement("h3");
      pokemonId.classList.add("id");
      pokemonId.textContent = `No. #${pokemonDetails.id
        .toString()
        .padStart(3, "0")}`;
      pokemonNameID.appendChild(pokemonId);
      pokemonNameID.appendChild(pokemonName);

      // Abilities
      const abilitiesList = document.createElement("ul");
      abilities.forEach((ability) => {
        const abilityItem = document.createElement("li");
        abilityItem.textContent =
          ability.charAt(0).toUpperCase() + ability.slice(1);
        abilitiesList.appendChild(abilityItem);
        /* console.log(abilitiesList); */
      });

      //Types

      const pokemonTypes = document.createElement("p");
      pokemonTypes.classList.add("poke-type");

      pokemonDetails.types.forEach((type) => {
        const typeSpan = document.createElement("span");
        typeSpan.textContent = type.type.name.toUpperCase();
        typeSpan.style.backgroundColor = getTypeColor(type.type.name);
        typeSpan.style.color = "#fff";
        pokemonTypes.appendChild(typeSpan);
      });

      /* console.log(pokemonTypes) */

      // Añdir elementos
      /* pokemonElement.appendChild(pokemonId); */
      pokemonElement.appendChild(pokemonImage);
      pokemonElement.appendChild(pokemonNameID);
      pokemonElement.appendChild(pokemonTypes);
      /* pokemonElement.appendChild(abilitiesList); */

      /* container.appendChild(pokemonElement); */
      if (
        typeFilter === "all" ||
        pokemonDetails.types.some(
          (t) => t.type.name.toLowerCase() === typeFilter
        )
      ) {
        container.appendChild(pokemonElement);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const typeFilter = button.getAttribute("data-type");
      addPokemonList(typeFilter);
    });
  });

  addPokemonList();
});

document.addEventListener("DOMContentLoaded", function () {
  const menuButtons = document.querySelectorAll(".filter-button");

  menuButtons.forEach((button) => {
    const type = button.dataset.type;
    const color = getTypeColor(type);
    button.style.backgroundColor = color;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const pokemonImage = document.getElementById("pokemonImage");

  pokemonImage.addEventListener("click", function () {
    pokemonImage.classList.add("animate");

    setTimeout(function () {
      pokemonImage.classList.remove("animate");
    }, 300);
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

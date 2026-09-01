const pokemon = [
  { name: "Pikachu", type: "Eléctrico · Nivel 25", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
  { name: "Charmander", type: "Fuego · Nivel 12", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
  { name: "Squirtle", type: "Agua · Nivel 16", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
  { name: "Bulbasaur", type: "Planta · Nivel 8", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" }
];

const button = document.querySelector("#randomButton");
const name = document.querySelector("#pokemonName");
const info = document.querySelector("#pokemonInfo");
const image = document.querySelector("#pokemonImage");

button.addEventListener("click", () => {
  const found = pokemon[Math.floor(Math.random() * pokemon.length)];
  name.textContent = found.name;
  info.textContent = `${found.type}. Apareció dando una vuelta por Vinewood.`;
  image.src = found.image;
  image.alt = found.name;
});

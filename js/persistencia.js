import { pokemonesDefecto } from "./db/pokemones.js";
import { usuariosDefecto } from "./db/usuarios.js";

export function leerPokemones() {
  const datos = localStorage.getItem("pokeapp.pokemones");
  return datos === null ? pokemonesDefecto.slice() : JSON.parse(datos);
}

export function leerUsuarios() {
  const datos = localStorage.getItem("pokeapp.usuarios");
  return datos === null ? usuariosDefecto.slice() : JSON.parse(datos);
}

export function guardarPokemones(pokemon) {
  const pokemones = leerPokemones();
  pokemones.push(pokemon);
  localStorage.setItem("pokeapp.pokemones", JSON.stringify(pokemones));
}

export function guardarUsuarios(usuario) {
  const usuarios = leerUsuarios();
  usuarios.push(usuario);
  localStorage.setItem("pokeapp.usuarios", JSON.stringify(usuarios));
}

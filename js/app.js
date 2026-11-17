import { leerPokemones, guardarPokemones, leerUsuarios, guardarUsuarios } from "./persistencia.js";
import { escenas } from "./db/game.js";

const app = document.querySelector("#app");
let usuarioActual = null;

function escapar(valor) {
  return String(valor).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function rutaMultimedia(valor) {
  try {
    const url = new URL(valor, document.baseURI);
    return valor.trim() && ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function numero(id) {
  return "#" + String(id).padStart(3, "0");
}

function tipos(pokemon) {
  return pokemon.tipo.map(tipo => `<span class="tipo">${escapar(tipo)}</span>`).join("");
}

function foto(pokemon, ruta = pokemon.imagen) {
  return `<img src="${escapar(rutaMultimedia(ruta))}" alt="${escapar(pokemon.nombre)}">`;
}

function mostrarInicio() {
  app.innerHTML = `
    <section class="inicio">
      <div>
        <h1>Tu Pokédex</h1>
        <p>Conocé los Pokémon de Kanto, explorá sus fichas y poné a prueba tus decisiones en batalla.</p>
        <button id="explorar">Explorar Pokédex</button>
      </div>
      <img src="./assets/img/pikachu.png" alt="Pikachu">
    </section>`;
  app.querySelector("#explorar").addEventListener("click", mostrarPokedex);
}

function mostrarPokedex() {
  app.innerHTML = `
    <section>
      <div class="titulo"><h1>Pokédex</h1>
        <label>Buscar por nombre <input id="busqueda" type="search" placeholder="Ej. Pikachu"></label>
      </div>
      <div id="galeria" class="galeria"></div>
    </section>`;
  const busqueda = app.querySelector("#busqueda");
  const galeria = app.querySelector("#galeria");

  function cargarTarjetas() {
    const nombreBuscado = busqueda.value.trim().toLowerCase();
    let tarjetas = "";
    for (const pokemon of leerPokemones()) {
      if (pokemon.nombre.toLowerCase().includes(nombreBuscado)) {
        tarjetas += `<article class="tarjeta">
          <div class="imagen">${foto(pokemon)}</div>
          <div class="ficha">
            <span class="numero">${numero(pokemon.id)}</span>
            <h2>${escapar(pokemon.nombre)}</h2>
            <div class="tipos">${tipos(pokemon)}</div>
            <p>${escapar(pokemon.rareza)}</p>
            <button type="button" data-id="${pokemon.id}">Ver detalle</button>
          </div>
        </article>`;
      }
    }
    galeria.innerHTML = tarjetas || "<p>No se encontraron Pokémon.</p>";
    for (const boton of galeria.querySelectorAll("[data-id]")) {
      boton.addEventListener("click", () => mostrarDetalle(Number(boton.dataset.id)));
    }
  }

  busqueda.addEventListener("input", cargarTarjetas);
  cargarTarjetas();
}

function mostrarDetalle(id) {
  const pokemon = leerPokemones().find(elemento => elemento.id === id);
  if (!pokemon) {
    mostrarPokedex();
    return;
  }
  const evolucion = pokemon.tieneEvolucion ? pokemon.evolucion : "Sin evolución";
  const datos = [
    ["Altura", pokemon.altura + " m"], ["Peso", pokemon.peso + " kg"],
    ["Generación", pokemon.generacion], ["HP", pokemon.hp], ["Ataque", pokemon.ataque],
    ["Defensa", pokemon.defensa], ["Velocidad", pokemon.velocidad], ["Habilidad", pokemon.habilidad],
    ["Evolución", evolucion], ["Nivel de evolución", pokemon.nivelEvolucion ?? "—"],
    ["Rareza", pokemon.rareza], ["Variante shiny", pokemon.shiny ? "Disponible" : "No disponible"],
  ];
  app.innerHTML = `
    <button id="volver" class="secundario">← Volver a la Pokédex</button>
    <article class="detalle">
      <div class="retrato">
        ${foto(pokemon)}
        ${pokemon.shiny ? '<button id="shiny" class="secundario" aria-pressed="false">Mostrar shiny</button>' : ""}
      </div>
      <div>
        <span class="numero">${numero(id)}</span>
        <h1>${escapar(pokemon.nombre)}</h1>
        <div class="tipos">${tipos(pokemon)}</div>
        <p>${escapar(pokemon.descripcion)}</p>
        <dl>${datos.map(([etiqueta, valor]) => `<div><dt>${etiqueta}</dt><dd>${escapar(valor)}</dd></div>`).join("")}</dl>
        <audio controls preload="none" aria-label="Sonido del Pokémon" src="${escapar(rutaMultimedia(pokemon.sonido))}"></audio>
      </div>
    </article>`;
  app.querySelector("#volver").addEventListener("click", mostrarPokedex);
  const boton = app.querySelector("#shiny");
  if (boton) {
    let mostrarShiny = false;
    boton.addEventListener("click", () => {
      mostrarShiny = !mostrarShiny;
      app.querySelector(".retrato img").src = rutaMultimedia(mostrarShiny ? pokemon.imagenShiny : pokemon.imagen);
      boton.textContent = mostrarShiny ? "Mostrar original" : "Mostrar shiny";
      boton.setAttribute("aria-pressed", mostrarShiny);
    });
  }
}

function actualizarMenu() {
  document.querySelector("#link-login").hidden = Boolean(usuarioActual);
  document.querySelector("#link-registro").hidden = Boolean(usuarioActual);
  document.querySelector("#link-carga").hidden = !usuarioActual?.admin;
  document.querySelector("#salir").hidden = !usuarioActual;
  const sesion = document.querySelector("#sesion");
  sesion.hidden = !usuarioActual;
  if (usuarioActual) {
    sesion.innerHTML = `<img src="${escapar(rutaMultimedia(usuarioActual.avatar))}" alt="">
      ${escapar(usuarioActual.nombre)} · @${escapar(usuarioActual.username)}
      ${usuarioActual.admin ? " · Administrador" : ""}`;
  }
}

function mostrarLogin() {
  app.innerHTML = `
    <section class="panel">
      <h1>Iniciar sesión</h1>
      <form id="login">
        <label>Usuario <input name="username" autocomplete="username" required></label>
        <label>Contraseña <input name="password" type="password" autocomplete="current-password" required></label>
        <button>Ingresar</button>
        <p class="error" role="status"></p>
      </form>
    </section>`;
  app.querySelector("#login").addEventListener("submit", evento => {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    for (const usuario of leerUsuarios()) {
      if (usuario.username.toLowerCase() === datos.get("username").trim().toLowerCase() &&
          usuario.password === datos.get("password")) {
        usuarioActual = usuario;
        actualizarMenu();
        if (usuario.admin) mostrarCarga();
        else mostrarPokedex();
        return;
      }
    }
    app.querySelector(".error").textContent = "Usuario o contraseña incorrectos.";
  });
}

function mostrarRegistro() {
  app.innerHTML = `
    <section class="panel">
      <h1>Registrarse</h1>
      <form id="registro">
        <label>Nombre <input name="nombre" autocomplete="name" required></label>
        <label>Correo <input name="email" type="email" autocomplete="email" required></label>
        <label>Usuario <input name="username" autocomplete="username" required></label>
        <label>Contraseña <input name="password" type="password" autocomplete="new-password" required></label>
        <button>Crear cuenta</button>
        <p class="error" role="status"></p>
      </form>
    </section>`;
  app.querySelector("#registro").addEventListener("submit", evento => {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const nombre = datos.get("nombre").trim();
    const username = datos.get("username").trim();
    const email = datos.get("email").trim().toLowerCase();
    const password = datos.get("password");
    const error = app.querySelector(".error");
    if (!nombre || !username || !password.trim()) {
      error.textContent = "Completá todos los campos.";
      return;
    }

    let id = 1;
    for (const usuario of leerUsuarios()) {
      if (usuario.username.toLowerCase() === username.toLowerCase() || usuario.email.toLowerCase() === email) {
        error.textContent = "El usuario o correo ya está registrado.";
        return;
      }
      id = Math.max(id, usuario.id + 1);
    }
    try {
      guardarUsuarios({ id, nombre, username, email, password, avatar: "./assets/avatar/default.png", admin: false });
    } catch {
      error.textContent = "No se pudo guardar la cuenta en este navegador.";
      return;
    }
    mostrarLogin();
    app.querySelector("[name=username]").value = username;
    app.querySelector("[role=status]").textContent = "Cuenta creada. Ya podés iniciar sesión.";
  });
}

function mostrarCarga() {
  if (!usuarioActual?.admin) {
    mostrarLogin();
    return;
  }
  const estadisticas = [["generacion", "Generación"], ["hp", "HP"], ["ataque", "Ataque"],
    ["velocidad", "Velocidad"], ["defensa", "Defensa"]];
  app.innerHTML = `
    <section class="panel panel-ancho">
      <h1>Cargar Pokémon</h1>
      <form id="carga" class="campos">
        <label>Número <input name="id" type="number" min="1" required></label>
        <label>Nombre <input name="nombre" required></label>
        <label>Tipos (separados por /) <input name="tipo" placeholder="Planta / Veneno" required></label>
        <label>Rareza <input name="rareza" required></label>
        <label class="ancho">Descripción <textarea name="descripcion" rows="3" required></textarea></label>
        <label>Altura (m) <input name="altura" type="number" min="0.01" step="any" required></label>
        <label>Peso (kg) <input name="peso" type="number" min="0.01" step="any" required></label>
        ${estadisticas.map(([campo, etiqueta]) => `<label>${etiqueta} <input name="${campo}" type="number" min="1" required></label>`).join("")}
        <label>Habilidad <input name="habilidad" required></label>
        <label class="check"><input name="tieneEvolucion" type="checkbox"> Tiene evolución</label>
        <label>Evolución <input name="evolucion" disabled></label>
        <label>Nivel de evolución (si aplica) <input name="nivelEvolucion" type="number" min="1" disabled></label>
        <label>Imagen (URL o ruta) <input name="imagen" required></label>
        <label>Sonido (URL o ruta) <input name="sonido" required></label>
        <label class="check"><input name="shiny" type="checkbox"> Tiene variante shiny</label>
        <label>Imagen shiny (URL o ruta) <input name="imagenShiny" disabled></label>
        <div class="ancho"><button>Guardar Pokémon</button></div>
        <p class="ancho error" role="status"></p>
      </form>
    </section>`;
  const formulario = app.querySelector("#carga");
  const campos = formulario.elements;
  campos.tieneEvolucion.addEventListener("change", () => {
    campos.evolucion.disabled = !campos.tieneEvolucion.checked;
    campos.evolucion.required = campos.tieneEvolucion.checked;
    campos.nivelEvolucion.disabled = !campos.tieneEvolucion.checked;
  });
  campos.shiny.addEventListener("change", () => {
    campos.imagenShiny.disabled = !campos.shiny.checked;
    campos.imagenShiny.required = campos.shiny.checked;
  });
  formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    if (!usuarioActual?.admin) return;
    const nuevo = {
      id: campos.id.valueAsNumber,
      nombre: campos.nombre.value.trim(),
      tipo: campos.tipo.value.split("/").map(tipo => tipo.trim()).filter(Boolean),
      descripcion: campos.descripcion.value.trim(),
      altura: campos.altura.valueAsNumber,
      peso: campos.peso.valueAsNumber,
      generacion: campos.generacion.valueAsNumber,
      hp: campos.hp.valueAsNumber,
      ataque: campos.ataque.valueAsNumber,
      velocidad: campos.velocidad.valueAsNumber,
      defensa: campos.defensa.valueAsNumber,
      habilidad: campos.habilidad.value.trim(),
      tieneEvolucion: campos.tieneEvolucion.checked,
      evolucion: campos.tieneEvolucion.checked ? campos.evolucion.value.trim() : "",
      nivelEvolucion: campos.tieneEvolucion.checked && campos.nivelEvolucion.value
        ? campos.nivelEvolucion.valueAsNumber : null,
      rareza: campos.rareza.value.trim(),
      imagen: campos.imagen.value.trim(),
      sonido: campos.sonido.value.trim(),
      shiny: campos.shiny.checked,
      imagenShiny: campos.shiny.checked ? campos.imagenShiny.value.trim() : "",
    };
    const error = app.querySelector(".error");
    if (!nuevo.nombre || !nuevo.tipo.length || !nuevo.descripcion || !nuevo.habilidad ||
        !nuevo.rareza || (nuevo.tieneEvolucion && !nuevo.evolucion)) {
      error.textContent = "Completá los datos de la ficha.";
      return;
    }
    if (!rutaMultimedia(nuevo.imagen) || !rutaMultimedia(nuevo.sonido) ||
        (nuevo.shiny && !rutaMultimedia(nuevo.imagenShiny))) {
      error.textContent = "Ingresá una URL http(s) o una ruta a un recurso del proyecto.";
      return;
    }
    for (const pokemon of leerPokemones()) {
      if (pokemon.id === nuevo.id || pokemon.nombre.toLowerCase() === nuevo.nombre.toLowerCase()) {
        error.textContent = "Ya existe un Pokémon con ese número o nombre.";
        return;
      }
    }
    try {
      guardarPokemones(nuevo);
    } catch {
      error.textContent = "No se pudo guardar el Pokémon en este navegador.";
      return;
    }
    mostrarDetalle(nuevo.id);
  });
}

function mostrarBatalla(clave = "inicio") {
  const escena = escenas[clave];
  app.innerHTML = `
    <section class="panel batalla">
      <h1>Batalla Pokémon</h1>
      <div class="arena">
        <figure><img src="./assets/img/pikachu.png" alt=""><figcaption>Pikachu</figcaption></figure>
        <span>VS</span>
        <figure><img src="./assets/img/Squirtle.png" alt=""><figcaption>Squirtle</figcaption></figure>
      </div>
      <h2>${escena.resultado ?? "Turno " + escena.turno}</h2>
      <p>${escena.texto}</p>
      <div class="acciones"></div>
    </section>`;
  const opciones = escena.opciones ?? [["Volver a jugar", "inicio"]];
  for (const [texto, destino] of opciones) {
    const boton = document.createElement("button");
    boton.textContent = texto;
    boton.addEventListener("click", () => mostrarBatalla(destino));
    app.querySelector(".acciones").append(boton);
  }
}

const vistas = {
  "#inicio": mostrarInicio, "#pokedex": mostrarPokedex, "#login": mostrarLogin,
  "#registro": mostrarRegistro, "#carga": mostrarCarga, "#batalla": mostrarBatalla,
};

for (const enlace of document.querySelectorAll(".header a")) {
  enlace.addEventListener("click", evento => {
    evento.preventDefault();
    vistas[enlace.getAttribute("href")]();
    window.scrollTo(0, 0);
  });
}

document.querySelector("#salir").addEventListener("click", () => {
  usuarioActual = null;
  actualizarMenu();
  mostrarInicio();
});

actualizarMenu();
mostrarInicio();

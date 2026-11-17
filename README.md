# PokeApp · Trabajo Práctico 9

Pokédex de clase en HTML5, CSS3 y JavaScript. Incluye búsqueda, fichas, registro e inicio de sesión, alta de Pokémon y una batalla guionada con dos turnos.

## Cómo abrirla

Abrí la carpeta completa en VS Code y ejecutá `index.html` con Live Server. Si tenés Python instalado, podés abrir una terminal en la carpeta y ejecutar `python -m http.server 8000`. Después abrí `http://localhost:8000` en el navegador. Los módulos JavaScript requieren un servidor HTTP.

## Cuentas de prueba

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | `1234` | `1234` |
| Entrenador | `entrenador1` | `demo1234` |

Las cuentas son ficticias y el inicio de sesión es una simulación para la clase. Usá contraseñas de prueba.

## Cómo funciona

- `js/db/` contiene los arrays iniciales de Pokémon y usuarios y las escenas de la batalla.
- `js/app.js` conecta la navegación y los formularios con `addEventListener` y renderiza las vistas en `#app`.
- `js/persistencia.js` recupera los arrays con `JSON.parse` y los guarda con `JSON.stringify` en `localStorage`. Probá registrar un usuario o cargar un Pokémon y recargar desde la misma dirección.
- Para probar una carga, podés usar rutas como `./assets/img/pikachu.png` y `./assets/sound/pikachu.mp3` o tus propias URL. El detalle muestra la ficha que acaba de guardarse.

Código y recursos iniciales del [repositorio de clase](https://github.com/totoargumedo/PokeApp). Imágenes shiny de [PokeAPI Sprites](https://github.com/PokeAPI/sprites).

// Cada opción lleva a otra escena o a un resultado.
export const escenas = {
  inicio: {
    turno: 1,
    texto: "Pikachu entra al campo. Squirtle prepara Pistola Agua.",
    opciones: [
      ["Atacar con Impactrueno", "ventaja"],
      ["Usar una poción", "presion"],
    ],
  },
  ventaja: {
    turno: 2,
    texto: "Impactrueno acertó. Squirtle está debilitado y prepara su último ataque.",
    opciones: [
      ["Atacar otra vez", "victoria"],
      ["Reservar energía", "derrota"],
    ],
  },
  presion: {
    turno: 2,
    texto: "Pikachu recuperó energía. Squirtle se acerca con Placaje.",
    opciones: [
      ["Esquivar y contraatacar", "victoria"],
      ["Esperar en el lugar", "derrota"],
    ],
  },
  victoria: {
    resultado: "¡Ganaste la batalla!",
    texto: "El último ataque de Pikachu dejó fuera de combate a Squirtle.",
  },
  derrota: {
    resultado: "Squirtle ganó la batalla",
    texto: "Squirtle aprovechó la oportunidad y dejó fuera de combate a Pikachu.",
  },
};

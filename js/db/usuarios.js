// Cuentas ficticias para probar los roles del trabajo práctico.
export const usuariosDefecto = [
  { id: 1, nombre: "Juan", email: "juan@example.com", username: "1234",
    password: "1234", avatar: "./assets/avatar/1.png", admin: true },
];

const nombres = ["Ana", "Bruno", "Camila", "Diego", "Elena", "Facundo", "Gala", "Hugo", "Inés"];

for (let i = 0; i < nombres.length; i++) {
  const username = "entrenador" + (i + 1);
  usuariosDefecto.push({
    id: i + 2,
    nombre: nombres[i],
    email: username + "@example.com",
    username,
    password: "demo1234",
    avatar: "./assets/avatar/2.png",
    admin: false,
  });
}

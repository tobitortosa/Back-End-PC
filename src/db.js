require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { DB_CONNECTION_URL, DB_USER } = process.env;

const Sequelize = require('sequelize');

// const sequelize = new Sequelize('postgres://' + DB_USER + ":" +  DB_PASSWORD + "@" + DB_HOST + ":5432/" + DB_NAME, {
// host: DB_HOST,
// dialect: DB_USER,
// logging: false,
// pool: {
//     min: 0,
//     max: 5,
//     idle: 1000
// }
// });

console.log(DB_CONNECTION_URL)

const sequelize = new Sequelize(DB_CONNECTION_URL, {
  dialect: DB_USER,
  logging: false
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const { User, Cart, Review, Producto, Orden } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
User.belongsToMany(Cart, { through: "cartUser" });
Cart.belongsToMany(User, { through: "cartUser" });

User.belongsToMany(Orden, { through: "ordenUser" });
Orden.hasOne(User);
User.hasMany(Review);
Review.belongsTo(User);
Producto.hasMany(Review);
Review.belongsTo(Producto);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};

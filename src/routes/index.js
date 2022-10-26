const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pokemonRoute = require("./pokemons");
const typeRoute = require("./type");
const motherBoard = require('./motherBoard.js');
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/pokemons", pokemonRoute);
router.use("/types", typeRoute);
router.use("/motherBoard", motherBoard)

module.exports = router;

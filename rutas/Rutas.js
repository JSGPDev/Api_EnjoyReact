const express = require("express");
const router = express.Router();

const index = require("../controlador/ControladorIndex.js");
const session = require("../controlador/ControladorSession.js");
const pet = require("../controlador/ControladorPet.js");

router.get('/', index);
router.use('/session', session);
router.use('/pet', pet)

module.exports = router;

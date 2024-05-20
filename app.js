const express = require("express");
const cors = require('cors');
require("dotenv").config();
const app = express();
const router = require("./rutas/Rutas.js");

app.use(express.json());
app.use(cors());

app.use("/", router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor listo y escuchando en el puerto ${port}`);
});

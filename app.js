const express = require("express");
require("dotenv").config();
const app = express();
const router = require("./controller/controladorRutas")

app.use(express.json());
app.use("/", router);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor listo y escuchando en el puerto ${port}`);
})
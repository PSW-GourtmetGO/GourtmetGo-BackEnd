/* MODULO DE EXPRESS */
const express = require("express");
const path = require("path");
/* GESTION DEL SERVIDOR WEB*/
const app = express();
/* DEFINICION PUERTO */
const PORT = 5000;
/* DEFINICION DEL PATH INICIAL */
const PATH = require("path");
/* RESPUESTA DEL SERVIDOR */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
/* EJECUCION DEL SERVIDOR */
app.listen(PORT, () => {
  console.log(`SERVIDOR EJECUTANDOSE EN EL PUERTO: http://localhost:${PORT}`);
});

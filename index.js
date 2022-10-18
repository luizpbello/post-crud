const express = require("express");
const db = require("./config/db");
const consign = require("consign");

const app = express();
app.db = db;

consign()
  .then("./config/middlewares.js")
  .then('./controllers/validation.js')
  .then("./controllers")
  .then("/config/routes.js")
  .into(app);
app.listen(3000, () => console.log(`Backend rodando`));

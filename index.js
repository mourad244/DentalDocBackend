const winston = require("winston");
const express = require("express");
const logger = require("./startup/logging");
const config = require("config");
require("dotenv").config();
const app = express();

app.use("/images", express.static("./images"));
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = 3900;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;

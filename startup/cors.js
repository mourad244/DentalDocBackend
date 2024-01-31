const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({ origin: "https://dentaldocfrontend-cb29443ba68e.herokuapp.com" })
  );
};

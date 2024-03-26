const mongoose = require("mongoose");

const counterBonCommandeSchema = new mongoose.Schema({
  lastNumOrdre: { type: Number, default: 0 },
  year: { type: Number },
});

const CounterBonCommande = mongoose.model(
  "CounterBonCommande",
  counterBonCommandeSchema
);

exports.CounterBonCommande = CounterBonCommande;
exports.counterBonCommandeSchema = counterBonCommandeSchema;

const mongoose = require("mongoose");

const counterPaiementSchema = new mongoose.Schema({
  lastNumOrdre: { type: Number, default: 0 },
  year: { type: Number },
});

const CounterPaiement = mongoose.model(
  "CounterPaiement",
  counterPaiementSchema
);

exports.CounterPaiement = CounterPaiement;
exports.counterPaiementSchema = counterPaiementSchema;

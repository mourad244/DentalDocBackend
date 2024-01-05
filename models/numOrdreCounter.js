const mongoose = require("mongoose");

const numOrdreCounterSchema = new mongoose.Schema({
  lastNumOrdre: { type: Number, default: 0 },
  year: { type: Number },
});

const NumOrdreCounter = mongoose.model(
  "NumOrdreCounter",
  numOrdreCounterSchema
);

exports.NumOrdreCounter = NumOrdreCounter;
exports.numOrdreCounterSchema = numOrdreCounterSchema;

const mongoose = require("mongoose");

const counterReceptionBCSchema = new mongoose.Schema({
  lastNumOrdre: { type: Number, default: 0 },
  year: { type: Number },
});

const CounterReceptionBC = mongoose.model(
  "CounterReceptionBC",
  counterReceptionBCSchema
);

exports.CounterReceptionBC = CounterReceptionBC;
exports.counterReceptionBCSchema = counterReceptionBCSchema;

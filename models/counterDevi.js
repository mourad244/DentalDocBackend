const mongoose = require("mongoose");

const counterDeviSchema = new mongoose.Schema({
  lastNumOrdre: { type: Number, default: 0 },
  year: { type: Number },
});

const CounterDevi = mongoose.model("CounterDevi", counterDeviSchema);

exports.CounterDevi = CounterDevi;
exports.counterDeviSchema = counterDeviSchema;

const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  nom: String,
  code: Number,
});
const Region = mongoose.model("Region", regionSchema);

exports.regionSchema = regionSchema;
exports.Region = Region;

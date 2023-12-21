const mongoose = require("mongoose");

const provinceSchema = new mongoose.Schema({
  nom: String,
  code: String,
  regionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
  },
});
const Province = mongoose.model("Province", provinceSchema);

exports.provinceSchema = provinceSchema;
exports.Province = Province;

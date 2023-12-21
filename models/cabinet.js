const mongoose = require("mongoose");

const cabinetSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
});
const Cabinet = mongoose.model("Cabinet", cabinetSchema);

exports.cabinetSchema = cabinetSchema;
exports.Cabinet = Cabinet;

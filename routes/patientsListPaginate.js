const express = require("express");

const { Patient } = require("../models/patient");

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.currentPage) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const sortColumn = req.query.sortColumn || "nom";
  const order = req.query.order || "asc";
  const searchQuery = req.query.searchQuery || "";

  const skipIndex = (page - 1) * pageSize;

  let filter = {};
  if (searchQuery) {
    filter = {
      $or: [
        { nom: { $regex: searchQuery, $options: "i" } },
        { prenom: { $regex: searchQuery, $options: "i" } },
        { cin: { $regex: searchQuery, $options: "i" } },
        // Add other fields you want to include in the search
      ],
    };
  }
  try {
    const totalCount = await Patient.countDocuments(filter);
    const patients = await Patient.find(filter)
      .sort({ [sortColumn]: order === "asc" ? 1 : -1 })
      .skip(skipIndex)
      .limit(pageSize)
      .select(
        "dateNaissance isMasculin profession cin prochainRdv nom numOrdre prenom telephone regionId provinceId"
      );
    res.send({ data: patients, totalCount });
  } catch (error) {
    res.status(500).send("Error fetching patients data");
  }
});
module.exports = router;

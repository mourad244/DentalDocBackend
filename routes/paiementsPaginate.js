const express = require("express");

const { Paiement } = require("../models/paiement");

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.currentPage) || 1;
  const pageSize = parseInt(req.query.pageSize) || 15;
  const sortColumn = req.query.sortColumn || "nom";
  const order = req.query.order || "asc";
  const time = req.query.time || "journee";
  let date = req.query.date ? new Date(req.query.date) : new Date();

  let start, end;
  if (time === "journee") {
    start = new Date(date.setHours(0, 0, 0, 0));
    end = new Date(date.setHours(23, 59, 59, 999));
  } else if (time === "mois") {
    start = new Date(date.getFullYear(), date.getMonth(), 1);
    end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  } else if (time === "annee") {
    start = new Date(date.getFullYear(), 0, 1);
    end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
  }
  const query = {
    date: {
      $gte: start,
      $lte: end,
    },
  };
  const skipIndex = (page - 1) * pageSize;

  try {
    const totalCount = await Paiement.countDocuments(query);
    const paiements = await Paiement.find(query)

      .populate({
        path: "patientId",
      })

      .sort({ [sortColumn]: order === "asc" ? 1 : -1 })
      .skip(skipIndex)
      .limit(pageSize);

    res.send({ data: paiements, totalCount });
  } catch (error) {
    res.status(500).send("Error fetching paiements data");
  }
});
module.exports = router;

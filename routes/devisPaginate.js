const express = require("express");

const { Devi } = require("../models/devi");

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.currentPage) || 1;
  const pageSize = parseInt(req.query.pageSize) || 15;
  const sortColumn = req.query.sortColumn || "nom";
  const order = req.query.order || "asc";
  const time = req.query.time || "journee";
  const date = new Date(req.query.date);

  let start, end;

  if (time === "journee") {
    const timeZoneOffsetInHours = 2;
    start = new Date(date);
    start.setUTCHours(-timeZoneOffsetInHours, 0, 0, 0); // Adjust for time zone offset
    end = new Date(date);
    end.setUTCHours(23 - timeZoneOffsetInHours, 59, 59, 999); // Adjust for time zone and set to end of the day

    // start = new Date(date.setHours(0, 0, 0, 0));
    // end = new Date(date.setHours(23, 59, 59, 999));
  } else if (time === "mois") {
    start = new Date(date.getFullYear(), date.getMonth(), 1);
    end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  } else if (time === "annee") {
    start = new Date(date.getFullYear(), 0, 1);
    end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
  }
  const query = {
    dateDevi: {
      $gte: start,
      $lte: end,
    },
  };
  const skipIndex = (page - 1) * pageSize;

  try {
    const totalCount = await Devi.countDocuments(query);
    const devis = await Devi.find(query)
      .populate({
        path: "medecinId",
      })
      .populate({
        path: "patientId",
      })
      .populate("rdvIds")
      .sort({ [sortColumn]: order === "asc" ? 1 : -1 })
      .skip(skipIndex)
      .limit(pageSize);
    /* .select(
        "dateNaissance isMasculin profession cin prochainRdv nom numOrdre prenom telephone regionId provinceId"
      ); */
    res.send({ data: devis, totalCount });
  } catch (error) {
    res.status(500).send("Error fetching devis data");
  }
});
module.exports = router;

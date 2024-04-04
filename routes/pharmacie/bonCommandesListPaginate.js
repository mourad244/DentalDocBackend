const express = require("express");

const { BonCommande } = require("../../models/pharmacie/bonCommande");

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.currentPage) || 1;
  const pageSize = parseInt(req.query.pageSize) || 15;
  const sortColumn = req.query.sortColumn || "nom";
  const order = req.query.order || "asc";
  const searchQuery = req.query.searchQuery || "";

  const skipIndex = (page - 1) * pageSize;

  let filter = {};
  if (searchQuery) {
    filter = {
      $or: [
        { objet: { $regex: searchQuery, $options: "i" } },
        { numOrdre: { $regex: searchQuery, $options: "i" } },
        // date
        // Add other fields you want to include in the search
      ],
    };
  }
  try {
    const totalCount = await BonCommande.countDocuments(filter);
    const bonCommandes = await BonCommande.find(filter)
      .sort({ [sortColumn]: order === "asc" ? 1 : -1 })
      .skip(skipIndex)
      .populate("societeRetenuId")
      .limit(pageSize);

    res.send({ data: bonCommandes, totalCount });
  } catch (error) {
    res.status(500).send("Error fetching bonCommandes data");
  }
});
module.exports = router;

const express = require("express");

const { Societe } = require("../../models/pharmacie/societe");
const router = express.Router();

router.get("/", async (req, res) => {
  const searchQuery = req.query.searchQuery;

  if (!searchQuery) {
    return res.status(400).send("Search string is required");
  }
  try {
    const societes = await Societe.find({
      $or: [
        { nom: { $regex: searchQuery, $options: "i" } },
        { telephone: { $regex: searchQuery, $options: "i" } },
        { ville: { $regex: searchQuery, $options: "i" } },
        { numPatente: { $regex: searchQuery, $options: "i" } },
        { numICE: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    });
    res.send(societes);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching societes data");
  }
});
module.exports = router;

const express = require("express");

const { Article } = require("../../models/pharmacie/article");
const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.currentPage) || 1;
  const pageSize = parseInt(req.query.pageSize) || 15;
  const sortColumn = req.query.sortColumn || "nom";
  const order = req.query.order || "asc";
  const searchQuery = req.query.searchQuery || "";
  const selectedLots = req.query.selectedLots || [];

  const skipIndex = (page - 1) * pageSize;

  let filter = {};
  if (searchQuery !== "") {
    console.log("searchQueary", searchQuery);
    filter = {
      $or: [
        { code: { $regex: searchQuery, $options: "i" } },
        { nom: { $regex: searchQuery, $options: "i" } },
      ],
    };
  }
  // if (selectedLots && selectedLots.length > 0) {
  //   filter = {
  //     ...filter,
  //     lotId: { $in: selectedLots },
  //   };
  // }
  console.log(filter);
  try {
    const totalCount = await Article.countDocuments(filter);
    const articles = await Article.find(filter)
      .sort({ [sortColumn]: order === "asc" ? 1 : -1 })
      .skip(skipIndex)
      .limit(pageSize);

    res.send({ data: articles, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching articles data");
  }
});
module.exports = router;

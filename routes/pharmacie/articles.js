const express = require("express");

const { Article } = require("../../models/pharmacie/article");
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

const validations = require("../../startup/validations");
const deleteImages = require("../../middleware/deleteImages");
const getPathData = require("../../middleware/getPathData");
const uploadImages = require("../../middleware/uploadImages");

const compressImage = require("../../utils/compressImage");
const router = express.Router();

router.get("/", async (req, res) => {
  const page = req.query.currentPage
    ? parseInt(req.query.currentPage)
    : undefined;
  const pageSize = req.query.pageSize
    ? parseInt(req.query.pageSize)
    : undefined;
  const sortColumn = req.query.sortColumn || "nom";
  const order = req.query.order || "asc";
  const searchQuery = req.query.searchQuery || "";
  const selectedLots = req.query.selectedLots;
  let skipIndex = undefined;
  if (page && pageSize) skipIndex = (page - 1) * pageSize;
  let filters = [];
  if (searchQuery) {
    filters.push({
      $or: [
        { code: { $regex: searchQuery, $options: "i" } },
        { nom: { $regex: searchQuery, $options: "i" } },
      ],
    });
  }
  if (selectedLots !== undefined && selectedLots !== "") {
    const selectedLotsArray = selectedLots
      .split(",")
      .map((id) => new mongoose.Types.ObjectId(id.trim()));

    filters.push({ lotId: { $in: selectedLotsArray } });
  } /*  else {
    filters.push({ lotId: { $exists: false } });
  } */

  let filter = {};
  if (filters.length > 1) {
    filter.$or = filters;
  } else if (filters.length === 1) {
    filter = filters[0];
  }
  try {
    const totalCount = await Article.countDocuments(filter);
    const articles = await Article.find(filter)
      // .populate("lotId")
      .sort({ [sortColumn]: order === "asc" ? 1 : -1 })
      .skip(skipIndex ? skipIndex : 0)
      .limit(pageSize ? pageSize : 0);
    res.send({ data: articles, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching articles data");
  }
});

router.post("/", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
  const { error } = validations.article(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }

  const {
    lotId,
    code,
    nom,
    stockInitial,
    stockAlerte,
    uniteMesureId,
    uniteReglementaireId,
    prixHT,
    tauxTVA,
    prixTTC,
    isExpiration,
  } = req.body;
  let isExpirationBoolean = undefined;
  if (typeof isExpiration === "string") {
    isExpirationBoolean = isExpiration === "true" ? true : false;
  } else if (typeof isExpiration === "boolean") {
    isExpirationBoolean = isExpiration;
  } else {
    isExpirationBoolean = undefined;
  }
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  // validation to delete if sure they are called just before
  // if (lotId) {
  //   const lot = await Lot.findById(lotId);
  //   if (!lot) return res.status(400).send("Lot Invalide.");
  // }

  const article = new Article({
    lotId: lotId ? lotId : undefined,
    code: code ? code : "",
    nom: nom ? nom : "",
    stockInitial: stockInitial ? stockInitial : 0,
    stockAlerte: stockAlerte ? stockAlerte : 0,
    uniteMesureId: uniteMesureId ? uniteMesureId : undefined,
    uniteReglementaireId: uniteReglementaireId
      ? uniteReglementaireId
      : undefined,
    prixHT: prixHT ? prixHT : 0,
    tauxTVA: tauxTVA ? tauxTVA : 0,
    prixTTC: prixTTC ? prixTTC : 0,
    isExpiration: isExpirationBoolean,
    images: newImages,
  });
  await article.save();
  res.send(article);
});

router.put("/:id", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (error) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${error}`,
    });
  }
  const { error } = validations.article(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }

  const {
    lotId,
    code,
    nom,
    stockInitial,
    stockAlerte,
    uniteMesureId,
    uniteReglementaireId,
    prixHT,
    tauxTVA,
    prixTTC,
    isExpiration,
    imagesDeletedIndex,
  } = req.body;
  let isExpirationBoolean = undefined;
  if (typeof isExpiration === "string") {
    isExpirationBoolean = isExpiration === "true" ? true : false;
  } else if (typeof isExpiration === "boolean") {
    isExpirationBoolean = isExpiration;
  } else {
    isExpirationBoolean = undefined;
  }
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);
  /* 
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    {
      lotId: lotId ? lotId : undefined,
      code,
      nom,
      stockInitial,
      stockAlerte,
      uniteMesureId: uniteMesureId ? uniteMesureId : undefined,
      uniteReglementaireId: uniteReglementaireId
        ? uniteReglementaireId
        : undefined,
      prixHT,
      tauxTVA,
      prixTTC,
      isExpiration,
    },
    {
      new: true,
    }
  ); */
  const article = await Article.findById(req.params.id);
  if (!article)
    return res.status(404).send("The article with the given ID was not found.");
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  const updatedImages =
    imagesDeletedIndex && imagesDeletedIndex.length !== 0
      ? article.images.filter((_, index) => !imagesDeletedIndex.includes(index))
      : article.images;

  updatedImages.push(...newImages);

  const updatedArticleData = {
    lotId: lotId ? lotId : undefined,
    code: code || "",
    nom: nom || "",
    stockInitial: stockInitial || 0,
    stockAlerte: stockAlerte || 0,
    uniteMesureId: uniteMesureId ? uniteMesureId : undefined,
    uniteReglementaireId: uniteReglementaireId
      ? uniteReglementaireId
      : undefined,
    prixHT: prixHT || 0,
    tauxTVA: tauxTVA || 0,
    prixTTC: prixTTC || 0,
    isExpiration: isExpirationBoolean,
    images: updatedImages,
  };
  await Article.findByIdAndUpdate(req.params.id, updatedArticleData);
  res.send(article);
});

router.get("/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article)
    return res.status(404).send("The article with the given ID was not found.");
  res.send(article);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const article = await Article.findOneAndDelete({ _id: req.params.id });
  if (!article)
    return res.status(404).send("The article with the given ID was not found.");
  res.send(article);
});

module.exports = router;

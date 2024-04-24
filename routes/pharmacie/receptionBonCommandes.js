const express = require("express");

const {
  ReceptionBonCommande,
} = require("../../models/pharmacie/receptionBonCommande");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validations = require("../../startup/validations");
const {
  CounterReceptionBC,
} = require("../../models/pharmacie/counterReceptionBC");
const getPathData = require("../../middleware/getPathData");
const compressImage = require("../../utils/compressImage");
const uploadImages = require("../../middleware/uploadImages");
const deleteImages = require("../../middleware/deleteImages");
const { BonCommande } = require("../../models/pharmacie/bonCommande");
const { Article } = require("../../models/pharmacie/article");
const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.currentPage) || 1;
  const pageSize = parseInt(req.query.pageSize) || 15;
  const sortColumn = req.query.sortColumn || "nom";
  const order = req.query.order || "asc";
  const time = req.query.time || "journee";

  const skipIndex = (page - 1) * pageSize;

  try {
    const totalCount = await ReceptionBonCommande.countDocuments();
    const receptionBonCommandes = await ReceptionBonCommande.find()

      .populate({
        path: "bonCommandeId",
        populate: {
          path: "societeRetenuId",
          select: "nom",
        },
      })

      .sort({ [sortColumn]: order === "asc" ? 1 : -1 })
      .skip(skipIndex)
      .limit(pageSize);
    res.send({ data: receptionBonCommandes, totalCount });
  } catch (error) {
    res.status(500).send("Error fetching paiements data");
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
  const { error } = validations.receptionBonCommande(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }
  let { bonCommandeId, date, articles, commentaire, isLast } = req.body;
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  const currentYear = new Date(date).getFullYear();
  let counter = await CounterReceptionBC.findOne({ year: currentYear });
  if (!counter) {
    counter = new CounterReceptionBC({
      lastNumOrdre: 0,
      year: currentYear,
    });
  }
  counter.lastNumOrdre++;
  const numOrdre = counter.lastNumOrdre;

  const receptionBonCommande = new ReceptionBonCommande({
    numOrdre,
    bonCommandeId,
    date,
    articles,
    commentaire,
    images: newImages,
    isLast,
  });
  const bonCommande = await BonCommande.findById(bonCommandeId);
  bonCommande.receptionIds.push(receptionBonCommande._id);
  await counter.save();
  await receptionBonCommande.save();
  await bonCommande.updateQuantiteRestante();
  await bonCommande.updateStatut();
  articles.forEach(async (article) => {
    const articleToUpdate = await Article.findById(article.articleId);
    articleToUpdate.receptionBCIds.push(receptionBonCommande._id);
    await articleToUpdate.save();

    await articleToUpdate.updateStockActuel();
  });
  res.send(receptionBonCommande);
});

router.put("/:id", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
  const { error } = validations.receptionBonCommande(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }
  let {
    numOrdre,
    bonCommandeId,
    date,
    articles,
    commentaire,
    imagesDeletedIndex,
    isLast,
  } = req.body;
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);

  const receptionBonCommande = await ReceptionBonCommande.findById(
    req.params.id
  );
  if (!receptionBonCommande) {
    deleteImages(req.files);
    return res.status(404).send("ReceptionBonCommande not found");
  }
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  const updatedImages =
    imagesDeletedIndex && imagesDeletedIndex.length !== 0
      ? receptionBonCommande.images.filter((image, index) => {
          return !imagesDeletedIndex.includes(index);
        })
      : receptionBonCommande.images;
  updatedImages.push(...newImages);
  receptionBonCommande.numOrdre = numOrdre;
  receptionBonCommande.date = date;
  receptionBonCommande.bonCommandeId = bonCommandeId;
  receptionBonCommande.commentaire = commentaire;
  receptionBonCommande.images = updatedImages;
  receptionBonCommande.articles = articles;
  receptionBonCommande.isLast = isLast;
  await receptionBonCommande.save();
  const bonCommande = await BonCommande.findById(bonCommandeId);
  await bonCommande.updateQuantiteRestante();
  await bonCommande.updateStatut();

  articles.forEach(async (article) => {
    const articleToUpdate = await Article.findById(article.articleId);
    await articleToUpdate.updateStockActuel();
  });
  res.send(receptionBonCommande);
});

router.get("/:id", async (req, res) => {
  const receptionBonCommande = await ReceptionBonCommande.findById(
    req.params.id
  )
    .populate({
      path: "bonCommandeId",
      populate: {
        path: "societeRetenuId",
        select: "nom",
      },
    })
    .populate({
      path: "articles",
      populate: {
        path: "articleId",
      },
    });
  if (!receptionBonCommande)
    return res.status(404).send("ReceptionBonCommande not found");
  res.send(receptionBonCommande);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const receptionBonCommande = await ReceptionBonCommande.findOneAndDelete(
    req.params.id
  );
  // delete receptionBonCommande from bonCommande receptionIds
  const bonCommande = await BonCommande.findById(
    receptionBonCommande.bonCommandeId
  );
  bonCommande.receptionIds = bonCommande.receptionIds.filter(
    (id) => id.toString() !== req.params.id
  );
  await bonCommande.save();
  await bonCommande.updateQuantiteRestante();
  await bonCommande.updateStatut();
  // delete receptionBonCommande from articles receptionBCIds
  receptionBonCommande.articles.forEach(async (article) => {
    const articleToUpdate = await Article.findById(article.articleId);
    articleToUpdate.receptionBCIds = articleToUpdate.receptionBCIds.filter(
      (id) => id.toString() !== req.params.id
    );
    await articleToUpdate.save();
    await articleToUpdate.updateStockActuel();
  });

  if (!receptionBonCommande)
    return res.status(404).send("ReceptionBonCommande not found");
  deleteImages(receptionBonCommande.images);
  res.send(receptionBonCommande);
});

module.exports = router;

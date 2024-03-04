const express = require("express");

const { Rdv } = require("../models/rdv");
const { Devi } = require("../models/devi");
const { Dent } = require("../models/dent");
const { Patient } = require("../models/patient");
const { Medecin } = require("../models/medecin");
const { CounterDevi } = require("../models/counterDevi");
const { ActeDentaire } = require("../models/acteDentaire");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validations = require("../startup/validations");

const getPathData = require("../middleware/getPathData");
const compressImage = require("../utils/compressImage");
const uploadImages = require("../middleware/uploadImages");
const deleteImages = require("../middleware/deleteImages");

const router = express.Router();

router.get("/", async (req, res) => {
  const devis = await Devi.find()
    .populate({
      path: "medecinId",
    })
    .populate({
      path: "patientId",
    })
    .populate("rdvIds")
    .sort("numOrdre");
  res.send(devis);
});

router.post("/", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
  const { error } = validations.devi(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }

  const {
    patientId,
    newPatient,
    medecinId,
    dateDevi,
    montant,
    acteEffectues,
    rdvIds,
  } = req.body;
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  const currentYear = new Date(dateDevi).getFullYear();
  let counter = await CounterDevi.findOne({ year: currentYear });
  if (!counter) {
    counter = new CounterDevi({
      lastNumOrdre: 0,
      year: currentYear,
    });
  }
  counter.lastNumOrdre += 1;
  const numOrdre = counter.lastNumOrdre;

  let patient = {};
  if (patientId) {
    patient = await Patient.findById(patientId);
    if (!patient) return res.status(400).send("Patient Invalide.");
  }

  if (newPatient) {
    if (patientId) {
      patient.cin = newPatient.cin;
      patient.nom = newPatient.nom;
      patient.prenom = newPatient.prenom;
      patient.isMasculin = newPatient.isMasculin;
      patient.telephone = newPatient.telephone;
      patient.regionId = newPatient.regionId ? newPatient.regionId : undefined;
      patient.provinceId = newPatient.provinceId
        ? newPatient.provinceId
        : undefined;
    } else {
      const { error } = validations.patient(newPatient);
      if (error) return res.status(400).send(error.details[0].message);
      patient = new Patient({
        cin: newPatient.cin,
        nom: newPatient.nom,
        prenom: newPatient.prenom,
        isMasculin: newPatient.isMasculin,
        telephone: newPatient.telephone,
        regionId: newPatient.regionId ? newPatient.regionId : patient.regionId,
        provinceId: newPatient.provinceId
          ? newPatient.provinceId
          : patient.provinceId,
      });
    }
  }

  if (medecinId) {
    const medecin = await Medecin.findById(medecinId);
    if (!medecin) return res.status(400).send("Medecin Invalide.");
  }

  // validations

  let i = 0;
  let j = 0;
  while (i < acteEffectues.length) {
    if (acteEffectues[i]) {
      const acteDentaire = await ActeDentaire.findById(acteEffectues[i].acteId);
      if (!acteDentaire) return res.status(400).send("acte Invalide.");
      // if prix of acteDentaire is null or undefined or 0 or "" then affect the price acteEffectues[i].prix to acteDentaire
      if (acteDentaire.prix === null || acteDentaire.prix === undefined) {
        acteDentaire.prix = acteEffectues[i].prix;
        await acteDentaire.save();
      }
      if (acteEffectues[i].dentIds && acteEffectues[i].dentIds.length !== 0)
        while (j < acteEffectues[i].dentIds.length) {
          const dent = await Dent.findById(acteEffectues[i].dentIds[j]);
          if (!dent) return res.status(400).send("Dent Invalide.");
          j++;
        }
    }
    i++;
  }
  const devi = new Devi({
    numOrdre: numOrdre,
    patientId: patient._id,
    medecinId: medecinId,
    dateDevi: dateDevi,
    acteEffectues: acteEffectues,
    montant: montant,
    rdvIds: rdvIds,
    images: newImages,
  });
  patient.deviIds.push({
    deviId: devi._id,
    montant: montant,
  });
  //  for each rdvId in rdvIds, update the rdv with deviId
  if (rdvIds && rdvIds.length !== 0) {
    let i = 0;
    while (i < rdvIds.length) {
      const rdv = await Rdv.findById(rdvIds[i]);
      if (!rdv) return res.status(400).send("Rdv Invalide.");
      rdv.deviId = devi._id;
      rdv.isHonnore = true;
      rdv.isReporte = false;
      rdv.isAnnule = false;
      await rdv.save();
      i++;
    }
  }
  patient.calculateTotalDevis();
  patient.calculateBalance();

  await counter.save();
  await devi.save();
  await patient.save();
  res.send(devi);
});

router.put("/:id", [auth, admin], async (req, res) => {
  try {
    await uploadImages(req, res);
  } catch (error) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${error}`,
    });
  }

  const { error } = validations.devi(req.body);
  if (error) {
    deleteImages(req.files);
    return res.status(400).send(error.details[0].message);
  }

  const {
    numOrdre,
    patientId,
    newPatient,
    medecinId,
    dateDevi,
    montant,
    acteEffectues,
    imagesDeletedIndex,
  } = req.body;
  const { image: images } = getPathData(req.files);
  if (images) compressImage(images);

  const devi = await Devi.findById(req.params.id);
  if (!devi) return res.status(400).send("Devi Invalide.");
  const newImages = images
    ? images.map((image) => image.destination + "/compressed/" + image.filename)
    : [];
  // Merge old and new images, excluding deleted ones
  const updatedImages =
    imagesDeletedIndex && imagesDeletedIndex.length !== 0
      ? devi.images.filter((_, index) => !imagesDeletedIndex.includes(index))
      : devi.images;

  updatedImages.push(...newImages);
  // validation to delete if sure they are called just before

  // validations
  let i = 0;
  let j = 0;
  while (i < acteEffectues.length) {
    if (acteEffectues[i]) {
      const acteDentaire = await ActeDentaire.findById(acteEffectues[i].acteId);
      if (!acteDentaire) return res.status(400).send("acte Invalide.");

      if (acteDentaire.prix === null || acteDentaire.prix === undefined) {
        acteDentaire.prix = acteEffectues[i].prix;
        await acteDentaire.save();
      }
      if (acteEffectues[i].dentIds && acteEffectues[i].dentIds.length != 0)
        while (j < acteEffectues[i].dentIds.length) {
          const dent = await Dent.findById(acteEffectues[i].dentIds[j]);
          if (!dent) return res.status(400).send("Dent Invalide.");
          j++;
        }
    }
    i++;
  }

  await Devi.findByIdAndUpdate(req.params.id, {
    numOrdre,
    patientId,
    medecinId,
    dateDevi,
    acteEffectues,
    montant,
    images: updatedImages,
  });

  const updatedPatient = await Patient.findOneAndUpdate(
    { _id: patientId },
    { $set: { "deviIds.$[elem].montant": montant } },

    { arrayFilters: [{ "elem.deviId": devi._id }], new: true }
  );
  if (!updatedPatient)
    return res.status(404).send("Failed to update patient with devi montant.");
  // i want to update only the cin nom prenom isMasculin telephone regionId provinceId of patient if newPatient is different from patientId
  updatedPatient.cin = newPatient.cin;
  updatedPatient.nom = newPatient.nom;
  updatedPatient.prenom = newPatient.prenom;
  updatedPatient.isMasculin = newPatient.isMasculin;
  updatedPatient.telephone = newPatient.telephone;
  updatedPatient.regionId = newPatient.regionId
    ? newPatient.regionId
    : updatedPatient.regionId;
  updatedPatient.provinceId = newPatient.provinceId
    ? newPatient.provinceId
    : updatedPatient.provinceId;

  updatedPatient.calculateTotalDevis();
  updatedPatient.calculateBalance();
  await updatedPatient.save();
  res.send(devi);
});

router.get("/:id", async (req, res) => {
  const devi = await Devi.findById(req.params.id)
    .populate({
      path: "medecinId",
    })
    .populate({
      path: "patientId",
    })
    .populate([
      {
        path: "acteEffectues",
        populate: { path: "dentIds" },
      },
      {
        path: "acteEffectues",
        populate: {
          path: "acteId",
          populate: {
            path: "natureId",
            select: "nom",
          },
        },
      },
    ]);

  if (!devi) return res.status(404).send("le devi avec cet id n'existe pas");
  res.send(devi);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const devi = await Devi.findOneAndDelete({ _id: req.params.id });
  if (!devi) return res.status(404).send("le devi avec cet id n'existe pas");
  if (devi.images) deleteImages(devi.images);
  try {
    await Patient.updateOne(
      { _id: devi.patientId },
      {
        $pull: { deviIds: { deviId: devi._id } },
      }
    );
    const updatedPatient = await Patient.findById(devi.patientId);

    updatedPatient.calculateTotalDevis();
    updatedPatient.calculateBalance();
    // delete deviId from rdv
    if (devi.rdvIds && devi.rdvIds.length !== 0) {
      let i = 0;
      while (i < devi.rdvIds.length) {
        const rdv = await Rdv.findById(devi.rdvIds[i]);
        if (!rdv) return res.status(400).send("Rdv Invalide.");
        rdv.deviId = null;
        await rdv.save();
        i++;
      }
    }
    await updatedPatient.save();
  } catch (error) {
    return res.status(500).send("An error occurred");
  }

  res.send(devi);
});

module.exports = router;

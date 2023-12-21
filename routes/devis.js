const express = require("express");
const { Devi } = require("../models/devi");

const { Patient } = require("../models/patient");
const { Medecin } = require("../models/medecin");
const { Cabinet } = require("../models/cabinet");
const { ActeDentaire } = require("../models/acteDentaire");
const { Dent } = require("../models/dent");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const devis = await Devi.find()
    .populate("medecinId")
    .populate("cabinetId")
    .populate({
      path: "medecinId",
    })
    .populate({
      path: "patientId",
    })

    .sort("numOrdre");
  res.send(devis);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.devi(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const {
    numOrdre,
    patientId,
    medecinId,
    cabinetId,
    dateDevi,
    prix,
    acteEffectues,
  } = req.body;

  // validation to delete if sure they are called just before

  const patient = await Patient.findById(patientId).populate("adherenceId");
  if (!patient) return res.status(400).send("Patient Invalide.");

  const medecin = await Medecin.findById(medecinId);
  if (!medecin) return res.status(400).send("Medecin Invalide.");

  const cabinet = await Cabinet.findById(cabinetId);
  if (!cabinet) return res.status(400).send("Cabinet Invalide.");
  //search in array

  // validations

  let i = 0;
  let j = 0;
  while (i < acteEffectues.length) {
    if (acteEffectues[i]) {
      const acteDentaire = await ActeDentaire.findById(acteEffectues[i].acteId);
      if (!acteDentaire) return res.status(400).send("acte Invalide.");
    }

    if (acteEffectues[i].dentIds && acteEffectues[i].dentIds.length !== 0)
      while (j < acteEffectues[i].dentIds.length) {
        const dent = await Dent.findById(acteEffectues[i].dentIds[j]);
        if (!dent) return res.status(400).send("Dent Invalide.");
        j++;
      }
    i++;
  }
  // calcule prix
  // const adherence = await Adherence.findById(patient.adherenceId);
  // if (adherence.nom === "A") adherence.nom = "FA";

  // let prixSoins = 0;
  // let prixProtheses = 0;

  // acteEffectues.map(async (acteItem) => {
  //   const acteDentaire = await ActeDentaire.findById(acteItem.acteId).populate(
  //     "natureId"
  //   );
  //   if (acteDentaire.natureId.nom === "Prothèses") {
  //     if (patient.adherenceId.nom === "A") patient.adherenceId.nom = "FA";
  //     prixProtheses += acteDentaire[patient.adherenceId.nom];
  //   } else {
  //     if (patient.adherenceId.nom === "A") patient.adherenceId.nom = "FA";
  //     prixSoins += acteDentaire[patient.adherenceId.nom];
  //   }
  //   return [prixSoins, prixProtheses];
  // });

  // let prix = 0;
  // for (let i = 0; i < acteEffectues.length; i++) {
  //   const acteDentaire = await ActeDentaire.findById(acteEffectues[i].acteId);

  //   // if (acteEffectues[i].dentIds && acteEffectues[i].dentIds.length !== 0)
  //   prix += acteDentaire[adherence.nom];
  // }
  const devi = new Devi({
    numOrdre: numOrdre,
    patientId: patientId,
    medecinId: medecinId,
    cabinetId: cabinetId,
    dateDevi: dateDevi,
    acteEffectues: acteEffectues,
    prix: prix,
  });
  // add devi to patient model
  patient.deviIds.push({
    deviId: devi._id,
    montant: prix,
  });
  patient.totalDevis();
  patient.calculateBalance();
  await devi.save();
  await patient.save();
  res.send(devi);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.devi(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { numOrdre, patientId, medecinId, cabinetId, dateDevi, acteEffectues } =
    req.body;

  // validation to delete if sure they are called just before
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(400).send("Patient Invalide.");

  const medecin = await Medecin.findById(medecinId);
  if (!medecin) return res.status(400).send("Medecin Invalide.");

  if (cabinetId) {
    const cabinet = await Cabinet.findById(cabinetId);
    if (!cabinet) return res.status(400).send("Cabinet Invalide.");
  }

  // validations
  let i = 0;
  let j = 0;
  while (i < acteEffectues.length) {
    const acteDentaire = await ActeDentaire.findById(acteEffectues[i].acteId);
    if (!acteDentaire) return res.status(400).send("acte Invalide.");

    if (acteEffectues[i].dentIds && acteEffectues[i].dentIds.length != 0)
      while (j < acteEffectues[i].dentIds.length) {
        const dent = await Dent.findById(acteEffectues[i].dentIds[j]);
        if (!dent) return res.status(400).send("Dent Invalide.");
        j++;
      }
    i++;
  }

  /*  // calcule prix
  const adherence = await Adherence.findById(patient.adherenceId);
  if (adherence.nom == "A") adherence.nom = "FA";

  let prix = 0;
  for (let i = 0; i < acteEffectues.length; i++) {
    const acteDentaire = await ActeDentaire.findById(acteEffectues[i].acteId);

    if (acteEffectues[i].dentIds && acteEffectues[i].dentIds.length != 0)
      prix += acteDentaire[adherence.nom] * acteEffectues[i].dentIds.length;
    else prix += acteDentaire[adherence.nom];
  } */

  const devi = await Devi.findByIdAndUpdate(
    req.params.id,
    {
      numOrdre,
      patientId,
      medecinId,
      cabinetId,
      dateDevi,
      acteEffectues,
      prix,
    },
    {
      new: true,
    }
  );

  if (!devi) return res.status(404).send("le devi avec cet id n'existe pas");

  // add devi to patient model after checking existance
  if (!patient.deviIds.find((i) => (i.deviId = devi._id))) {
    patient.deviIds.push({ deviId: devi._id, montant: prix });
    // patient.totalDevis();
    // patient.calculateBalance();
  }

  await patient.save();
  res.send(devi);
});

router.get("/:id", async (req, res) => {
  const devi = await Devi.findById(req.params.id)
    .populate({
      path: "medecinId",
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
  const devi = await Devi.findByIdAndRemove(req.params.id);
  if (!devi) return res.status(404).send("le devi avec cet id n'existe pas");

  // delete devi from patient model
  const patient = await Patient.findById(devi.patientId);
  const devis = patient.deviIds;

  // search in patient.deviIds and check existance of id of devi
  devis.some((e, index) => {
    if (e.deviId == req.params.id) {
      devis.splice(index, 1);
      return true;
    }
  });

  patient.totalDevis();
  patient.calculateBalance();

  await patient.save();

  res.send(devi);
});

module.exports = router;

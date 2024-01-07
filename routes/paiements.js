const express = require("express");
const { Paiement } = require("../models/paiement");
const { Patient } = require("../models/patient");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const role = require("../middleware/role");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const paiements = await Paiement.find()
    .populate({
      path: "medecinId",
    })
    .populate({
      path: "patientId",
      select: "  nom prenom date",
    })
    .sort("date");
  // execte query updatePatientIds for each paiement
  // let x = 0;
  // paiements.forEach(async (paiement) => {
  //   let patient = await Patient.findById(paiement.patientId);

  //   patient.paiementIds.push({
  //     paiementId: paiement._id,
  //     montant: paiement.montant,
  //     isSoins:
  //       paiement.natureActeId.toString() === "60f354be6d8c59dee4852d22"
  //         ? false
  //         : true,
  //   });
  //   await patient.save();
  //   x += 1;
  //   console.log("done", x);
  // });

  res.send(paiements);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validations.paiement(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const {
    patientId,
    numOrdre,
    numCheque,
    mode,
    date,
    montant,
    // isSoins,
  } = req.body;

  // validation to delete if sure they are called just before
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(400).send("Patient Invalide.");

  const paiement = new Paiement({
    patientId: patientId,
    numOrdre: numOrdre,
    mode: mode,
    numCheque: numCheque,
    date: date,
    montant: montant,
  });

  // add paiement to patient model

  patient.paiementIds.push({
    paiementId: paiement._id,
    montant: montant,
  });
  patient.totalPaiements();
  patient.calculateBalance();

  await patient.save();
  await paiement.save();
  res.send(paiement);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validations.paiement(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { patientId, numOrdre, mode, numCheque, natureActeId, date, montant } =
    req.body;

  // validation to delete if sure they are called just before
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(400).send("Patient Invalide.");

  const paiement = await Paiement.findByIdAndUpdate(
    req.params.id,
    {
      patientId: patientId,
      numOrdre: numOrdre,
      mode: mode,
      numCheque: numCheque,
      date: date,
      montant: montant,
    },
    {
      new: true,
    }
  );

  if (!paiement)
    return res.status(404).send("le paiement avec cet id n'existe pas");

  // add paiement to patient model after checking its existance
  if (!patient.paiementIds.find((i) => (i = paiement._id))) {
    patient.paiementIds.push({
      paiementId: paiement._id,
      montant: montant,
    });

    patient.totalPaiements();
    patient.calculateBalance();
  }
  await patient.save();
  res.send(paiement);
});

router.get("/:id", async (req, res) => {
  const paiement = await Paiement.findById(req.params.id);
  if (!paiement)
    return res.status(404).send("le paiement avec cet id n'existe pas");
  res.send(paiement);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const paiement = await Paiement.findByIdAndRemove(req.params.id);
  if (!paiement)
    return res.status(404).send("le paiement avec cet id n'existe pas");

  try {
    await Patient.findByIdAndUpdate(paiement.patientId, {
      $pull: { deviIds: { deviId: paiement._id } },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("An error occurred");
  }
  res.send(paiement);
});

module.exports = router;

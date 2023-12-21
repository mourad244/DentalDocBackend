const express = require("express");
const { Paiement } = require("../models/paiement");
const { Patient } = require("../models/patient");

const { NatureActe } = require("../models/natureActe");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const role = require("../middleware/role");

const validations = require("../startup/validations");
const router = express.Router();

router.get("/", async (req, res) => {
  const paiements = await Paiement.find()
    .populate("cabinetId")
    .populate({
      path: "medecinId",
     
    })
    .populate({
      path: "patientId",
      select: "  nom prenom dateRecu",
    })
    .populate("natureActeId")
    .sort("datePaiement");
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
    numRecu,
    modePaiement,
    numCheque,
    datePaiement,
    natureActeId,
    montant,
    // isSoins,
  } = req.body;

  // validation to delete if sure they are called just before
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(400).send("Patient Invalide.");


  const paiement = new Paiement({
    patientId: patientId,
    numRecu: numRecu,
    modePaiement: modePaiement,
    numCheque: numCheque,
    datePaiement: datePaiement,
    natureActeId: natureActeId,
    montant: montant,
  });

  // add paiement to patient model

  patient.paiementIds.push({
    paiementId: paiement._id,
    montant: montant,
    natureActeId: natureActeId,
    isSoins: isSoins,
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

  const {
    patientId,
    numRecu,
    modePaiement,
    numCheque,
    natureActeId,
    datePaiement,
    montant,
  } = req.body;

  // validation to delete if sure they are called just before
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(400).send("Patient Invalide.");

  const paiement = await Paiement.findByIdAndUpdate(
    req.params.id,
    {
      patientId: patientId,
      numRecu: numRecu,
      modePaiement: modePaiement,
      numCheque: numCheque,
      natureActeId: natureActeId,
      datePaiement: datePaiement,
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
      natureActeId: natureActeId,
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

  // delete paiement from patient model

  const patient = await Patient.findById(paiement.patientId);
  const paiements = patient.paiementIds;
  // search in patient.paiementIds and check the existance of Id of paiement
  paiements.some((e, index) => {
    if (e.paiementId == req.params.id) {
      paiements.splice(index, 1);
      return true;
    }
  });

  patient.totalPaiements();

  await patient.save();

  res.send(paiement);
});

module.exports = router;

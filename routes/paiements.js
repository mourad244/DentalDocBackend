const express = require("express");

const { Paiement } = require("../models/paiement");
const { Patient } = require("../models/patient");
const { CounterPaiement } = require("../models/counterPaiement");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validations = require("../startup/validations");

const router = express.Router();

router.get("/", async (req, res) => {
  const paiements = await Paiement.find()

    .populate({
      path: "patientId",
      select: "  nom prenom date",
    })
    .sort("numOrdre");
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

router.post("/", [auth /* admin */], async (req, res) => {
  const { error } = validations.paiement(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { patientId, numCheque, mode, date, montant } = req.body;

  const currentYear = new Date(date).getFullYear();
  let counter = await CounterPaiement.findOne({ year: currentYear });
  if (!counter) {
    counter = new CounterPaiement({
      lastNumOrdre: 0,
      year: currentYear,
    });
  }
  counter.lastNumOrdre += 1;
  const numOrdre = counter.lastNumOrdre;
  // validation to delete if sure they are called just before
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(400).send("Patient Invalide.");
  const paiement = new Paiement({
    numOrdre,
    patientId,
    mode,
    numCheque,
    date,
    montant,
  });

  patient.paiementIds.push({
    paiementId: paiement._id,
    montant: montant,
  });

  patient.calculateTotalPaiements();
  patient.calculateBalance();

  await counter.save();
  await paiement.save();
  await patient.save();
  res.send(paiement);
});

router.put("/:id", [auth /* admin */], async (req, res) => {
  const { error } = validations.paiement(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { patientId, numOrdre, mode, numCheque, date, montant } = req.body;

  // validation to delete if sure they are called just before
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(400).send("Patient Invalide.");

  const paiement = await Paiement.findByIdAndUpdate(
    req.params.id,
    {
      numOrdre,
      patientId,
      mode,
      numCheque,
      date,
      montant,
    },
    {
      new: true,
    }
  );

  if (!paiement)
    return res.status(404).send("le paiement avec cet id n'existe pas");

  const updatePatient = await Patient.findOneAndUpdate(
    { _id: patientId },
    { $set: { "paiementIds.$[elem].montant": montant } },
    { arrayFilters: [{ "elem.paiementId": paiement._id }], new: true }
  );

  if (!updatePatient)
    return res.status(404).send("le patient avec cet id n'existe pas");

  updatePatient.calculateTotalPaiements();
  updatePatient.calculateBalance();
  await updatePatient.save();
  res.send(paiement);
});

router.get("/:id", async (req, res) => {
  const paiement = await Paiement.findById(req.params.id).populate({
    path: "patientId",
  });
  if (!paiement)
    return res.status(404).send("le paiement avec cet id n'existe pas");
  res.send(paiement);
});

router.delete("/:id", [auth /* admin */], async (req, res) => {
  const paiement = await Paiement.findOneAndDelete({ _id: req.params.id });
  if (!paiement)
    return res.status(404).send("le paiement avec cet id n'existe pas");

  try {
    await Patient.updateOne(
      { _id: paiement.patientId },
      {
        $pull: { paiementIds: { paiementId: paiement._id } },
      }
    );
    const updatedPatient = await Patient.findById(paiement.patientId);
    updatedPatient.calculateTotalPaiements();
    updatedPatient.calculateBalance();
    await updatedPatient.save();
  } catch (error) {
    console.log(error);
    return res.status(500).send("An error occurred");
  }
  res.send(paiement);
});

module.exports = router;

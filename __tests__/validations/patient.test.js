const Joi = require("joi");
const mongoose = require("mongoose");
const { patient } = require("../../startup/validations");

// Mocking the custom objectId validation
const objectId = () => {
  return Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }, "ObjectId Validation");
};

Joi.objectId = objectId;

describe("Patient Validation", () => {
  it("should validate a patient with valid data", () => {
    const validPatient = {
      nom: "Doe",
      prenom: "John",
      cin: "123456",
      isMasculin: true,
      dateRecu: "2023-01-01",
      numOrdre: 1,
      historiqueMedecins: [],
      numDossier: "123",
      profession: "Engineer",
      dateNaissance: "1980-01-01",
      images: [],
      imagesDeletedIndex: [],
      telephone: "1234567890",
      ville: "City",
      provinceId: new mongoose.Types.ObjectId().toString(),
      regionId: new mongoose.Types.ObjectId().toString(),
      prochainRdv: { date: "2023-06-01" },
      couvertureId: new mongoose.Types.ObjectId().toString(),
      medicamentIds: [],
      pathologieIds: [],
      allergieIds: [],
      detailCouvertureId: new mongoose.Types.ObjectId().toString(),
      dateDerniereVisite: "2023-05-01",
      deviIds: [],
      paiementIds: [],
      report: {},
      montantAPayer: 100,
      montantPaye: 50,
      balance: 50,
    };

    const { error } = patient(validPatient);
    expect(error).toBeUndefined();
  });

  it("should return an error if required fields are missing", () => {
    const invalidPatient = {
      prenom: "John",
    };

    const { error } = patient(invalidPatient);
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('"nom" is required');
  });

  it("should return an error if fields have incorrect types", () => {
    const invalidPatient = {
      nom: "Doe",
      prenom: "John",
      isMasculin: "not-a-boolean", // should be a boolean
    };

    const { error } = patient(invalidPatient);
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain(
      '"isMasculin" must be a boolean'
    );
  });

  it("should return an error if ObjectId fields have invalid values", () => {
    const invalidPatient = {
      nom: "Doe",
      prenom: "John",
      provinceId: "invalid-object-id",
    };

    const { error } = patient(invalidPatient);
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain(
      '"provinceId" contains an invalid value'
    );
  });

  // Add more tests as needed for other validation rules
});

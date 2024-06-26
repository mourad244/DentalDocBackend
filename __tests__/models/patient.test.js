const mongoose = require("mongoose");
const { Patient } = require("../../models/patient");

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/dentaldoc-test");
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Patient Model Test", () => {
  it("should validate a patient with required fields", async () => {
    const patient = new Patient({ nom: "Doe", prenom: "John" });
    const savedPatient = await patient.save();
    expect(savedPatient._id).toBeDefined();
    expect(savedPatient.nom).toBe("Doe");
    expect(savedPatient.prenom).toBe("John");
  });

  it("should throw validation errors for missing required fields", async () => {
    const patient = new Patient({});
    let err;
    try {
      await patient.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.nom).toBeDefined();
    expect(err.errors.prenom).toBeDefined();
  });

  it("should enforce maxlength constraints", async () => {
    const longName = "a".repeat(51);
    const patient = new Patient({ nom: longName, prenom: "John" });
    let err;
    try {
      await patient.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.nom).toBeDefined();
  });

  it("should calculate total devis correctly", async () => {
    const patient = new Patient({
      nom: "Doe",
      prenom: "John",
      deviIds: [{ montant: 100 }, { montant: 200 }, { montant: 300 }],
    });
    patient.calculateTotalDevis();
    expect(patient.totalDevis).toBe(600);
  });

  it("should calculate total paiements correctly", async () => {
    const patient = new Patient({
      nom: "Doe",
      prenom: "John",
      paiementIds: [{ montant: 50 }, { montant: 150 }],
    });
    patient.calculateTotalPaiements();
    expect(patient.totalPaiements).toBe(200);
  });

  it("should calculate balance correctly", async () => {
    const patient = new Patient({
      nom: "Doe",
      prenom: "John",
      deviIds: [{ montant: 500 }],
      paiementIds: [{ montant: 200 }],
    });
    patient.calculateTotalDevis();
    patient.calculateTotalPaiements();
    patient.calculateBalance();
    expect(patient.balance).toBe(300);
  });

  describe("Patient Model Static Methods", () => {
    it("should find patients by profession", async () => {
      const patientsData = [
        { nom: "Doe", prenom: "John", profession: "Engineer" },
        { nom: "Smith", prenom: "Jane", profession: "Doctor" },
        { nom: "Johnson", prenom: "Mike", profession: "Engineer" },
      ];

      await Patient.insertMany(patientsData);

      const engineers = await Patient.findByProfession("Engineer");
      expect(engineers.length).toBe(2);
      expect(engineers[0].profession).toBe("Engineer");
      expect(engineers[1].profession).toBe("Engineer");
    });

    // Add more tests for other static methods if any
  });

  describe("Patient Model Virtual Properties", () => {
    it("should return full name as a virtual property", async () => {
      const patient = new Patient({
        nom: "Doe",
        prenom: "John",
      });
      await patient.save();

      const savedPatient = await Patient.findById(patient._id);
      expect(savedPatient.fullName).toBe("John Doe");
    });
  });
});

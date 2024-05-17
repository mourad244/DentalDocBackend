const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { Patient } = require("../../models/patient");
const patientsRoute = require("../../routes/patients");

const app = express();
app.use(express.json());
app.use("/dentaldoc/patients", patientsRoute);

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/dentaldoc-test");
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Patient.deleteMany({});
});
describe("Patients API Test", () => {
  let patientId;

  beforeEach(async () => {
    // Create a sample patient before each test
    const patient = new Patient({
      nom: "Doe",
      prenom: "John",
      cin: "123456",
      telephone: "123456789",
    });
    await patient.save();
    patientId = patient._id;
  });

  afterEach(async () => {
    // Clean up the database after each test
    await Patient.deleteMany({});
  });

  it("should fetch all patients", async () => {
    const res = await request(app).get("/dentaldoc/patients");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
    expect(res.body[0].nom).toBe("Doe");
  });

  it("should create a new patient", async () => {
    const res = await request(app).post("/dentaldoc/patients").send({
      nom: "Smith",
      prenom: "Jane",
      cin: "654321",
      telephone: "987654321",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe("Smith");
    expect(res.body.prenom).toBe("Jane");
  });

  it("should update a patient by ID", async () => {
    const res = await request(app)
      .put(`/dentaldoc/patients/${patientId}`)
      .send({
        nom: "UpdatedName",
        prenom: "UpdatedPrenom",
      });
    expect(res.statusCode).toBe(200);
    const updatedPatient = await Patient.findById(patientId);
    expect(updatedPatient.nom).toBe("UpdatedName");
    expect(updatedPatient.prenom).toBe("UpdatedPrenom");
  });

  it("should fetch a patient by ID", async () => {
    const res = await request(app).get(`/dentaldoc/patients/${patientId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe("Doe");
    expect(res.body.prenom).toBe("John");
  });

  it("should delete a patient by ID", async () => {
    const res = await request(app).delete(`/dentaldoc/patients/${patientId}`);
    expect(res.statusCode).toBe(200);
    const deletedPatient = await Patient.findById(patientId);
    expect(deletedPatient).toBeNull();
  });
});

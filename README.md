# Dental Management System - Backend

This repository contains the backend API for **DentalDoc**, a comprehensive dental management system designed to streamline clinic operations, such as managing appointments, dental procedures, payments, and inventory.

## Demonstration

### **Key Features**

- **CRUD Operations**: Manage patients, appointments, dental procedures, and inventory.
- **Authentication**: Secure login and token-based authentication using **JWT**.
- **Real-Time Updates**: Enables seamless communication between the frontend and backend.
- **Scalable API Architecture**: Built to handle complex data workflows efficiently.

### **Technologies Used**

- **Node.js**: JavaScript runtime for the server.
- **Express.js**: Web framework for building the RESTful API.
- **MongoDB**: NoSQL database for storing clinic data.
- **Mongoose**: ODM for MongoDB schema design and validation.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Nginx**: Reverse proxy for deployment with HTTPS support.

## Project Setup

Follow the steps below to set up the project locally:

### **1. Clone the Repository**

```bash
git clone [Backend GitHub URL]
cd DentalDocBackend
npm install
```

### **2. Set Up Environment Variables**

Create a `.env` file in the root directory and add the following environment variables:

```bash
MONGODB_URI=   # MongoDB connection string
REQUIRE_AUTH=    # Enable/disable authentication
JWT_PRIVATE_KEY=   # JWT secret key
```

### **3. Start the Server**

```bash
npm start
```

the server will start on `http://localhost:3900`.

## API Endpoints

The API provides the following endpoints for managing clinic data:

### **1. Patients**

- **GET /api/patients**: Get all patients.
- **GET /api/patients/:id**: Get a patient by ID.
- **POST /api/patients**: Add a new patient.
- **PUT /api/patients/:id**: Update a patient by ID.
- **DELETE /api/patients/:id**: Delete a patient by ID.

### **2. Appointments**

- **GET /api/rdvs**: Get all appointements.
- **GET /api/rdvs/:id**: Get an appointment by ID.
- **POST /api/rdvs**: Add a new appointment.
- **PUT /api/rdvs/:id**: Update an appointment by ID.
- **DELETE /api/rdvs/:id**: Delete an appointment by ID.

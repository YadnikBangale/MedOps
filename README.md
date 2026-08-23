# MedOps — Hospital Management System

MedOps is a full-stack hospital management system designed to streamline interactions between administrators, doctors, and patients through a secure and centralized platform.

The application manages the complete healthcare workflow, from patient registration and appointment scheduling to doctor consultations, queue management, and medical records.

---

## Overview

MedOps is built around three primary roles:

- Admin
- Doctor
- Patient

Each role has a dedicated workflow and access to functionality based on its responsibilities.

The complete healthcare workflow is:

```text
Patient Registration
        |
        v
Doctor Selection
        |
        v
Appointment Booking
        |
        v
Queue Management
        |
        v
Doctor Consultation
        |
        v
Appointment Completion
        |
        v
Medical Record
        |
        v
Patient Medical History
```

The system connects each stage of the workflow to the corresponding patient, doctor, and appointment.

---

# Application Workflow

## 1. Authentication

When users open MedOps, they are presented with a secure authentication interface.

Users can:

- Register an account
- Log in using email and password
- Access functionality according to their role
- Log out securely

After successful authentication, the system identifies whether the user is an Admin, Doctor, or Patient and redirects them to the appropriate dashboard.

```text
                    Login
                      |
             +--------+--------+
             |        |        |
             v        v        v
           Admin    Doctor   Patient
             |        |        |
             v        v        v
         Dashboard Dashboard Dashboard
```

---

# 2. Admin Dashboard

The Admin dashboard provides an overview of hospital operations.

The administrator can manage:

- Doctors
- Patients
- Departments
- Appointments
- Queue information
- Hospital operations

A typical dashboard provides an overview of hospital activity:

```text
+-------------------------------------------------------+
|                    ADMIN DASHBOARD                    |
+-------------------------------------------------------+
|                                                       |
|  Doctors       Patients       Departments             |
|    24            850              12                 |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|              Today's Appointments                     |
|                                                       |
|  09:00   Dr. Sharma      Patient A     Scheduled     |
|  10:30   Dr. Patel       Patient B     Completed     |
|  11:30   Dr. Shah        Patient C     Waiting       |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|              Hospital Activity                        |
|                                                       |
|  Active Doctors       Today's Appointments            |
|       18                     42                       |
|                                                       |
+-------------------------------------------------------+
```

The administrator can also create and manage departments and associate doctors with the appropriate department.

---

# 3. Doctor Dashboard

After logging in, doctors are taken to their personal dashboard.

The dashboard provides information about:

- Today's appointments
- Upcoming appointments
- Current patient queue
- Completed consultations
- Patient medical history

Example:

```text
+-------------------------------------------------------+
|                   DOCTOR DASHBOARD                    |
+-------------------------------------------------------+
| Dr. Rahul Sharma                                      |
| Cardiology                                            |
+-------------------------------------------------------+
|                                                       |
| Today's Appointments                                  |
|                                                       |
| 10:00  Patient A     Scheduled                        |
| 10:30  Patient B     In Consultation                 |
| 11:00  Patient C     Waiting                          |
|                                                       |
+-------------------------------------------------------+
|                                                       |
| Current Queue                                         |
|                                                       |
| #1   Patient A        Completed                       |
| #2   Patient B        In Consultation                |
| #3   Patient C        Waiting                         |
| #4   Patient D        Waiting                         |
|                                                       |
+-------------------------------------------------------+
```

Doctors can select a patient from their appointments or queue and access the information required for the consultation.

---

# 4. Patient Dashboard

Patients receive a personalized dashboard after login.

The dashboard provides:

- Upcoming appointments
- Appointment history
- Current queue status
- Doctor information
- Medical records
- Prescriptions
- Diagnoses

Example:

```text
+-------------------------------------------------------+
|                  PATIENT DASHBOARD                    |
+-------------------------------------------------------+
| Welcome, Test Patient                                 |
+-------------------------------------------------------+
|                                                       |
| Upcoming Appointment                                  |
|                                                       |
| Doctor: Dr. Rahul Sharma                              |
| Department: Cardiology                                |
| Date: 26 August 2026                                  |
| Time: 11:30 AM                                        |
| Status: Scheduled                                     |
|                                                       |
+-------------------------------------------------------+
|                                                       |
| Queue Status                                          |
|                                                       |
| Your Queue Number: 4                                  |
| Patients Before You: 2                                |
| Status: Waiting                                       |
|                                                       |
+-------------------------------------------------------+
|                                                       |
| Medical History                                       |
| Previous consultations and medical records            |
|                                                       |
+-------------------------------------------------------+
```

---

# 5. Department Management

Administrators can manage hospital departments.

Each department contains information such as:

```text
Department
    |
    +-- Name
    +-- Location
    +-- Doctors
```

Example:

```text
Cardiology
Block B - Floor 3

Doctors:
- Dr. Rahul Sharma
- Dr. Amit Patel
```

Departments allow doctors to be organized according to their medical specialization.

---

# 6. Doctor Management

Administrators can create and manage doctor profiles.

A doctor profile contains:

```text
Doctor
 |
 +-- Name
 +-- Email
 +-- Department
 +-- Specialization
 +-- License Number
 +-- Experience
 +-- Consultation Fee
 +-- Availability
```

Example:

```text
Dr. Rahul Sharma

Department:
Cardiology

Specialization:
Cardiac Electrophysiology

Experience:
8 years

License:
MED-12345

Consultation Fee:
₹1000

Availability:
Available
```

---

# 7. Patient Management

Patients maintain their own profiles containing:

- Date of birth
- Gender
- Blood group
- Phone number
- Address

Example:

```text
Patient Profile

Name:
Test Patient

Date of Birth:
10 May 2002

Gender:
Male

Blood Group:
O+

Phone:
9999999999

Address:
Nagpur, Maharashtra
```

Patients can update their profile whenever required.

---

# 8. Appointment Booking

Patients can browse available doctors and book an appointment.

The appointment form contains:

```text
Doctor
Appointment Date
Appointment Time
Reason for Visit
```

Example:

```text
Doctor:
Dr. Rahul Sharma

Department:
Cardiology

Date:
26 August 2026

Time:
11:30 AM

Reason:
Follow-up consultation
```

After booking:

```text
Appointment Created
        |
        v
Status: Scheduled
```

The system prevents a doctor from being booked by multiple patients for the same date and time.

---

# 9. Appointment Management

Appointments follow a controlled lifecycle.

```text
                 Scheduled
                /         \
               /           \
              v             v
        Cancelled        Completed
                              |
                              v
                       Medical Record
```

Patients can:

- View appointments
- Cancel scheduled appointments

Doctors can:

- View assigned appointments
- Complete consultations
- Access the patient's information

---

# 10. Queue Management

Queue management handles patients waiting for consultation.

After an appointment enters the queue, patients receive a queue number.

Example:

```text
+-------------------------------------------+
|              CARDIOLOGY QUEUE             |
+-------------------------------------------+
|                                           |
|  #1   Patient A       Completed           |
|  #2   Patient B       In Consultation    |
|  #3   Patient C       Waiting             |
|  #4   Patient D       Waiting             |
|  #5   Patient E       Waiting             |
|                                           |
+-------------------------------------------+
```

The queue follows:

```text
Waiting
   |
   v
In Consultation
   |
   v
Completed
```

A cancelled appointment can also be removed from the active queue.

The queue is associated with:

- Patient
- Doctor
- Appointment
- Queue number
- Queue date
- Queue status

---

# 11. Doctor Consultation

When the doctor starts a consultation, the queue status changes:

```text
Waiting
   |
   v
In Consultation
```

The doctor can review the patient's relevant information before completing the consultation.

After the consultation:

```text
In Consultation
        |
        v
    Completed
```

The completed appointment can then be used to create a medical record.

---

# 12. Medical Records

Medical records store the result of a completed consultation.

A record contains:

```text
Medical Record
 |
 +-- Patient
 +-- Doctor
 +-- Appointment
 +-- Symptoms
 +-- Diagnosis
 +-- Prescription
 +-- Notes
```

Example:

```text
Patient:
Test Patient

Doctor:
Dr. Rahul Sharma

Symptoms:
Occasional chest discomfort and palpitations

Diagnosis:
Cardiac arrhythmia

Prescription:
Continue prescribed medication and monitor symptoms

Notes:
Follow-up consultation required after two weeks
```

A medical record can only be created for a completed appointment.

The system also prevents multiple medical records from being created for the same appointment.

---

# 13. Patient Medical History

Patients can access their previous medical records from their dashboard.

Example:

```text
Medical History

--------------------------------------------------
26 August 2026
Dr. Rahul Sharma
Cardiology

Diagnosis:
Cardiac arrhythmia

Prescription:
Continue prescribed medication

Notes:
Follow-up after two weeks
--------------------------------------------------
```

This provides the patient with a centralized history of previous consultations.

---

# 14. Doctor Patient History

Doctors can access the medical history of patients associated with their consultations.

This allows doctors to review previous:

- Symptoms
- Diagnoses
- Prescriptions
- Consultation notes

before or during future consultations.

---

# 15. Role-Based Access

MedOps uses role-based authorization to control access to resources.

```text
                         MedOps
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
        Admin            Doctor           Patient
          |                |                |
          v                v                v
     Management       Consultation       Healthcare
     Operations       & Records          Access
```

### Admin

Can manage:

- Doctors
- Patients
- Departments
- Hospital operations

### Doctor

Can manage:

- Assigned appointments
- Consultations
- Patient medical records
- Queue

### Patient

Can manage:

- Personal profile
- Appointments
- Queue status
- Medical history

---

# System Architecture

```text
                    +----------------------+
                    |       React UI       |
                    +----------+-----------+
                               |
                               | REST API
                               v
                    +----------------------+
                    |    Node.js/Express   |
                    +----------+-----------+
                               |
             +-----------------+------------------+
             |                 |                  |
             v                 v                  v
      Authentication       Controllers        Middleware
             |                 |                  |
             +-----------------+------------------+
                               |
                               v
                         +-----------+
                         | Mongoose  |
                         +-----+-----+
                               |
                               v
                         +-----------+
                         |  MongoDB  |
                         +-----------+
```

---

# Database Architecture

```text
                         User
                       /      \
                      /        \
                     v          v
                 Patient      Doctor
                    |            |
                    |            +------> Department
                    |
                    v
               Appointment
                    |
             +------+------+
             |             |
             v             v
           Queue      Medical Record
```

---

# Technology Stack

### Frontend

<p>
  <img src="https://skillicons.dev/icons?i=react,vite,html,css,js" />
</p>

### Backend

<p>
  <img src="https://skillicons.dev/icons?i=nodejs,express" />
</p>

### Database

<p>
  <img src="https://skillicons.dev/icons?i=mongodb" />
</p>

### Authentication & Security

- JWT
- bcrypt
- Role-Based Access Control

### Development Tools

<p>
  <img src="https://skillicons.dev/icons?i=git,github,postman,vscode" />
</p>

---

# Project Structure

```text
MedOps/
|
+-- client/
|   +-- public/
|   +-- src/
|       +-- components/
|       +-- pages/
|       +-- services/
|       +-- assets/
|       +-- App.jsx
|       +-- App.css
|       +-- index.css
|       +-- main.jsx
|
+-- server/
|   |
|   +-- config/
|   |   +-- db.js
|   |
|   +-- controllers/
|   |   +-- appointmentController.js
|   |   +-- authController.js
|   |   +-- departmentController.js
|   |   +-- doctorController.js
|   |   +-- medicalRecordController.js
|   |   +-- patientController.js
|   |   +-- queueController.js
|   |
|   +-- middleware/
|   |   +-- authMiddleware.js
|   |   +-- roleMiddleware.js
|   |
|   +-- models/
|   |   +-- Appointment.js
|   |   +-- Department.js
|   |   +-- Doctor.js
|   |   +-- MedicalRecord.js
|   |   +-- Patient.js
|   |   +-- Queue.js
|   |   +-- User.js
|   |
|   +-- routes/
|       +-- appointmentRoutes.js
|       +-- authRoutes.js
|       +-- departmentRoutes.js
|       +-- doctorRoutes.js
|       +-- medicalRecordRoutes.js
|       +-- patientRoutes.js
|       +-- queueRoutes.js
|
+-- .gitignore
+-- package.json
+-- package-lock.json
+-- README.md
```

---

# Security

MedOps implements:

- JWT-based authentication
- Password hashing using bcrypt
- Role-based authorization
- Protected API routes
- Patient ownership validation
- Doctor ownership validation
- Appointment ownership validation
- Duplicate appointment prevention
- Duplicate medical record prevention
- Environment variables for sensitive configuration
- `.env` excluded from version control

---

# API Overview

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

## Departments

```http
POST /api/departments
GET  /api/departments
```

## Doctors

```http
POST /api/doctors
GET  /api/doctors
PUT  /api/doctors/:id
```

## Patients

```http
POST /api/patients
GET  /api/patients/me
PUT  /api/patients/me
GET  /api/patients
```

## Appointments

```http
POST   /api/appointments
GET    /api/appointments/my
GET    /api/appointments/doctor
DELETE /api/appointments/:id
PATCH  /api/appointments/:id/complete
```

## Medical Records

```http
POST /api/medical-records
GET  /api/medical-records/my
GET  /api/medical-records/patient/:patientId
```

## Queue

```http
POST  /api/queue
GET   /api/queue/doctor
PATCH /api/queue/:id/start
PATCH /api/queue/:id/complete
PATCH /api/queue/:id/cancel
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/YadnikBangale/MedOps.git
cd MedOps
```

## Install Backend Dependencies

```bash
cd server
npm install
```

## Install Frontend Dependencies

```bash
cd ../client
npm install
```

## Configure Environment Variables

Create:

```text
server/.env
```

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Never commit the `.env` file to GitHub.

---

# Running the Application

## Start Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Testing

The API can be tested using:

- Postman
- VS Code REST Client
- `server/api-tests.http`

Testing covers:

- User registration
- User login
- JWT authentication
- Role authorization
- Doctor management
- Patient management
- Department management
- Appointment booking
- Appointment cancellation
- Appointment completion
- Queue management
- Medical record creation
- Medical record retrieval

---

# Complete Hospital Workflow

```text
                    +-------------+
                    |    Admin    |
                    +------+------+
                           |
             Manage Doctors & Departments
                           |
                           v
+-------------+      +-------------+
|   Patient   |----->| Appointment |
+------+------+      +------+------+
       |                    |
       |                    v
       |              +-----------+
       |              |   Queue   |
       |              +-----+-----+
       |                    |
       |                    v
       |              +-----------+
       +------------->|  Doctor   |
                      +-----+-----+
                            |
                      Consultation
                            |
                            v
                   +----------------+
                   | Medical Record |
                   +-------+--------+
                           |
                           v
                    Patient History
```

---

# Future Enhancements

- Real-time queue updates using WebSockets
- Email and SMS appointment reminders
- Prescription PDF generation
- Online consultation
- Payment integration
- Advanced hospital analytics
- Advanced search and filtering
- Audit logs
- Cloud deployment
- Automated database backups
- AI-assisted clinical decision support

---

# Author

## Yadnik Bangale

Computer Science and Engineering Student

GitHub:

https://github.com/YadnikBangale/MedOps

---

# License

This project is developed for educational and portfolio purposes.

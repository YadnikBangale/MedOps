# MedOps — Hospital Management System

MedOps is a full-stack hospital management system designed to streamline interactions between administrators, doctors, and patients through a secure and centralized platform.

The system manages the complete healthcare workflow, from patient registration and appointment scheduling to doctor consultations, medical records, and queue management.

---

## Features

### Authentication & Authorization

- Secure user registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Role-based authorization
- Separate workflows for:
  - Admin
  - Doctor
  - Patient

### Department Management

Administrators can manage hospital departments.

- Create departments
- View departments
- Update department information
- Associate doctors with departments
- Store department location

### Doctor Management

Manage complete doctor profiles including:

- Name and contact information
- Department
- Specialization
- Medical license number
- Years of experience
- Consultation fee
- Availability status

Doctors can manage their assigned appointments and patient medical records.

### Patient Management

Patients can:

- Create their patient profile
- Update personal information
- View their profile
- View appointments
- View medical history
- Access prescriptions and diagnoses

### Appointment Management

MedOps provides a complete appointment workflow.

Patients can:

- Book appointments
- View their appointments
- Cancel appointments

The system prevents:

- Duplicate bookings
- Booking unavailable doctors
- Unauthorized appointment access

Doctors can:

- View assigned appointments
- Complete consultations
- Update appointment status

### Appointment Lifecycle

```text
Scheduled
    |
    +----> Cancelled
    |
    +----> Completed

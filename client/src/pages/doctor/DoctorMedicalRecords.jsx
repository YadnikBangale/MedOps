import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const DoctorMedicalRecords = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const [error, setError] = useState("");

  const [printRecord, setPrintRecord] = useState(null);

  // --------------------------------------------------
  // Fetch doctor's appointments
  // --------------------------------------------------

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setError("");

        const token = localStorage.getItem("token");

        const response = await api.get("/appointments/doctor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppointments(response.data.appointments || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load doctor appointments",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // --------------------------------------------------
  // Get unique patients from appointments
  // --------------------------------------------------

  const getPatients = () => {
    const patientMap = new Map();

    appointments.forEach((appointment) => {
      if (appointment.patient?._id) {
        patientMap.set(appointment.patient._id, appointment.patient);
      }
    });

    return Array.from(patientMap.values());
  };

  // --------------------------------------------------
  // Fetch medical records for selected patient
  // --------------------------------------------------

  const handlePatientSelect = async (patient) => {
    try {
      setError("");
      setRecords([]);
      setSelectedPatient(patient);
      setRecordsLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get(
        `/medical-records/patient/${patient._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRecords(response.data.medicalRecords || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load medical records",
      );
    } finally {
      setRecordsLoading(false);
    }
  };

  // --------------------------------------------------
  // Print selected record
  // --------------------------------------------------

  const handlePrint = (record) => {
    setPrintRecord(record);
  };

  useEffect(() => {
    if (!printRecord) {
      return;
    }

    const handleAfterPrint = () => {
      setPrintRecord(null);
    };

    window.addEventListener("afterprint", handleAfterPrint);

    const timer = setTimeout(() => {
      window.print();
    }, 200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [printRecord]);

  // --------------------------------------------------
  // Loading screen
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const patients = getPatients();

  return (
    <>
      {/* ==================================================
          PRINT VERSION
      ================================================== */}

      {printRecord && (
        <div className="print-medical-record">
          {/* Header */}

          <div className="print-header">
            <div className="print-hospital-name">MedOps</div>

            <div className="print-hospital-subtitle">
              Hospital Management System
            </div>

            <div className="print-title">MEDICAL RECORD</div>
          </div>

          {/* Record information */}

          <div className="print-record-meta">
            <div>
              <span className="print-meta-label">Record Date</span>

              <span className="print-meta-value">
                {printRecord.createdAt
                  ? new Date(printRecord.createdAt).toLocaleDateString("en-GB")
                  : "N/A"}
              </span>
            </div>

            <div>
              <span className="print-meta-label">Record ID</span>

              <span className="print-meta-value">
                {printRecord._id ? printRecord._id : "N/A"}
              </span>
            </div>
          </div>

          {/* ==================================================
              PATIENT INFORMATION
          ================================================== */}

          <div className="print-section">
            <div className="print-section-title">Patient Information</div>

            <div className="print-info-box">
              <div className="print-info-item">
                <span className="print-label">Patient Name</span>

                <span className="print-value">
                  {selectedPatient?.user?.name ||
                    printRecord.patient?.user?.name ||
                    "N/A"}
                </span>
              </div>

              <div className="print-info-item">
                <span className="print-label">Email</span>

                <span className="print-value">
                  {selectedPatient?.user?.email ||
                    printRecord.patient?.user?.email ||
                    "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================
              DOCTOR INFORMATION
          ================================================== */}

          <div className="print-section">
            <div className="print-section-title">Doctor Information</div>

            <div className="print-info-box">
              <div className="print-info-item">
                <span className="print-label">Doctor</span>

                <span className="print-value">
                  Dr. {printRecord.doctor?.user?.name || "N/A"}
                </span>
              </div>

              <div className="print-info-item">
                <span className="print-label">Email</span>

                <span className="print-value">
                  {printRecord.doctor?.user?.email || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================
              APPOINTMENT INFORMATION
          ================================================== */}

          {printRecord.appointment && (
            <div className="print-section">
              <div className="print-section-title">Appointment Details</div>

              <div className="print-info-box">
                <div className="print-info-item">
                  <span className="print-label">Date</span>

                  <span className="print-value">
                    {printRecord.appointment.appointmentDate
                      ? new Date(
                          printRecord.appointment.appointmentDate,
                        ).toLocaleDateString("en-GB")
                      : "N/A"}
                  </span>
                </div>

                <div className="print-info-item">
                  <span className="print-label">Time</span>

                  <span className="print-value">
                    {printRecord.appointment.appointmentTime || "N/A"}
                  </span>
                </div>

                <div className="print-info-item">
                  <span className="print-label">Status</span>

                  <span className="print-value">
                    {printRecord.appointment.status || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              CLINICAL INFORMATION
          ================================================== */}

          <div className="print-section">
            <div className="print-section-title">Clinical Information</div>

            {/* Symptoms */}

            <div className="print-medical-field">
              <div className="print-medical-label">Symptoms</div>

              <div className="print-medical-value">
                {printRecord.symptoms || "No symptoms recorded."}
              </div>
            </div>

            {/* Diagnosis */}

            <div className="print-medical-field">
              <div className="print-medical-label">Diagnosis</div>

              <div className="print-medical-value">
                {printRecord.diagnosis || "No diagnosis recorded."}
              </div>
            </div>

            {/* Prescription */}

            <div className="print-medical-field">
              <div className="print-medical-label">Prescription</div>

              <div className="print-medical-value prescription">
                {printRecord.prescription || "No prescription recorded."}
              </div>
            </div>

            {/* Notes */}

            <div className="print-medical-field">
              <div className="print-medical-label">Notes</div>

              <div className="print-medical-value">
                {printRecord.notes || "No additional notes."}
              </div>
            </div>
          </div>

          {/* ==================================================
              SIGNATURE
          ================================================== */}

          <div className="print-signature-section">
            <div className="print-signature">
              <div className="print-signature-line"></div>

              <div className="print-signature-label">Doctor's Signature</div>
            </div>
          </div>

          {/* Footer */}

          <div className="print-footer">
            <div>MedOps Hospital Management System</div>

            <div>Confidential Medical Record</div>
          </div>
        </div>
      )}

      {/* ==================================================
          NORMAL APPLICATION
      ================================================== */}

      <div className="container-fluid min-vh-100 bg-light doctor-medical-records-page">
        <div className="row">
          {/* Sidebar */}

          <aside className="col-md-3 col-lg-2 bg-dark text-white min-vh-100 p-3">
            <h3 className="mb-4">MedOps</h3>

            <div className="nav flex-column">
              <Link to="/doctor" className="nav-link text-white">
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard
              </Link>

              <Link to="/doctor/queue" className="nav-link text-white">
                <i className="bi bi-list-ol me-2"></i>
                Queue
              </Link>

              <Link to="/doctor/appointments" className="nav-link text-white">
                <i className="bi bi-calendar-check me-2"></i>
                Appointments
              </Link>

              <Link
                to="/doctor/medical-records"
                className="nav-link text-white active"
              >
                <i className="bi bi-file-medical me-2"></i>
                Medical Records
              </Link>
            </div>
          </aside>

          {/* Main Content */}

          <main className="col-md-9 col-lg-10 p-4">
            {/* Header */}

            <div className="mb-4">
              <h2 className="fw-bold mb-1">Medical Records</h2>

              <p className="text-muted mb-0">
                View medical records of your patients
              </p>
            </div>

            {/* Error */}

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-4">
              {/* ==================================================
                  PATIENT LIST
              ================================================== */}

              <div className="col-lg-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">Patients</h5>

                    {patients.length === 0 ? (
                      <div className="text-center py-4">
                        <i className="bi bi-people fs-1 text-muted"></i>

                        <p className="text-muted mt-2 mb-0">
                          No patients found.
                        </p>
                      </div>
                    ) : (
                      <div className="list-group">
                        {patients.map((patient) => (
                          <button
                            key={patient._id}
                            type="button"
                            className={`list-group-item list-group-item-action ${
                              selectedPatient?._id === patient._id
                                ? "active"
                                : ""
                            }`}
                            onClick={() => handlePatientSelect(patient)}
                          >
                            <div className="fw-semibold">
                              {patient.user?.name || "Patient"}
                            </div>

                            <small
                              className={
                                selectedPatient?._id === patient._id
                                  ? "text-white-50"
                                  : "text-muted"
                              }
                            >
                              {patient.user?.email || "N/A"}
                            </small>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ==================================================
                  RECORDS
              ================================================== */}

              <div className="col-lg-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    {!selectedPatient ? (
                      <div className="text-center py-5">
                        <i className="bi bi-file-medical fs-1 text-muted"></i>

                        <h5 className="mt-3">Select a patient</h5>

                        <p className="text-muted mb-0">
                          Select a patient from the list to view their medical
                          records.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Patient Header */}

                        <div className="mb-4">
                          <h5 className="fw-bold mb-1">
                            {selectedPatient.user?.name || "Patient"}
                          </h5>

                          <p className="text-muted mb-0">
                            {selectedPatient.user?.email || "N/A"}
                          </p>
                        </div>

                        {/* Records Loading */}

                        {recordsLoading ? (
                          <div className="text-center py-5">
                            <div className="spinner-border text-primary">
                              <span className="visually-hidden">
                                Loading records...
                              </span>
                            </div>
                          </div>
                        ) : records.length === 0 ? (
                          <div className="text-center py-5">
                            <i className="bi bi-file-medical fs-1 text-muted"></i>

                            <h5 className="mt-3">No medical records</h5>

                            <p className="text-muted mb-0">
                              No medical records are available for this patient.
                            </p>
                          </div>
                        ) : (
                          <div className="row g-3">
                            {records.map((record) => (
                              <div className="col-12" key={record._id}>
                                <div className="card border">
                                  <div className="card-body">
                                    {/* Record Header */}

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <div>
                                        <h6 className="fw-bold mb-1">
                                          Medical Record
                                        </h6>

                                        <small className="text-muted">
                                          Created{" "}
                                          {record.createdAt
                                            ? new Date(
                                                record.createdAt,
                                              ).toLocaleDateString()
                                            : "N/A"}
                                        </small>
                                      </div>

                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handlePrint(record)}
                                      >
                                        <i className="bi bi-printer me-1"></i>
                                        Print Record
                                      </button>
                                    </div>

                                    {/* Appointment */}

                                    {record.appointment && (
                                      <div className="mb-3">
                                        <span className="text-muted">
                                          Appointment:
                                        </span>{" "}
                                        <span className="fw-semibold">
                                          {record.appointment.appointmentDate
                                            ? new Date(
                                                record.appointment
                                                  .appointmentDate,
                                              ).toLocaleDateString()
                                            : "N/A"}

                                          {" - "}

                                          {record.appointment.appointmentTime ||
                                            "N/A"}
                                        </span>
                                      </div>
                                    )}

                                    {/* Symptoms */}

                                    <div className="mb-3">
                                      <div className="text-muted small">
                                        Symptoms
                                      </div>

                                      <div>{record.symptoms || "N/A"}</div>
                                    </div>

                                    {/* Diagnosis */}

                                    <div className="mb-3">
                                      <div className="text-muted small">
                                        Diagnosis
                                      </div>

                                      <div>{record.diagnosis || "N/A"}</div>
                                    </div>

                                    {/* Prescription */}

                                    <div className="mb-3">
                                      <div className="text-muted small">
                                        Prescription
                                      </div>

                                      <div>{record.prescription || "N/A"}</div>
                                    </div>

                                    {/* Notes */}

                                    <div>
                                      <div className="text-muted small">
                                        Notes
                                      </div>

                                      <div>{record.notes || "N/A"}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ==================================================
          PRINT CSS
      ================================================== */}

      <style>
        {`

          /* -----------------------------------------------
             Hide print document normally

          ----------------------------------------------- */

          .print-medical-record {
            display: none;
          }


          /* -----------------------------------------------
             Print mode
          ----------------------------------------------- */

          @media print {

            @page {
              size: A4;
              margin: 15mm;
            }


            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }


            /*
             * Hide everything from the normal application.
             */

            body * {
              visibility: hidden;
            }


            /*
             * Show only the print document.
             */

            .print-medical-record,
            .print-medical-record * {
              visibility: visible;
            }


            .print-medical-record {
              display: block !important;

              position: absolute;

              left: 0;
              top: 0;

              width: 100%;

              min-height: 100vh;

              background: white;

              color: #111;

              font-family:
                Arial,
                Helvetica,
                sans-serif;

              font-size: 13px;

              line-height: 1.45;

              box-sizing: border-box;
              padding-left : 8mm;
              padding-right : 8mm;
            }


            .doctor-medical-records-page {
              display: none !important;
            }


            /* -------------------------------------------
               Header
            ------------------------------------------- */

            .print-header {
              text-align: center;

              padding-bottom: 14px;

              border-bottom: 2px solid #222;

              margin-bottom: 14px;
            }


            .print-hospital-name {
              font-size: 28px;

              font-weight: 700;

              letter-spacing: 1px;
            }


            .print-hospital-subtitle {
              font-size: 12px;

              color: #555;

              margin-top: 2px;
            }


            .print-title {
              font-size: 18px;

              font-weight: 700;

              letter-spacing: 1.5px;

              margin-top: 10px;
            }


            /* -------------------------------------------
               Record metadata
            ------------------------------------------- */

            .print-record-meta {
              display: flex;

              justify-content: space-between;

              border: 1px solid #ccc;

              padding: 9px 12px;

              margin-bottom: 16px;

              background: #f7f7f7;
            }


            .print-record-meta > div {
              display: flex;

              flex-direction: column;
            }


            .print-meta-label {
              font-size: 9px;

              text-transform: uppercase;

              font-weight: 700;

              color: #666;

              letter-spacing: 0.6px;
            }


            .print-meta-value {
              font-size: 11px;

              margin-top: 2px;

              font-weight: 600;
            }


            /* -------------------------------------------
               Section
            ------------------------------------------- */

            .print-section {
              margin-bottom: 15px;

              page-break-inside: avoid;
            }


            .print-section-title {
              font-size: 12px;

              font-weight: 700;

              text-transform: uppercase;

              letter-spacing: 0.8px;

              padding: 7px 10px;

              background: #eeeeee;

              border-left: 4px solid #222;

              margin-bottom: 7px;
            }


            /* -------------------------------------------
               Information boxes
            ------------------------------------------- */

            .print-info-box {
              display: grid;

              grid-template-columns:
                repeat(2, 1fr);

              border: 1px solid #ccc;
            }


            .print-info-item {
              padding: 9px 11px;

              min-height: 42px;

              box-sizing: border-box;
            }


            .print-info-item:nth-child(odd) {
              border-right: 1px solid #ccc;
            }


            .print-info-item:nth-child(n + 3) {
              border-top: 1px solid #ccc;
            }


            .print-label {
              display: block;

              font-size: 9px;

              text-transform: uppercase;

              font-weight: 700;

              color: #666;

              letter-spacing: 0.5px;

              margin-bottom: 2px;
            }


            .print-value {
              display: block;

              font-size: 12px;

              font-weight: 500;

              word-break: break-word;
            }


            /* -------------------------------------------
               Medical fields
            ------------------------------------------- */

            .print-medical-field {
              border: 1px solid #ccc;

              margin-bottom: 9px;

              page-break-inside: avoid;
            }


            .print-medical-label {
              font-size: 10px;

              font-weight: 700;

              text-transform: uppercase;

              letter-spacing: 0.6px;

              background: #f5f5f5;

              padding: 6px 9px;

              border-bottom: 1px solid #ccc;
            }


            .print-medical-value {
              min-height: 32px;

              padding: 8px 10px;

              font-size: 12px;

              white-space: pre-wrap;

              word-break: break-word;
            }


            .print-medical-value.prescription {
              min-height: 42px;
           
            }


            /* -------------------------------------------
               Signature
            ------------------------------------------- */

            .print-signature-section {
              display: flex;

              justify-content: flex-end;

              margin-top: 28px;

              page-break-inside: avoid;
            }


            .print-signature {
              width: 190px;

              text-align: center;
            }


            .print-signature-line {
              border-top: 1px solid #222;

              margin-bottom: 5px;
            }


            .print-signature-label {
              font-size: 10px;

              font-weight: 600;

              color: #444;
            }


            /* -------------------------------------------
               Footer
            ------------------------------------------- */

            .print-footer {
              display: flex;

              justify-content: space-between;

              margin-top: 30px;

              padding-top: 8px;

              border-top: 1px solid #aaa;

              font-size: 9px;

              color: #666;

              page-break-inside: avoid;
            }


            /*
             * Avoid awkward page breaks in the middle
             * of the medical record.
             */

            .print-medical-field,
            .print-info-box,
            .print-record-meta {
              break-inside: avoid;
            }

          }

        `}
      </style>
    </>
  );
};

export default DoctorMedicalRecords;

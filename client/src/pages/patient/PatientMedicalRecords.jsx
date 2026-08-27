import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const PatientMedicalRecords = () => {

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchMedicalRecords = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await api.get(
                    "/medical-records/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setRecords(
                    response.data.medicalRecords || []
                );

            }
            catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load medical records"
                );

            }
            finally {

                setLoading(false);

            }

        };


        fetchMedicalRecords();

    }, []);


    if (loading) {

        return (

            <div className="container-fluid min-vh-100 bg-light d-flex justify-content-center align-items-center">

                <div className="spinner-border text-primary">

                    <span className="visually-hidden">
                        Loading...
                    </span>

                </div>

            </div>

        );

    }


    return (

        <div className="container-fluid min-vh-100 bg-light">

            <div className="row">


                {/* Sidebar */}

                <aside className="col-md-3 col-lg-2 bg-dark text-white min-vh-100 p-3">

                    <h3 className="mb-4">
                        MedOps
                    </h3>


                    <div className="nav flex-column">


                        <Link
                            to="/patient"
                            className="nav-link text-white"
                        >

                            <i className="bi bi-speedometer2 me-2"></i>

                            Dashboard

                        </Link>


                        <Link
                            to="/patient/appointments"
                            className="nav-link text-white"
                        >

                            <i className="bi bi-calendar-check me-2"></i>

                            Appointments

                        </Link>


                        <Link
                            to="/patient/queue"
                            className="nav-link text-white"
                        >

                            <i className="bi bi-list-ol me-2"></i>

                            Queue

                        </Link>


                        <Link
                            to="/patient/medical-records"
                            className="nav-link text-white active"
                        >

                            <i className="bi bi-file-medical me-2"></i>

                            Medical Records

                        </Link>


                        <Link
                            to="/patient/profile"
                            className="nav-link text-white"
                        >

                            <i className="bi bi-person me-2"></i>

                            Profile

                        </Link>


                    </div>

                </aside>


                {/* Main Content */}

                <main className="col-md-9 col-lg-10 p-4">


                    {/* Header */}

                    <div className="mb-4">

                        <h2 className="fw-bold mb-1">
                            Medical Records
                        </h2>

                        <p className="text-muted mb-0">
                            View your medical history and consultation records
                        </p>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="alert alert-danger">

                            {error}

                        </div>

                    )}


                    {/* Empty State */}

                    {!error && records.length === 0 && (

                        <div className="card border-0 shadow-sm">

                            <div className="card-body text-center py-5">

                                <i className="bi bi-file-medical fs-1 text-muted"></i>

                                <h5 className="mt-3">
                                    No medical records found
                                </h5>

                                <p className="text-muted mb-0">

                                    Your medical records will appear here
                                    after a completed consultation.

                                </p>

                            </div>

                        </div>

                    )}


                    {/* Medical Records */}

                    {records.length > 0 && (

                        <div className="row g-4">

                            {records.map((record) => (

                                <div
                                    className="col-12"
                                    key={record._id}
                                >

                                    <div className="card border-0 shadow-sm">

                                        <div className="card-body p-4">


                                            {/* Record Header */}

                                            <div className="d-flex justify-content-between align-items-start mb-4">

                                                <div>

                                                    <h5 className="fw-bold mb-1">

                                                        {record.doctor?.user?.name ||
                                                            "Doctor"}

                                                    </h5>


                                                    <p className="text-muted mb-0">

                                                        {record.doctor?.specialization ||
                                                            "Doctor"}

                                                    </p>

                                                </div>


                                                <span className="badge bg-primary">

                                                    {record.createdAt
                                                        ? new Date(
                                                            record.createdAt
                                                        ).toLocaleDateString()
                                                        : "N/A"}

                                                </span>

                                            </div>


                                            {/* Appointment */}

                                            {record.appointment && (

                                                <div className="alert alert-light border mb-4">

                                                    <div className="row">

                                                        <div className="col-md-6">

                                                            <small className="text-muted">
                                                                Appointment Date
                                                            </small>

                                                            <div className="fw-semibold">

                                                                {record.appointment.appointmentDate
                                                                    ? new Date(
                                                                        record.appointment.appointmentDate
                                                                    ).toLocaleDateString()
                                                                    : "N/A"}

                                                            </div>

                                                        </div>


                                                        <div className="col-md-6">

                                                            <small className="text-muted">
                                                                Appointment Time
                                                            </small>

                                                            <div className="fw-semibold">

                                                                {record.appointment.appointmentTime ||
                                                                    "N/A"}

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            )}


                                            {/* Record Details */}

                                            <div className="row g-4">


                                                {/* Symptoms */}

                                                <div className="col-md-6">

                                                    <h6 className="fw-bold">

                                                        <i className="bi bi-thermometer-half text-primary me-2"></i>

                                                        Symptoms

                                                    </h6>

                                                    <p className="text-muted mb-0">

                                                        {record.symptoms ||
                                                            "No symptoms recorded."}

                                                    </p>

                                                </div>


                                                {/* Diagnosis */}

                                                <div className="col-md-6">

                                                    <h6 className="fw-bold">

                                                        <i className="bi bi-clipboard2-pulse text-primary me-2"></i>

                                                        Diagnosis

                                                    </h6>

                                                    <p className="text-muted mb-0">

                                                        {record.diagnosis ||
                                                            "No diagnosis recorded."}

                                                    </p>

                                                </div>


                                                {/* Prescription */}

                                                <div className="col-md-6">

                                                    <h6 className="fw-bold">

                                                        <i className="bi bi-capsule text-primary me-2"></i>

                                                        Prescription

                                                    </h6>

                                                    <p className="text-muted mb-0">

                                                        {record.prescription ||
                                                            "No prescription recorded."}

                                                    </p>

                                                </div>


                                                {/* Notes */}

                                                <div className="col-md-6">

                                                    <h6 className="fw-bold">

                                                        <i className="bi bi-journal-text text-primary me-2"></i>

                                                        Notes

                                                    </h6>

                                                    <p className="text-muted mb-0">

                                                        {record.notes ||
                                                            "No additional notes."}

                                                    </p>

                                                </div>


                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </main>

            </div>

        </div>

    );

};

export default PatientMedicalRecords;
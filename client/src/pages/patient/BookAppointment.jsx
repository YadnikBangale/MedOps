import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const BookAppointment = () => {

    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);

    const [formData, setFormData] = useState({
        doctor: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: ""
    });

    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [booking, setBooking] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {

        const fetchDoctors = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await api.get("/doctors", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setDoctors(response.data.doctors || []);

            }
            catch(error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load doctors"
                );
            }
            finally {

                setLoadingDoctors(false);
            }
        };

        fetchDoctors();

    }, []);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setBooking(true);

        try {

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/appointments",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess(
                response.data.message ||
                "Appointment booked successfully"
            );

            setFormData({
                doctor: "",
                appointmentDate: "",
                appointmentTime: "",
                reason: ""
            });

        }
        catch(error) {

            setError(
                error.response?.data?.message ||
                "Unable to book appointment"
            );
        }
        finally {

            setBooking(false);
        }
    };


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
                            className="nav-link text-white active"
                        >
                            <i className="bi bi-calendar-check me-2"></i>
                            Appointments
                        </Link>

                        <a
                            href="#"
                            className="nav-link text-white"
                        >
                            <i className="bi bi-list-ol me-2"></i>
                            Queue
                        </a>

                        <a
                            href="#"
                            className="nav-link text-white"
                        >
                            <i className="bi bi-file-medical me-2"></i>
                            Medical Records
                        </a>

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

                    <div className="mb-4">

                        <h2 className="fw-bold mb-1">
                            Book Appointment
                        </h2>

                        <p className="text-muted mb-0">
                            Schedule an appointment with a doctor
                        </p>

                    </div>


                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-4">

                            {error && (

                                <div className="alert alert-danger">
                                    {error}
                                </div>

                            )}

                            {success && (

                                <div className="alert alert-success">

                                    <i className="bi bi-check-circle me-2"></i>

                                    {success}

                                </div>

                            )}


                            {loadingDoctors ? (

                                <div className="text-center py-5">

                                    <div className="spinner-border text-primary">

                                        <span className="visually-hidden">
                                            Loading doctors...
                                        </span>

                                    </div>

                                </div>

                            ) : (

                                <form onSubmit={handleSubmit}>

                                    <div className="row g-4">

                                        {/* Doctor */}

                                        <div className="col-md-6">

                                            <label className="form-label fw-semibold">
                                                Doctor
                                            </label>

                                            <select
                                                name="doctor"
                                                className="form-select"
                                                value={formData.doctor}
                                                onChange={handleChange}
                                                required
                                            >

                                                <option value="">
                                                    Select Doctor
                                                </option>

                                                {doctors.map((doctor) => (

                                                    <option
                                                        key={doctor._id}
                                                        value={doctor._id}
                                                    >
                                                        {doctor.user?.name}
                                                        {" - "}
                                                        {doctor.specialization}
                                                    </option>

                                                ))}

                                            </select>

                                        </div>


                                        {/* Date */}

                                        <div className="col-md-6">

                                            <label className="form-label fw-semibold">
                                                Appointment Date
                                            </label>

                                            <input
                                                type="date"
                                                name="appointmentDate"
                                                className="form-control"
                                                value={formData.appointmentDate}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>


                                        {/* Time */}

                                        <div className="col-md-6">

                                            <label className="form-label fw-semibold">
                                                Appointment Time
                                            </label>

                                            <input
                                                type="time"
                                                name="appointmentTime"
                                                className="form-control"
                                                value={formData.appointmentTime}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>


                                        {/* Reason */}

                                        <div className="col-12">

                                            <label className="form-label fw-semibold">
                                                Reason for Visit
                                            </label>

                                            <textarea
                                                name="reason"
                                                className="form-control"
                                                rows="4"
                                                value={formData.reason}
                                                onChange={handleChange}
                                                placeholder="Describe the reason for your visit"
                                                required
                                            />

                                        </div>

                                    </div>


                                    <div className="mt-4 d-flex gap-2">

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={booking}
                                        >

                                            {booking ? (

                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                    ></span>

                                                    Booking...

                                                </>

                                            ) : (

                                                <>
                                                    <i className="bi bi-calendar-check me-2"></i>
                                                    Book Appointment
                                                </>

                                            )}

                                        </button>


                                        <Link
                                            to="/patient/appointments"
                                            className="btn btn-outline-secondary"
                                        >
                                            Cancel
                                        </Link>

                                    </div>

                                </form>

                            )}

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default BookAppointment;
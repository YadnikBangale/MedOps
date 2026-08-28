import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [doctorCount, setDoctorCount] = useState(0);
    const [patientCount, setPatientCount] = useState(0);
    const [departmentCount, setDepartmentCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                setError("");

                const token = localStorage.getItem("token");

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };


                const [
                    doctorsResponse,
                    patientsResponse,
                    departmentsResponse
                ] = await Promise.all([

                    api.get("/doctors", config),

                    api.get("/patients", config),

                    api.get("/departments", config),

                ]);


                setDoctorCount(
                    doctorsResponse.data.count || 0
                );

                setPatientCount(
                    patientsResponse.data.count || 0
                );

                setDepartmentCount(
                    departmentsResponse.data.count || 0
                );

            }
            catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard"
                );

            }
            finally {

                setLoading(false);

            }

        };


        fetchDashboardData();

    }, []);


    const handleLogout = () => {

        logout();

        navigate("/login");

    };


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
                            to="/admin"
                            className="nav-link text-white active"
                        >

                            <i className="bi bi-speedometer2 me-2"></i>

                            Dashboard

                        </Link>


                        <Link
                            to="/admin/doctors"
                            className="nav-link text-white"
                        >

                            <i className="bi bi-person-badge me-2"></i>

                            Doctors

                        </Link>


                        <Link
                            to="/admin/patients"
                            className="nav-link text-white"
                        >

                            <i className="bi bi-people me-2"></i>

                            Patients

                        </Link>


                        <Link
                            to="/admin/departments"
                            className="nav-link text-white"
                        >

                            <i className="bi bi-building me-2"></i>

                            Departments

                        </Link>


                        <button
                            className="nav-link text-white text-start border-0 bg-transparent"
                            onClick={handleLogout}
                        >

                            <i className="bi bi-box-arrow-right me-2"></i>

                            Logout

                        </button>


                    </div>

                </aside>


                {/* Main Content */}

                <main className="col-md-9 col-lg-10 p-4">


                    {/* Header */}

                    <div className="mb-4">

                        <h2 className="fw-bold mb-1">
                            Admin Dashboard
                        </h2>

                        <p className="text-muted mb-0">

                            Welcome back,{" "}

                            {user?.name || "Administrator"}

                        </p>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="alert alert-danger">

                            {error}

                        </div>

                    )}


                    {/* Statistics */}

                    <div className="row g-4 mb-4">


                        {/* Doctors */}

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div>

                                            <p className="text-muted mb-2">
                                                Available Doctors
                                            </p>

                                            <h2 className="fw-bold mb-0">
                                                {doctorCount}
                                            </h2>

                                        </div>


                                        <div className="bg-primary bg-opacity-10 rounded-circle p-3">

                                            <i className="bi bi-person-badge fs-3 text-primary"></i>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Patients */}

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div>

                                            <p className="text-muted mb-2">
                                                Patients
                                            </p>

                                            <h2 className="fw-bold mb-0">
                                                {patientCount}
                                            </h2>

                                        </div>


                                        <div className="bg-success bg-opacity-10 rounded-circle p-3">

                                            <i className="bi bi-people fs-3 text-success"></i>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Departments */}

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <div>

                                            <p className="text-muted mb-2">
                                                Active Departments
                                            </p>

                                            <h2 className="fw-bold mb-0">
                                                {departmentCount}
                                            </h2>

                                        </div>


                                        <div className="bg-warning bg-opacity-10 rounded-circle p-3">

                                            <i className="bi bi-building fs-3 text-warning"></i>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                    </div>


                    {/* Management Cards */}

                    <div className="row g-4">


                        {/* Doctor Management */}

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <i className="bi bi-person-badge fs-2 text-primary"></i>

                                    <h5 className="fw-bold mt-3">
                                        Doctor Management
                                    </h5>

                                    <p className="text-muted">
                                        Add, update and manage doctors.
                                    </p>

                                    <Link
                                        to="/admin/doctors"
                                        className="btn btn-primary"
                                    >
                                        Manage Doctors
                                    </Link>

                                </div>

                            </div>

                        </div>


                        {/* Patient Management */}

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <i className="bi bi-people fs-2 text-success"></i>

                                    <h5 className="fw-bold mt-3">
                                        Patient Management
                                    </h5>

                                    <p className="text-muted">
                                        View registered patients.
                                    </p>

                                    <Link
                                        to="/admin/patients"
                                        className="btn btn-success"
                                    >
                                        View Patients
                                    </Link>

                                </div>

                            </div>

                        </div>


                        {/* Department Management */}

                        <div className="col-md-4">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <i className="bi bi-building fs-2 text-warning"></i>

                                    <h5 className="fw-bold mt-3">
                                        Department Management
                                    </h5>

                                    <p className="text-muted">
                                        Manage hospital departments.
                                    </p>

                                    <Link
                                        to="/admin/departments"
                                        className="btn btn-warning"
                                    >
                                        Manage Departments
                                    </Link>

                                </div>

                            </div>

                        </div>


                    </div>

                </main>

            </div>

        </div>

    );

};

export default AdminDashboard;
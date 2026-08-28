import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminPatients = () => {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchPatients = async () => {

        try {

            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/patients",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPatients(
                response.data.patients || []
            );

        }
        catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load patients"
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchPatients();

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
                            to="/admin"
                            className="nav-link text-white"
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
                            className="nav-link text-white active"
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


                    </div>

                </aside>


                {/* Main Content */}

                <main className="col-md-9 col-lg-10 p-4">


                    {/* Header */}

                    <div className="mb-4">

                        <h2 className="fw-bold mb-1">
                            Patients
                        </h2>

                        <p className="text-muted mb-0">
                            View registered hospital patients
                        </p>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="alert alert-danger">

                            {error}

                        </div>

                    )}


                    {/* Empty State */}

                    {!error && patients.length === 0 && (

                        <div className="card border-0 shadow-sm">

                            <div className="card-body text-center py-5">

                                <i className="bi bi-person-x fs-1 text-muted"></i>

                                <h5 className="mt-3">
                                    No patients found
                                </h5>

                                <p className="text-muted mb-0">
                                    There are currently no registered patients.
                                </p>

                            </div>

                        </div>

                    )}


                    {/* Patients Table */}

                    {patients.length > 0 && (

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-0">

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle mb-0">

                                        <thead className="table-light">

                                            <tr>

                                                <th className="px-4">
                                                    Patient
                                                </th>

                                                <th>
                                                    Date of Birth
                                                </th>

                                                <th>
                                                    Gender
                                                </th>

                                                <th>
                                                    Blood Group
                                                </th>

                                                <th>
                                                    Phone
                                                </th>

                                                <th>
                                                    Address
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {patients.map(
                                                (patient) => (

                                                    <tr
                                                        key={patient._id}
                                                    >


                                                        {/* Patient */}

                                                        <td className="px-4">

                                                            <div className="fw-semibold">

                                                                {patient.user?.name ||
                                                                    "Patient"}

                                                            </div>

                                                            <small className="text-muted">

                                                                {patient.user?.email ||
                                                                    "N/A"}

                                                            </small>

                                                        </td>


                                                        {/* Date of Birth */}

                                                        <td>

                                                            {patient.dateOfBirth
                                                                ? new Date(
                                                                    patient.dateOfBirth
                                                                ).toLocaleDateString()
                                                                : "N/A"}

                                                        </td>


                                                        {/* Gender */}

                                                        <td>

                                                            {patient.gender ||
                                                                "N/A"}

                                                        </td>


                                                        {/* Blood Group */}

                                                        <td>

                                                            {patient.bloodGroup ||
                                                                "N/A"}

                                                        </td>


                                                        {/* Phone */}

                                                        <td>

                                                            {patient.phone ||
                                                                "N/A"}

                                                        </td>


                                                        {/* Address */}

                                                        <td>

                                                            {patient.address ||
                                                                "N/A"}

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                    )}

                </main>

            </div>

        </div>

    );

};

export default AdminPatients;
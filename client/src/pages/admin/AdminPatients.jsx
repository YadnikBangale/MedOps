import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    address: "",
  });

  const fetchPatients = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatients(response.data.patients || []);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setFormLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post("/patients/admin", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(response.data.message || "Patient registered successfully");

      setFormData({
        name: "",
        email: "",
        password: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        phone: "",
        address: "",
      });

      setShowForm(false);

      await fetchPatients();
    } catch (error) {
      setError(error.response?.data?.message || "Unable to register patient");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);

    setFormData({
      name: "",
      email: "",
      password: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      phone: "",
      address: "",
    });

    setError("");
  };

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        {/* Sidebar */}

        <aside className="col-md-3 col-lg-2 bg-dark text-white min-vh-100 p-3">
          <h3 className="mb-4">MedOps</h3>

          <div className="nav flex-column">
            <Link to="/admin" className="nav-link text-white">
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </Link>

            <Link to="/admin/doctors" className="nav-link text-white">
              <i className="bi bi-person-badge me-2"></i>
              Doctors
            </Link>

            <Link to="/admin/patients" className="nav-link text-white active">
              <i className="bi bi-people me-2"></i>
              Patients
            </Link>

            <Link to="/admin/departments" className="nav-link text-white">
              <i className="bi bi-building me-2"></i>
              Departments
            </Link>
          </div>
        </aside>

        {/* Main Content */}

        <main className="col-md-9 col-lg-10 p-4">
          {/* Header */}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Patients</h2>

              <p className="text-muted mb-0">
                View and register hospital patients
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => {
                setShowForm(!showForm);
                setError("");
                setSuccess("");
              }}
            >
              <i className="bi bi-person-plus me-2"></i>

              {showForm ? "Close Form" : "Register Patient"}
            </button>
          </div>

          {/* Success */}

          {success && <div className="alert alert-success">{success}</div>}

          {/* Error */}

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Register Patient Form */}

          {showForm && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Register New Patient</h5>

                <form onSubmit={handleRegisterPatient}>
                  <div className="row g-3">
                    {/* Name */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="patientName"
                      >
                        Full Name
                      </label>

                      <input
                        id="patientName"
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter patient's name"
                        required
                      />
                    </div>

                    {/* Email */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="patientEmail"
                      >
                        Email
                      </label>

                      <input
                        id="patientEmail"
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter patient's email"
                        required
                      />
                    </div>

                    {/* Password */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="patientPassword"
                      >
                        Password
                      </label>

                      <input
                        id="patientPassword"
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Set patient login password"
                        required
                      />
                    </div>

                    {/* Date of Birth */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="patientDateOfBirth"
                      >
                        Date of Birth
                      </label>

                      <input
                        id="patientDateOfBirth"
                        type="date"
                        name="dateOfBirth"
                        className="form-control"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Gender */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="patientGender"
                      >
                        Gender
                      </label>

                      <select
                        id="patientGender"
                        name="gender"
                        className="form-select"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select gender</option>

                        <option value="male">Male</option>

                        <option value="female">Female</option>

                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Blood Group */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="patientBloodGroup"
                      >
                        Blood Group
                      </label>

                      <select
                        id="patientBloodGroup"
                        name="bloodGroup"
                        className="form-select"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                      >
                        <option value="">Select blood group</option>

                        <option value="A+">A+</option>

                        <option value="A-">A-</option>

                        <option value="B+">B+</option>

                        <option value="B-">B-</option>

                        <option value="AB+">AB+</option>

                        <option value="AB-">AB-</option>

                        <option value="O+">O+</option>

                        <option value="O-">O-</option>
                      </select>
                    </div>

                    {/* Phone */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="patientPhone"
                      >
                        Phone
                      </label>

                      <input
                        id="patientPhone"
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </div>

                    {/* Address */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="patientAddress"
                      >
                        Address
                      </label>

                      <input
                        id="patientAddress"
                        type="text"
                        name="address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                      />
                    </div>
                  </div>

                  {/* Buttons */}

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={formLoading}
                    >
                      {formLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Registering...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Register Patient
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Empty State */}

          {!error && patients.length === 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-person-x fs-1 text-muted"></i>

                <h5 className="mt-3">No patients found</h5>

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
                        <th className="px-4">Patient</th>

                        <th>Date of Birth</th>

                        <th>Gender</th>

                        <th>Blood Group</th>

                        <th>Phone</th>

                        <th>Address</th>
                      </tr>
                    </thead>

                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient._id}>
                          {/* Patient */}

                          <td className="px-4">
                            <div className="fw-semibold">
                              {patient.user?.name || "Patient"}
                            </div>

                            <small className="text-muted">
                              {patient.user?.email || "N/A"}
                            </small>
                          </td>

                          {/* Date of Birth */}

                          <td>
                            {patient.dateOfBirth
                              ? new Date(
                                  patient.dateOfBirth,
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>

                          {/* Gender */}

                          <td>{patient.gender || "N/A"}</td>

                          {/* Blood Group */}

                          <td>{patient.bloodGroup || "N/A"}</td>

                          {/* Phone */}

                          <td>{patient.phone || "N/A"}</td>

                          {/* Address */}

                          <td>{patient.address || "N/A"}</td>
                        </tr>
                      ))}
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

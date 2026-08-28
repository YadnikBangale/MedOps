import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    address: "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/patients/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const patientData = response.data.patient;

        setPatient(patientData);

        setFormData({
          dateOfBirth: patientData.dateOfBirth
            ? patientData.dateOfBirth.split("T")[0]
            : "",
          gender: patientData.gender || "",
          bloodGroup: patientData.bloodGroup || "",
          phone: patientData.phone || "",
          address: patientData.address || "",
        });
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.put("/patients/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatient(response.data.patient);

      setFormData({
        dateOfBirth: response.data.patient.dateOfBirth
          ? response.data.patient.dateOfBirth.split("T")[0]
          : "",
        gender: response.data.patient.gender || "",
        bloodGroup: response.data.patient.bloodGroup || "",
        phone: response.data.patient.phone || "",
        address: response.data.patient.address || "",
      });

      setIsEditing(false);
      setSuccess("Profile updated successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
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

  if (error && !patient) {
    return (
      <div className="container-fluid min-vh-100 bg-light p-4">
        <div className="alert alert-danger">{error}</div>

        <Link to="/patient" className="btn btn-primary">
          Back to Dashboard
        </Link>
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
            <Link to="/patient" className="nav-link text-white">
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </Link>

            <Link to="/patient/appointments" className="nav-link text-white">
              <i className="bi bi-calendar-check me-2"></i>
              Appointments
            </Link>

            <Link to="/patient/queue" className="nav-link text-white">
              <i className="bi bi-list-ol me-2"></i>
              Queue
            </Link>

            <Link to="/patient/medical-records" className="nav-link text-white">
              <i className="bi bi-file-medical me-2"></i>
              Medical Records
            </Link>

            <Link to="/patient/profile" className="nav-link text-white active">
              <i className="bi bi-person me-2"></i>
              Profile
            </Link>
          </div>
        </aside>

        {/* Main Content */}

        <main className="col-md-9 col-lg-10 p-4">
          <div className="mb-4">
            <h2 className="fw-bold mb-1">Patient Profile</h2>

            <p className="text-muted">
              View and manage your personal information
            </p>
          </div>

          {/* Profile Card */}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {/* Profile Header */}

              <div className="d-flex align-items-center mb-4">
                <div
                  className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "24px",
                  }}
                >
                  <i className="bi bi-person"></i>
                </div>

                <div>
                  <h4 className="fw-bold mb-1">{patient.user.name}</h4>

                  <p className="text-muted mb-0">{patient.user.email}</p>
                </div>
              </div>

              <hr />

              {/* Section Header */}

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Personal Information</h5>

                {!isEditing && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSuccess("");
                      setError("");
                      setIsEditing(true);
                    }}
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Success Message */}

              {success && (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle me-2"></i>

                  {success}
                </div>
              )}

              {/* Error Message */}

              {error && <div className="alert alert-danger">{error}</div>}

              {/* EDIT MODE */}

              {isEditing ? (
                <form onSubmit={handleSave}>
                  <div className="row g-4">
                    {/* Name */}

                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>

                      <input
                        type="text"
                        className="form-control"
                        value={patient.user.name}
                        disabled
                      />

                      <small className="text-muted">
                        Name cannot be changed here.
                      </small>
                    </div>

                    {/* Email */}

                    <div className="col-md-6">
                      <label className="form-label">Email</label>

                      <input
                        type="email"
                        className="form-control"
                        value={patient.user.email}
                        disabled
                      />

                      <small className="text-muted">
                        Email cannot be changed here.
                      </small>
                    </div>

                    {/* Date of Birth */}

                    <div className="col-md-6">
                      <label className="form-label">Date of Birth</label>

                      <input
                        type="date"
                        name="dateOfBirth"
                        className="form-control"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Gender */}

                    <div className="col-md-6">
                      <label className="form-label">Gender</label>

                      <select
                        name="gender"
                        className="form-select"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>

                        <option value="male">Male</option>

                        <option value="female">Female</option>

                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Blood Group */}

                    <div className="col-md-6">
                      <label className="form-label">Blood Group</label>

                      <select
                        name="bloodGroup"
                        className="form-select"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                      >
                        <option value="">Select Blood Group</option>

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
                      <label className="form-label">Phone</label>

                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Address */}

                    <div className="col-12">
                      <label className="form-label">Address</label>

                      <textarea
                        name="address"
                        className="form-control"
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Buttons */}

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary me-2"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={saving}
                      onClick={() => {
                        setIsEditing(false);
                        setError("");

                        setFormData({
                          dateOfBirth: patient.dateOfBirth
                            ? patient.dateOfBirth.split("T")[0]
                            : "",
                          gender: patient.gender || "",
                          bloodGroup: patient.bloodGroup || "",
                          phone: patient.phone || "",
                          address: patient.address || "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* VIEW MODE */

                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="text-muted small">Full Name</label>

                    <p className="fw-semibold">{patient.user.name}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small">Email</label>

                    <p className="fw-semibold">{patient.user.email}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small">Date of Birth</label>

                    <p className="fw-semibold">
                      {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small">Gender</label>

                    <p className="fw-semibold text-capitalize">
                      {patient.gender}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small">Blood Group</label>

                    <p className="fw-semibold">{patient.bloodGroup}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small">Phone</label>

                    <p className="fw-semibold">{patient.phone}</p>
                  </div>

                  <div className="col-12">
                    <label className="text-muted small">Address</label>

                    <p className="fw-semibold">{patient.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientProfile;

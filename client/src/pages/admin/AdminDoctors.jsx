import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    specialization: "",
    licenseNumber: "",
    experience: "",
    consultationFee: "",
  });

  const fetchDoctors = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDoctors(response.data.doctors || []);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/departments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDepartments(response.data.departments || []);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to load departments");
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setFormLoading(true);

      const token = localStorage.getItem("token");

      await api.post(
        "/doctors",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          specialization: formData.specialization,
          licenseNumber: formData.licenseNumber,
          experience: Number(formData.experience),
          consultationFee: Number(formData.consultationFee),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess("Doctor created successfully");

      setFormData({
        name: "",
        email: "",
        password: "",
        department: "",
        specialization: "",
        licenseNumber: "",
        experience: "",
        consultationFee: "",
      });

      setShowForm(false);

      await fetchDoctors();
    } catch (error) {
      setError(error.response?.data?.message || "Unable to create doctor");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleAvailability = async (doctorId) => {
    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/doctors/${doctorId}/availability`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess(response.data.message);

      await fetchDoctors();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to update doctor availability",
      );
    }
  };

  const handleEditDoctor = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setEditLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.put(
        `/doctors/${editingDoctor._id}`,
        {
          department: editingDoctor.department,
          specialization: editingDoctor.specialization,
          licenseNumber: editingDoctor.licenseNumber,
          experience: Number(editingDoctor.experience),
          consultationFee: Number(editingDoctor.consultationFee),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess(response.data.message || "Doctor updated successfully");

      setEditingDoctor(null);

      await fetchDoctors();
    } catch (error) {
      setError(error.response?.data?.message || "Unable to update doctor");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingDoctor((previous) => ({
      ...previous,
      [name]: value,
    }));
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

            <Link to="/admin/doctors" className="nav-link text-white active">
              <i className="bi bi-person-badge me-2"></i>
              Doctors
            </Link>

            <Link to="/admin/patients" className="nav-link text-white">
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
              <h2 className="fw-bold mb-1">Doctors</h2>

              <p className="text-muted mb-0">Manage hospital doctors</p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => {
                setShowForm(!showForm);
                setEditingDoctor(null);
                setError("");
                setSuccess("");
              }}
            >
              <i className="bi bi-plus-lg me-2"></i>

              {showForm ? "Close Form" : "Add Doctor"}
            </button>
          </div>

          {/* Success */}

          {success && <div className="alert alert-success">{success}</div>}

          {/* Error */}

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Add Doctor Form */}

          {showForm && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Add New Doctor</h5>

                <form onSubmit={handleAddDoctor}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="name">
                        Full Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter doctor's name"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="email">
                        Email
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter doctor's email"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="password"
                      >
                        Password
                      </label>

                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter temporary password"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="department"
                      >
                        Department
                      </label>

                      <select
                        id="department"
                        name="department"
                        className="form-select"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select department</option>

                        {departments.map((department) => (
                          <option key={department._id} value={department._id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="specialization"
                      >
                        Specialization
                      </label>

                      <input
                        id="specialization"
                        name="specialization"
                        type="text"
                        className="form-control"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="e.g. Cardiology"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="licenseNumber"
                      >
                        License Number
                      </label>

                      <input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        className="form-control"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        placeholder="Enter license number"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="experience"
                      >
                        Experience (Years)
                      </label>

                      <input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        className="form-control"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Enter years of experience"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="consultationFee"
                      >
                        Consultation Fee (₹)
                      </label>

                      <input
                        id="consultationFee"
                        name="consultationFee"
                        type="number"
                        min="0"
                        className="form-control"
                        value={formData.consultationFee}
                        onChange={handleChange}
                        placeholder="Enter consultation fee"
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={formLoading}
                    >
                      {formLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Create Doctor
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Doctor Form */}

          {editingDoctor && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Edit Doctor</h5>

                <form onSubmit={handleEditDoctor}>
                  <div className="row g-3">
                    {/* Doctor Name */}

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Doctor</label>

                      <input
                        type="text"
                        className="form-control"
                        value={editingDoctor.user?.name || ""}
                        disabled
                      />
                    </div>

                    {/* Email */}

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email</label>

                      <input
                        type="text"
                        className="form-control"
                        value={editingDoctor.user?.email || ""}
                        disabled
                      />
                    </div>

                    {/* Department */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="editDepartment"
                      >
                        Department
                      </label>

                      <select
                        id="editDepartment"
                        name="department"
                        className="form-select"
                        value={editingDoctor.department}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="">Select department</option>

                        {departments.map((department) => (
                          <option key={department._id} value={department._id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Specialization */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="editSpecialization"
                      >
                        Specialization
                      </label>

                      <input
                        id="editSpecialization"
                        name="specialization"
                        type="text"
                        className="form-control"
                        value={editingDoctor.specialization}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    {/* License Number */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="editLicenseNumber"
                      >
                        License Number
                      </label>

                      <input
                        id="editLicenseNumber"
                        name="licenseNumber"
                        type="text"
                        className="form-control"
                        value={editingDoctor.licenseNumber}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    {/* Experience */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="editExperience"
                      >
                        Experience (Years)
                      </label>

                      <input
                        id="editExperience"
                        name="experience"
                        type="number"
                        min="0"
                        className="form-control"
                        value={editingDoctor.experience}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    {/* Consultation Fee */}

                    <div className="col-md-6">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="editConsultationFee"
                      >
                        Consultation Fee (₹)
                      </label>

                      <input
                        id="editConsultationFee"
                        name="consultationFee"
                        type="number"
                        min="0"
                        className="form-control"
                        value={editingDoctor.consultationFee}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={editLoading}
                    >
                      {editLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Update Doctor
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setEditingDoctor(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Empty State */}

          {!error && doctors.length === 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-person-x fs-1 text-muted"></i>

                <h5 className="mt-3">No doctors found</h5>

                <p className="text-muted mb-0">
                  There are currently no doctors.
                </p>
              </div>
            </div>
          )}

          {/* Doctors Table */}

          {doctors.length > 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4">Doctor</th>

                        <th>Department</th>

                        <th>Specialization</th>

                        <th>Experience</th>

                        <th>Consultation Fee</th>

                        <th>Availability</th>

                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {doctors.map((doctor) => (
                        <tr key={doctor._id}>
                          {/* Doctor */}

                          <td className="px-4">
                            <div className="fw-semibold">
                              Dr. {doctor.user?.name || "Doctor"}
                            </div>

                            <small className="text-muted">
                              {doctor.user?.email || "N/A"}
                            </small>
                          </td>

                          {/* Department */}

                          <td>{doctor.department?.name || "N/A"}</td>

                          {/* Specialization */}

                          <td>{doctor.specialization || "N/A"}</td>

                          {/* Experience */}

                          <td>
                            {doctor.experience !== undefined
                              ? `${doctor.experience} years`
                              : "N/A"}
                          </td>

                          {/* Consultation Fee */}

                          <td>
                            {doctor.consultationFee !== undefined
                              ? `₹${doctor.consultationFee}`
                              : "N/A"}
                          </td>

                          {/* Availability */}

                          <td>
                            {doctor.isAvailable ? (
                              <span className="badge bg-success">
                                Available
                              </span>
                            ) : (
                              <span className="badge bg-danger">
                                Unavailable
                              </span>
                            )}
                          </td>

                          {/* Actions */}

                          <td>
                            <div className="d-flex gap-2">
                              {/* Edit */}

                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => {
                                  setError("");
                                  setSuccess("");
                                  setShowForm(false);

                                  setEditingDoctor({
                                    _id: doctor._id,

                                    user: doctor.user,

                                    department: doctor.department?._id || "",

                                    specialization: doctor.specialization || "",

                                    licenseNumber: doctor.licenseNumber || "",

                                    experience: doctor.experience ?? "",

                                    consultationFee:
                                      doctor.consultationFee ?? "",
                                  });
                                }}
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Edit
                              </button>

                              {/* Availability */}

                              <button
                                className={`btn btn-sm ${
                                  doctor.isAvailable
                                    ? "btn-outline-danger"
                                    : "btn-outline-success"
                                }`}
                                onClick={() =>
                                  handleToggleAvailability(doctor._id)
                                }
                              >
                                {doctor.isAvailable ? (
                                  <>
                                    <i className="bi bi-person-x me-1"></i>
                                    Make Unavailable
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-person-check me-1"></i>
                                    Make Available
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
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

export default AdminDoctors;

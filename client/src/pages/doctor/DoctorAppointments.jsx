import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

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
      setError(error.response?.data?.message || "Unable to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleComplete = async (appointmentId) => {
    try {
      setError("");

      setActionLoading(appointmentId);

      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/appointments/${appointmentId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedAppointment = response.data.appointment;

      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment._id === appointmentId ? updatedAppointment : appointment,
        ),
      );
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to complete appointment",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-primary";

      case "completed":
        return "bg-success";

      case "cancelled":
        return "bg-danger";

      default:
        return "bg-secondary";
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

  return (
    <div className="container-fluid min-vh-100 bg-light">
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

            <Link
              to="/doctor/appointments"
              className="nav-link text-white active"
            >
              <i className="bi bi-calendar-check me-2"></i>
              Appointments
            </Link>

            <a href="#" className="nav-link text-white">
              <i className="bi bi-file-medical me-2"></i>
              Medical Records
            </a>
          </div>
        </aside>

        {/* Main Content */}

        <main className="col-md-9 col-lg-10 p-4">
          {/* Header */}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Appointments</h2>

              <p className="text-muted mb-0">
                View and manage your patient appointments
              </p>
            </div>

            <button
              className="btn btn-outline-primary"
              onClick={fetchAppointments}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
          </div>

          {/* Error */}

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Empty State */}

          {!error && appointments.length === 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-calendar-x fs-1 text-muted"></i>

                <h5 className="mt-3">No appointments found</h5>

                <p className="text-muted mb-0">
                  You don't have any appointments yet.
                </p>
              </div>
            </div>
          )}

          {/* Appointments */}

          {appointments.length > 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4">Patient</th>

                        <th>Date</th>

                        <th>Time</th>

                        <th>Reason</th>

                        <th>Status</th>

                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                          {/* Patient */}

                          <td className="px-4">
                            <div className="fw-semibold">
                              {appointment.patient?.user?.name || "Patient"}
                            </div>

                            <small className="text-muted">
                              {appointment.patient?.user?.email || "N/A"}
                            </small>
                          </td>

                          {/* Date */}

                          <td>
                            {appointment.appointmentDate
                              ? new Date(
                                  appointment.appointmentDate,
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>

                          {/* Time */}

                          <td>{appointment.appointmentTime || "N/A"}</td>

                          {/* Reason */}

                          <td>{appointment.reason || "—"}</td>

                          {/* Status */}

                          <td>
                            <span
                              className={`badge ${getStatusClass(
                                appointment.status,
                              )}`}
                            >
                              {appointment.status}
                            </span>
                          </td>

                          {/* Action */}

                          <td>
                            {appointment.status === "scheduled" ? (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleComplete(appointment._id)}
                                disabled={actionLoading === appointment._id}
                              >
                                {actionLoading === appointment._id ? (
                                  <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                  <>
                                    <i className="bi bi-check-lg me-1"></i>
                                    Complete
                                  </>
                                )}
                              </button>
                            ) : appointment.status === "completed" ? (
                              <span className="text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Completed
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
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

export default DoctorAppointments;

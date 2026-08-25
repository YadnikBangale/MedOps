import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/appointments/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppointments(response.data.appointments || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load appointments",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

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
            <Link to="/patient" className="nav-link text-white">
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

            <a href="#" className="nav-link text-white">
              <i className="bi bi-list-ol me-2"></i>
              Queue
            </a>

            <a href="#" className="nav-link text-white">
              <i className="bi bi-file-medical me-2"></i>
              Medical Records
            </a>

            <Link to="/patient/profile" className="nav-link text-white">
              <i className="bi bi-person me-2"></i>
              Profile
            </Link>
          </div>
        </aside>

        {/* Main Content */}

        <main className="col-md-9 col-lg-10 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Appointments</h2>

              <p className="text-muted mb-0">
                View and manage your appointments
              </p>
            </div>

            <Link to="/patient/appointments/book" className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>
              Book Appointment
            </Link>
          </div>

          {/* Error */}

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Empty State */}

          {!error && appointments.length === 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-calendar-x fs-1 text-muted"></i>

                <h5 className="mt-3">No appointments found</h5>

                <p className="text-muted">
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
                        <th className="px-4">Doctor</th>

                        <th>Department</th>

                        <th>Date</th>

                        <th>Time</th>

                        <th>Reason</th>

                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                          <td className="px-4">
                            <div className="fw-semibold">
                              {appointment.doctor?.user?.name || "Doctor"}
                            </div>

                            <small className="text-muted">
                              {appointment.doctor?.specialization || "N/A"}
                            </small>
                          </td>

                          <td>
                            {appointment.doctor?.department?.name || "N/A"}
                          </td>

                          <td>
                            {new Date(
                              appointment.appointmentDate,
                            ).toLocaleDateString()}
                          </td>

                          <td>{appointment.appointmentTime}</td>

                          <td>{appointment.reason || "—"}</td>

                          <td>
                            <span
                              className={`badge ${getStatusClass(
                                appointment.status,
                              )}`}
                            >
                              {appointment.status}
                            </span>
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

export default PatientAppointments;

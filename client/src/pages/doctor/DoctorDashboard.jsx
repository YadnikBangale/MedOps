import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const DoctorDashboard = () => {
  const { user } = useAuth();

  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/queue/doctor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setQueues(response.data.queues || []);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load queue");
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);

  const waitingCount = queues.filter(
    (queue) => queue.status === "waiting",
  ).length;

  const consultationCount = queues.filter(
    (queue) => queue.status === "in-consultation",
  ).length;

  const completedCount = queues.filter(
    (queue) => queue.status === "completed",
  ).length;

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
            <Link to="/doctor" className="nav-link text-white active">
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

            <Link to="/doctor/medical-records" className="nav-link text-white">
              <i className="bi bi-file-medical me-2"></i>
              Medical Records
            </Link>
          </div>
        </aside>

        {/* Main Content */}

        <main className="col-md-9 col-lg-10 p-4">
          {/* Header */}

          <div className="mb-4">
            <h2 className="fw-bold mb-1">Doctor Dashboard</h2>

            <p className="text-muted mb-0">
              Welcome back, {user?.name || "Doctor"}
            </p>
          </div>

          {/* Error */}

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Statistics */}

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted">Waiting Patients</div>

                  <h2 className="fw-bold mt-2 mb-0">{waitingCount}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted">In Consultation</div>

                  <h2 className="fw-bold mt-2 mb-0">{consultationCount}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted">Completed</div>

                  <h2 className="fw-bold mt-2 mb-0">{completedCount}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Current Queue */}

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold mb-1">Today's Queue</h5>

                  <p className="text-muted mb-0">
                    Manage your patient consultations
                  </p>
                </div>

                <Link to="/doctor/queue" className="btn btn-primary">
                  View Queue
                </Link>
              </div>

              {queues.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-people fs-1 text-muted"></i>

                  <p className="text-muted mt-2 mb-0">
                    No patients in the queue.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Queue</th>

                        <th>Patient</th>

                        <th>Appointment</th>

                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {queues.slice(0, 5).map((queue) => (
                        <tr key={queue._id}>
                          <td>
                            <span className="fw-bold text-primary">
                              #{queue.queueNumber}
                            </span>
                          </td>

                          <td>{queue.patient?.user?.name || "Patient"}</td>

                          <td>{queue.appointment?.appointmentTime || "N/A"}</td>

                          <td>
                            <span className="badge bg-secondary">
                              {queue.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;

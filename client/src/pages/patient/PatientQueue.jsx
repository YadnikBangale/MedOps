import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const PatientQueue = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/queue/my", {
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

  const getStatusClass = (status) => {
    switch (status) {
      case "waiting":
        return "bg-warning text-dark";

      case "in-consultation":
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
          <span className="visually-hidden">Loading queue...</span>
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

            <Link to="/patient/appointments" className="nav-link text-white">
              <i className="bi bi-calendar-check me-2"></i>
              Appointments
            </Link>

            <Link to="/patient/queue" className="nav-link text-white active">
              <i className="bi bi-list-ol me-2"></i>
              Queue
            </Link>

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
          <div className="mb-4">
            <h2 className="fw-bold mb-1">Queue</h2>

            <p className="text-muted mb-0">
              Track your current consultation queue status
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {!error && queues.length === 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-list-ol fs-1 text-muted"></i>

                <h5 className="mt-3">No queue entries</h5>

                <p className="text-muted mb-3">
                  You currently have no active queue entries.
                </p>

                <Link to="/patient/appointments" className="btn btn-primary">
                  View Appointments
                </Link>
              </div>
            </div>
          )}

          {queues.length > 0 && (
            <div className="row g-4">
              {queues.map((queue) => (
                <div className="col-12" key={queue._id}>
                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        {/* Queue Number */}

                        <div className="col-md-2 text-center">
                          <div className="text-muted small">Queue Number</div>

                          <div className="display-5 fw-bold text-primary">
                            #{queue.queueNumber}
                          </div>
                        </div>

                        {/* Doctor */}

                        <div className="col-md-4">
                          <div className="text-muted small">Doctor</div>

                          <h5 className="fw-bold mb-1">
                            {queue.doctor?.user?.name || "Doctor"}
                          </h5>

                          <p className="text-muted mb-0">
                            {queue.doctor?.specialization || "N/A"}
                          </p>
                        </div>

                        {/* Appointment */}

                        <div className="col-md-3">
                          <div className="text-muted small">Appointment</div>

                          <p className="fw-semibold mb-1">
                            {queue.appointment?.appointmentDate
                              ? new Date(
                                  queue.appointment.appointmentDate,
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>

                          <p className="text-muted mb-0">
                            {queue.appointment?.appointmentTime || "N/A"}
                          </p>
                        </div>

                        {/* Status */}

                        <div className="col-md-3 text-md-end">
                          <div className="text-muted small mb-2">Status</div>

                          <span
                            className={`badge ${getStatusClass(queue.status)}`}
                          >
                            {queue.status}
                          </span>
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

export default PatientQueue;

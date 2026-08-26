import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const DoctorQueue = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

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

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleQueueAction = async (queueId, action) => {
    try {
      setError("");
      setActionLoading(`${queueId}-${action}`);

      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/queue/${queueId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedQueue = response.data.queue;

      setQueues((previous) =>
        previous.map((queue) => (queue._id === queueId ? updatedQueue : queue)),
      );
    } catch (error) {
      setError(error.response?.data?.message || `Unable to ${action} queue`);
    } finally {
      setActionLoading(null);
    }
  };

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

            <Link to="/doctor/queue" className="nav-link text-white active">
              <i className="bi bi-list-ol me-2"></i>
              Queue
            </Link>

            <Link to="/doctor/appointments" className="nav-link text-white">
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
              <h2 className="fw-bold mb-1">Patient Queue</h2>

              <p className="text-muted mb-0">
                Manage today's patient consultations
              </p>
            </div>

            <button className="btn btn-outline-primary" onClick={fetchQueue}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
          </div>

          {/* Error */}

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Empty Queue */}

          {!error && queues.length === 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-people fs-1 text-muted"></i>

                <h5 className="mt-3">Queue is empty</h5>

                <p className="text-muted mb-0">
                  There are no patients in your queue.
                </p>
              </div>
            </div>
          )}

          {/* Queue Table */}

          {queues.length > 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4">Queue</th>

                        <th>Patient</th>

                        <th>Appointment</th>

                        <th>Reason</th>

                        <th>Status</th>

                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {queues.map((queue) => (
                        <tr key={queue._id}>
                          {/* Queue Number */}

                          <td className="px-4">
                            <span className="fs-5 fw-bold text-primary">
                              #{queue.queueNumber}
                            </span>
                          </td>

                          {/* Patient */}

                          <td>
                            <div className="fw-semibold">
                              {queue.patient?.user?.name || "Patient"}
                            </div>

                            <small className="text-muted">
                              {queue.patient?.user?.email || "N/A"}
                            </small>
                          </td>

                          {/* Appointment */}

                          <td>
                            <div className="fw-semibold">
                              {queue.appointment?.appointmentTime || "N/A"}
                            </div>

                            <small className="text-muted">
                              {queue.appointment?.appointmentDate
                                ? new Date(
                                    queue.appointment.appointmentDate,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </small>
                          </td>

                          {/* Reason */}

                          <td>{queue.appointment?.reason || "—"}</td>

                          {/* Status */}

                          <td>
                            <span
                              className={`badge ${getStatusClass(
                                queue.status,
                              )}`}
                            >
                              {queue.status}
                            </span>
                          </td>

                          {/* Actions */}

                          <td>
                            {queue.status === "waiting" && (
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() =>
                                    handleQueueAction(queue._id, "start")
                                  }
                                  disabled={
                                    actionLoading === `${queue._id}-start`
                                  }
                                >
                                  {actionLoading === `${queue._id}-start` ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                  ) : (
                                    <>
                                      <i className="bi bi-play-fill me-1"></i>
                                      Start
                                    </>
                                  )}
                                </button>

                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    handleQueueAction(queue._id, "cancel")
                                  }
                                  disabled={
                                    actionLoading === `${queue._id}-cancel`
                                  }
                                >
                                  {actionLoading === `${queue._id}-cancel` ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                  ) : (
                                    <>
                                      <i className="bi bi-x-lg me-1"></i>
                                      Cancel
                                    </>
                                  )}
                                </button>
                              </div>
                            )}

                            {queue.status === "in-consultation" && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() =>
                                  handleQueueAction(queue._id, "complete")
                                }
                                disabled={
                                  actionLoading === `${queue._id}-complete`
                                }
                              >
                                {actionLoading === `${queue._id}-complete` ? (
                                  <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                  <>
                                    <i className="bi bi-check-lg me-1"></i>
                                    Complete
                                  </>
                                )}
                              </button>
                            )}

                            {queue.status === "completed" && (
                              <span className="text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Completed
                              </span>
                            )}

                            {queue.status === "cancelled" && (
                              <span className="text-danger">
                                <i className="bi bi-x-circle me-1"></i>
                                Cancelled
                              </span>
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

export default DoctorQueue;

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../../services/api";

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

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

        const [appointmentsResponse, queueResponse, recordsResponse] =
          await Promise.all([
            api.get("/appointments/my", config),
            api.get("/queue/my", config),
            api.get("/medical-records/my", config),
          ]);

        setAppointments(appointmentsResponse.data.appointments || []);

        setQueue(queueResponse.data.queues || []);

        setMedicalRecords(recordsResponse.data.medicalRecords || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  /*
   * Only scheduled appointments are considered upcoming.
   */
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === "scheduled",
  );

  /*
   * Show the first upcoming appointment.
   */
  const upcomingAppointment =
    upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  /*
   * Find the patient's active queue entry.
   */
  const activeQueue = queue.find(
    (item) => item.status === "waiting" || item.status === "in-consultation",
  );

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        {/* Sidebar */}

        <aside className="col-md-3 col-lg-2 bg-dark text-white min-vh-100 p-3">
          <h3 className="mb-4">MedOps</h3>

          <div className="nav flex-column">
            <Link to="/patient" className="nav-link text-white active">
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

            <Link to="/patient/profile" className="nav-link text-white">
              <i className="bi bi-person me-2"></i>
              Profile
            </Link>

            <button
              className="nav-link text-white text-start border-0 bg-transparent mt-3"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}

        <main className="col-md-9 col-lg-10 p-4">
          {/* Header */}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Patient Dashboard</h2>

              <p className="text-muted mb-0">Welcome back, {user?.name}</p>
            </div>

            <div className="text-end">
              <span className="fw-semibold">{user?.email}</span>

              <div className="text-muted small">Patient</div>
            </div>
          </div>

          {/* Error */}

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Summary Cards */}

          <div className="row g-4 mb-4">
            {/* Upcoming Appointments */}

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-muted mb-1">Upcoming Appointments</p>

                      <h3 className="fw-bold">{upcomingAppointments.length}</h3>
                    </div>

                    <i className="bi bi-calendar-check fs-2 text-primary"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Queue Position */}

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-muted mb-1">Queue Position</p>

                      <h3 className="fw-bold">
                        {activeQueue ? activeQueue.queueNumber : "-"}
                      </h3>
                    </div>

                    <i className="bi bi-list-ol fs-2 text-primary"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Records */}

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-muted mb-1">Medical Records</p>

                      <h3 className="fw-bold">{medicalRecords.length}</h3>
                    </div>

                    <i className="bi bi-file-medical fs-2 text-primary"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Appointment */}

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Upcoming Appointment</h5>

              {upcomingAppointment ? (
                <div className="row">
                  <div className="col-md-8">
                    <h5>
                      Dr. {upcomingAppointment.doctor?.user?.name || "Doctor"}
                    </h5>

                    <p className="text-muted mb-1">
                      {upcomingAppointment.doctor?.specialization ||
                        "Specialization not available"}
                    </p>

                    <p className="mb-1">
                      <i className="bi bi-calendar me-2"></i>

                      {upcomingAppointment.appointmentDate
                        ? new Date(
                            upcomingAppointment.appointmentDate,
                          ).toLocaleDateString()
                        : "Date not available"}
                    </p>

                    <p className="mb-0">
                      <i className="bi bi-clock me-2"></i>

                      {upcomingAppointment.appointmentTime ||
                        "Time not available"}
                    </p>
                  </div>

                  <div className="col-md-4 text-md-end">
                    <span className="badge bg-success">
                      {upcomingAppointment.status}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-calendar-x fs-1 text-muted"></i>

                  <p className="text-muted mt-2 mb-0">
                    No upcoming appointments.
                  </p>

                  <Link
                    to="/patient/appointments/book"
                    className="btn btn-primary mt-3"
                  >
                    Book Appointment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;

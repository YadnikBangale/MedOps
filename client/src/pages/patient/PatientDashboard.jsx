import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        {/* Sidebar */}

        <aside className="col-md-3 col-lg-2 bg-dark text-white min-vh-100 p-3">
          <h3 className="mb-4">MedOps</h3>

          <div className="nav flex-column">
            <a href="/patient" className="nav-link text-white active">
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </a>

            <Link to="/patient/appointments" className="nav-link text-white">
              <i className="bi bi-calendar-check me-2"></i>
              Appointments
            </Link>

            <Link to="/patient/queue" className="nav-link text-white">
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

          {/* Summary Cards */}

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-muted mb-1">Upcoming Appointments</p>

                      <h3 className="fw-bold">1</h3>
                    </div>

                    <i className="bi bi-calendar-check fs-2 text-primary"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-muted mb-1">Queue Position</p>

                      <h3 className="fw-bold">1</h3>
                    </div>

                    <i className="bi bi-list-ol fs-2 text-primary"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-muted mb-1">Medical Records</p>

                      <h3 className="fw-bold">1</h3>
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

              <div className="row">
                <div className="col-md-8">
                  <h5>Dr. Rahul Sharma</h5>

                  <p className="text-muted mb-1">Cardiac Electrophysiology</p>

                  <p className="mb-0">
                    <i className="bi bi-calendar me-2"></i>
                    27 August 2026
                  </p>

                  <p>
                    <i className="bi bi-clock me-2"></i>
                    12:00
                  </p>
                </div>

                <div className="col-md-4 text-md-end">
                  <span className="badge bg-success">Scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;

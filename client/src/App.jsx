import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientAppointments from "./pages/patient/PatientAppointments";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientQueue from "./pages/patient/PatientQueue";

const DoctorDashboard = () => {
    return <h1>Doctor Dashboard</h1>;
};

const AdminDashboard = () => {
    return <h1>Admin Dashboard</h1>;
};

function App() {

    return (
        <AuthProvider>

            <BrowserRouter>

                <Routes>

                    <Route
                        path="/"
                        element={<Navigate to="/login" />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/patient"
                        element={
                            <ProtectedRoute allowedRoles={["patient"]}>
                                <PatientDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/doctor"
                        element={
                            <ProtectedRoute allowedRoles={["doctor"]}>
                                <DoctorDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                  <Route
                    path="/patient/profile"
                    element={
                      <ProtectedRoute allowedRoles={["patient"]}>
                      <PatientProfile />
                    </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/patient/appointments"
                    element={
                      <ProtectedRoute allowedRoles={["patient"]}>
                      <PatientAppointments />
                    </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/patient/appointments/book"
                    element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                      <BookAppointment />
                    </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patient/queue"
                    element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                      <PatientQueue />
                    </ProtectedRoute>
                    }
                  />
                </Routes>

            </BrowserRouter>

        </AuthProvider>
    );
}

export default App;
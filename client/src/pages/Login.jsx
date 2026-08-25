import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            const { token, user } = response.data;

            login(token, user);

            if(user.role === "patient") {
                navigate("/patient");
            }
            else if(user.role === "doctor") {
                navigate("/doctor");
            }
            else if(user.role === "admin") {
                navigate("/admin");
            }

        }
        catch(error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
        finally {

            setLoading(false);
        }
    };

    return (

        <div className="container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center">

            <div className="row w-100 justify-content-center">

                <div className="col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-4 p-md-5">

                            <div className="text-center mb-4">

                                <h1 className="fw-bold text-primary mb-1">
                                    MedOps
                                </h1>

                                <p className="text-muted mb-0">
                                    Hospital Management System
                                </p>

                            </div>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label
                                        htmlFor="email"
                                        className="form-label fw-semibold"
                                    >
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter your email"
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <label
                                        htmlFor="password"
                                        className="form-label fw-semibold"
                                    >
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        required
                                    />

                                </div>

                                {error && (

                                    <div
                                        className="alert alert-danger py-2"
                                        role="alert"
                                    >
                                        {error}
                                    </div>

                                )}

                                <div className="d-grid mt-4">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Logging in..."
                                            : "Login"
                                        }
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                    <p className="text-center text-muted small mt-3">
                        MedOps Hospital Management System
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;
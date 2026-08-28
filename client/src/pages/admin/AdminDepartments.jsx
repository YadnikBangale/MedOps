import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminDepartments = () => {
    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
    });


    const fetchDepartments = async () => {
        try {
            setError("");

            const token = localStorage.getItem("token");

            /*
             * Your current GET /departments endpoint returns
             * only active departments.
             * We will later adjust the backend so Admin can
             * see inactive departments as well.
             */

            const response = await api.get(
                "/departments",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDepartments(
                response.data.departments || []
            );
        }
        catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load departments"
            );
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchDepartments();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setSuccess("");
            setFormLoading(true);

            const token = localStorage.getItem("token");

            if (editingDepartment) {

                const response = await api.put(
                    `/departments/${editingDepartment._id}`,
                    {
                        name: formData.name,
                        description: formData.description,
                        location: formData.location,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setSuccess(
                    response.data.message ||
                    "Department updated successfully"
                );

            }
            else {

                const response = await api.post(
                    "/departments",
                    {
                        name: formData.name,
                        description: formData.description,
                        location: formData.location,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setSuccess(
                    response.data.message ||
                    "Department created successfully"
                );
            }


            setFormData({
                name: "",
                description: "",
                location: "",
            });

            setEditingDepartment(null);
            setShowForm(false);

            await fetchDepartments();

        }
        catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save department"
            );
        }
        finally {
            setFormLoading(false);
        }
    };


    const handleEdit = (department) => {

        setError("");
        setSuccess("");

        setEditingDepartment(department);

        setFormData({
            name: department.name || "",
            description: department.description || "",
            location: department.location || "",
        });

        setShowForm(true);
    };


    const handleToggleStatus = async (departmentId) => {

        try {

            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");

            const response = await api.patch(
                `/departments/${departmentId}/status`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(
                response.data.message
            );

            await fetchDepartments();

        }
        catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to update department status"
            );

        }
    };


    const handleCancel = () => {

        setShowForm(false);
        setEditingDepartment(null);

        setFormData({
            name: "",
            description: "",
            location: "",
        });

        setError("");
    };


    if (loading) {

        return (
            <div className="container-fluid min-vh-100 bg-light d-flex justify-content-center align-items-center">

                <div className="spinner-border text-primary">

                    <span className="visually-hidden">
                        Loading...
                    </span>

                </div>

            </div>
        );
    }


    return (
        <div className="container-fluid min-vh-100 bg-light">

            <div className="row">

                {/* Sidebar */}

                <aside className="col-md-3 col-lg-2 bg-dark text-white min-vh-100 p-3">

                    <h3 className="mb-4">
                        MedOps
                    </h3>

                    <div className="nav flex-column">

                        <Link
                            to="/admin"
                            className="nav-link text-white"
                        >
                            <i className="bi bi-speedometer2 me-2"></i>
                            Dashboard
                        </Link>


                        <Link
                            to="/admin/doctors"
                            className="nav-link text-white"
                        >
                            <i className="bi bi-person-badge me-2"></i>
                            Doctors
                        </Link>


                        <Link
                            to="/admin/patients"
                            className="nav-link text-white"
                        >
                            <i className="bi bi-people me-2"></i>
                            Patients
                        </Link>


                        <Link
                            to="/admin/departments"
                            className="nav-link text-white active"
                        >
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

                            <h2 className="fw-bold mb-1">
                                Departments
                            </h2>

                            <p className="text-muted mb-0">
                                Manage hospital departments
                            </p>

                        </div>


                        <button
                            className="btn btn-primary"
                            onClick={() => {

                                if (showForm) {
                                    handleCancel();
                                }
                                else {

                                    setError("");
                                    setSuccess("");
                                    setEditingDepartment(null);

                                    setFormData({
                                        name: "",
                                        description: "",
                                        location: "",
                                    });

                                    setShowForm(true);
                                }

                            }}
                        >

                            <i className="bi bi-plus-lg me-2"></i>

                            {showForm
                                ? "Close Form"
                                : "Add Department"
                            }

                        </button>

                    </div>


                    {/* Success */}

                    {success && (

                        <div className="alert alert-success">
                            {success}
                        </div>

                    )}


                    {/* Error */}

                    {error && (

                        <div className="alert alert-danger">
                            {error}
                        </div>

                    )}


                    {/* Add / Edit Form */}

                    {showForm && (

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">

                                    {editingDepartment
                                        ? "Edit Department"
                                        : "Add New Department"
                                    }

                                </h5>


                                <form onSubmit={handleSubmit}>

                                    <div className="row g-3">

                                        {/* Name */}

                                        <div className="col-md-6">

                                            <label
                                                className="form-label fw-semibold"
                                                htmlFor="departmentName"
                                            >
                                                Department Name
                                            </label>

                                            <input
                                                id="departmentName"
                                                name="name"
                                                type="text"
                                                className="form-control"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="e.g. Cardiology"
                                                required
                                            />

                                        </div>


                                        {/* Location */}

                                        <div className="col-md-6">

                                            <label
                                                className="form-label fw-semibold"
                                                htmlFor="departmentLocation"
                                            >
                                                Location
                                            </label>

                                            <input
                                                id="departmentLocation"
                                                name="location"
                                                type="text"
                                                className="form-control"
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="e.g. Block A"
                                                required
                                            />

                                        </div>


                                        {/* Description */}

                                        <div className="col-12">

                                            <label
                                                className="form-label fw-semibold"
                                                htmlFor="departmentDescription"
                                            >
                                                Description
                                            </label>

                                            <textarea
                                                id="departmentDescription"
                                                name="description"
                                                className="form-control"
                                                rows="3"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Enter department description"
                                            />

                                        </div>

                                    </div>


                                    {/* Buttons */}

                                    <div className="d-flex gap-2 mt-4">

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={formLoading}
                                        >

                                            {formLoading ? (

                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>

                                                    {editingDepartment
                                                        ? "Updating..."
                                                        : "Creating..."
                                                    }

                                                </>

                                            ) : (

                                                <>
                                                    <i className="bi bi-check-lg me-2"></i>

                                                    {editingDepartment
                                                        ? "Update Department"
                                                        : "Create Department"
                                                    }

                                                </>

                                            )}

                                        </button>


                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    )}


                    {/* Empty State */}

                    {!error && departments.length === 0 && (

                        <div className="card border-0 shadow-sm">

                            <div className="card-body text-center py-5">

                                <i className="bi bi-building-x fs-1 text-muted"></i>

                                <h5 className="mt-3">
                                    No departments found
                                </h5>

                                <p className="text-muted mb-0">
                                    There are currently no active departments.
                                </p>

                            </div>

                        </div>

                    )}


                    {/* Department Table */}

                    {departments.length > 0 && (

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-0">

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle mb-0">

                                        <thead className="table-light">

                                            <tr>

                                                <th className="px-4">
                                                    Department
                                                </th>

                                                <th>
                                                    Description
                                                </th>

                                                <th>
                                                    Location
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {departments.map(
                                                (department) => (

                                                    <tr
                                                        key={department._id}
                                                    >

                                                        {/* Department */}

                                                        <td className="px-4">

                                                            <div className="fw-semibold">

                                                                {department.name}

                                                            </div>

                                                        </td>


                                                        {/* Description */}

                                                        <td>

                                                            {department.description ||
                                                                "N/A"}

                                                        </td>


                                                        {/* Location */}

                                                        <td>

                                                            {department.location ||
                                                                "N/A"}

                                                        </td>


                                                        {/* Status */}

                                                        <td>

                                                            {department.isActive ? (

                                                                <span className="badge bg-success">
                                                                    Active
                                                                </span>

                                                            ) : (

                                                                <span className="badge bg-danger">
                                                                    Inactive
                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* Actions */}

                                                        <td>

                                                            <div className="d-flex gap-2">

                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            department
                                                                        )
                                                                    }
                                                                >

                                                                    <i className="bi bi-pencil me-1"></i>

                                                                    Edit

                                                                </button>


                                                                <button
                                                                    className={`btn btn-sm ${
                                                                        department.isActive
                                                                            ? "btn-outline-danger"
                                                                            : "btn-outline-success"
                                                                    }`}
                                                                    onClick={() =>
                                                                        handleToggleStatus(
                                                                            department._id
                                                                        )
                                                                    }
                                                                >

                                                                    {department.isActive ? (

                                                                        <>
                                                                            <i className="bi bi-building-x me-1"></i>
                                                                            Deactivate
                                                                        </>

                                                                    ) : (

                                                                        <>
                                                                            <i className="bi bi-building-check me-1"></i>
                                                                            Activate
                                                                        </>

                                                                    )}

                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

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

export default AdminDepartments;
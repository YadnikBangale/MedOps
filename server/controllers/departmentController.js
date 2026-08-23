const Department = require("../models/Department");

const createDepartment = async (req, res) => {

    try {

        const {name, description, location } = req.body;

        const existingDepartment = await Department.findOne({name});

        if(existingDepartment) {

            return res.status(400).json({
                success : false,
                message : "Department already exists"
            });
        }

        const department = await Department.create({

            name,
            description,
            location
        });

        res.status(201).json({
            success : true,
            message : "Department created successfully",
            department
        });
    }

    catch(error) {

        console.error("Create department error", error);

        res.status(500).json({
            success : false,
            message : "Server error "
        });
    }
};

const getDepartments = async (req, res) => {

    try {

        const departments = await Department.find({
            isActive : true
        }).sort({ name : 1});

        res.status(200).json({
            success : true,
            count : departments.length,
            departments
        });
    }

    catch(error) {

        console.error("cannot get department", error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });
    }
};

const getDepartmentById = async (req, res) => {

    try {

        const {id} = req.params;

        const department = await Department.findById(id);

        if(!department) {
            return res.status(404).json({
                success : false,
                message : "Department not found"
            });
        }

        res.status(200).json({
            success : true,
            department
        });
    }

    catch(error) {

        console.error("Get department error", error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });
    }
};

const updateDepartment = async (req, res) => {

    try{

        const {id} = req.params;

        const {name, description, location} = req.body;

        const department = await Department.findById(id);

        if(!department) {
            res.status(404).json({
                success : false,
                message : "Department not found"
            });
        }


        if(name !== undefined) {
            department.name = name;
        }

        if (description !== undefined) {
            department.description = description;
        }

        if (location !== undefined) {
            department.location = location;
        }

        await department.save();

        res.status(200).json({
            success : true,
            message : "Department updated",
            department
        });
    }
    catch(error) {

        console.error("Update department error : ", error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });
    }
};

const toggleDepartmentStatus = async (req, res) => {

    try {

        const {id} = req.params;

        const department = await Department.findById(id);

        if(!department) {
            return res.status(404).json({
                success : false,
                message : "Department not found"
            });
        }

        department.isActive = !department.isActive;

        await department.save();

        res.status(200).json({
            success : true,
            message : department.isActive ? "Department activated successfully" : "Department deactivated successfully",
            department
        });
    }

    catch(error) {

        console.error("Toggle department status error", error);

        res.status(500).json({
            success : false,
            message : "Server error"
        });
    }
};

module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    toggleDepartmentStatus
};
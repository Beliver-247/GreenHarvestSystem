const router = require("express").Router();
let StaffMember = require("../models/StaffMember");

// Add staff
router.route("/add-staff").post(async (req, res) => {
    const {
        firstName,
        lastName,
        gender,
        nic,
        email,
        address,
        district,
        contactNumber,
        dob,
        role,
        password,
    } = req.body;

    try {
        const newStaffMember = new StaffMember({
            firstName,
            lastName,
            gender,
            nic,
            email,
            address,
            district,
            contactNumber,
            dob,
            role,
            password, // Include password
        });

        await newStaffMember.save();
        res.status(200).send({ status: "Staff Added" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "An error occurred while adding the staff", error: err.message });
    }
});

// Login staff (for authentication)
router.route("/login").post(async (req, res) => {
    const { email, password } = req.body;

    try {
        const staffMember = await StaffMember.findOne({ email });
        if (!staffMember) {
            return res.status(404).send({ status: "User not found" });
        }

        const isMatch = await staffMember.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send({ status: "Incorrect password" });
        }

        res.status(200).send({ status: "Login successful", staffMember });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "An error occurred during login", error: err.message });
    }
});

// Get only QA-Team members
router.route("/qa-team").get((req, res) => {
    StaffMember.find({ role: "QA-Team" }, { password: 0 }) // Exclude password
        .then((qaTeamMembers) => {
            res.status(200).send({ status: "QA-Team Members Displayed", qaTeamMembers });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "An error occurred while displaying the QA-Team members" });
        });
});

// Get only QA-Manager members
router.route("/qa-manager").get((req, res) => {
    StaffMember.find({ role: "QA-Manager" }, { password: 0 }) // Exclude password
        .then((qaManagerMembers) => {
            res.status(200).send({ status: "QA-Manager Members Displayed", qaManagerMembers });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "An error occurred while displaying the QA-Manager members" });
        });
});

// Display all staff (exclude password)
router.route("/all-staff").get((req, res) => {
    StaffMember.find({}, { password: 0 }) // Exclude password
        .then((staffMembers) => {
            res.status(200).send({ status: "Staff Displayed", staffMembers });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "An error occurred while displaying the staff" });
        });
});

// Update staff
router.route("/update/:id").put(async (req, res) => {
    let staffId = req.params.id;
    const { firstName, lastName, gender, nic, email, address, district, contactNumber, dob, role } = req.body;

    const updateStaff = {
        firstName,
        lastName,
        gender,
        nic,
        email,
        address,
        district,
        contactNumber,
        dob,
        role,
    };

    try {
        await StaffMember.findByIdAndUpdate(staffId, updateStaff);
        res.status(200).send({ status: "Staff Updated" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "An error occurred while updating the staff" });
    }
});

// Remove staff
router.route("/delete/:id").delete(async (req, res) => {
    let staffId = req.params.id;

    try {
        await StaffMember.findByIdAndDelete(staffId);
        res.status(200).send({ status: "Staff Removed" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "An error occurred while removing the staff" });
    }
});

// Fetch a single staff member (exclude password)
router.route("/get/:id").get(async (req, res) => {
    let staffId = req.params.id;

    try {
        const staff = await StaffMember.findById(staffId, { password: 0 }); // Exclude password
        if (!staff) {
            return res.status(404).send({ status: "Staff member not found" });
        }
        res.status(200).send({ status: "Staff Fetched", staff });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "An error occurred while fetching the staff" });
    }
});

module.exports = router;

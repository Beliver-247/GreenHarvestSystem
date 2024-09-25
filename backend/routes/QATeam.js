const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const QATeam = require("../models/QATeam");

// Route to add a new QA team member
router.post("/add", async (req, res) => {
  const { password, name, NIC, contactInfo, birthDay, address, isActive, performanceRating } = req.body;

  // Password validation
  if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
    return res.status(400).json("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.");
  }

  try {
    const newQATeamMember = new QATeam({
      password,
      name,
      NIC,
      contactInfo,
      birthDay,
      address,
      isActive,
      performanceRating,
    });

    await newQATeamMember.save();
    res.json("QA Team Member added successfully!");
  } catch (err) {
    // Handle validation errors specifically
    if (err.name === "ValidationError") {
      const firstErrorMessage = Object.values(err.errors)[0].message;
      return res.status(400).json(firstErrorMessage);  // Send just the message
    }

    res.status(500).json("Internal server error");
  }
});



// Route to get all QA team members
router.get("/", async (req, res) => {
  try {
    const members = await QATeam.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: "Error: " + err });
  }
});

// Route to get a specific QA team member by ID
router.get("/get/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const member = await QATeam.findById(id);
    if (!member) {
      return res.status(404).json({ error: "QA Team Member not found" });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: "Error: " + err });
  }
});

// Route to update a specific QA team member by ID
// Route to update a specific QA team member by ID
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, NIC, contactInfo, birthDay, address, isActive, performanceRating } = req.body;

  try {
    const member = await QATeam.findById(id);
    if (!member) {
      return res.status(404).json({ error: "QA Team Member not found" });
    }

    // Update fields
    member.name = name;
    member.NIC = NIC;
    member.contactInfo = contactInfo;
    member.birthDay = birthDay;
    member.address = address;
    member.isActive = isActive;
    member.performanceRating = performanceRating;

    const updatedMember = await member.save();
    res.json({ message: "QA Team Member updated successfully!", updatedMember });
  } catch (err) {
    if (err.name === "ValidationError") {
      // Extract error messages
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        error: "Validation failed",
        message: messages.join(", ")  // Join multiple error messages if any
      });
    }

    res.status(500).json({ error: "Internal server error", message: err.message });
  }
});






// Route to delete a specific QA team member by ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const member = await QATeam.findByIdAndDelete(id);
    if (!member) {
      return res.status(404).json({ error: "QA Team Member not found" });
    }
    res.json({ message: "QA Team Member deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Error: " + err });
  }
});

module.exports = router;

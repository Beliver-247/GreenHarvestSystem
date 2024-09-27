const express = require("express");
const router = express.Router();
const PickupRequest = require("../models/PickupRequest");
const authenticateFarmer = require("../middleware/authenticateFarmer")

// Create a new pickup request
router.post("/add", async (req, res) => {
  const {
    cropTypes,
    quantities,
    preferredDate,
    preferredTime,
    address,
    location,
    NIC,
  } = req.body;


  console.log("Request Body:", req.body);

  try {
    // Map cropTypes and quantities into the crops array as required by the schema
    const crops = cropTypes.map((cropType, index) => ({
      cropType: cropType,
      quantity: quantities[index], // Pair crop type with its corresponding quantity
    }));

    const newPickupRequest = new PickupRequest({
      NIC,
      crops, // Set the crops array
      preferredDate,
      preferredTime,
      address,
      location,
    });

    const savedRequest = await newPickupRequest.save();
    res
      .status(201)
      .json({ message: "Pickup request added successfully", savedRequest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding pickup request", error: error.message });
  }
});

// Get all pickup requests for the authenticated farmer
// Fetch pickup requests for the authenticated farmer based on NIC
router.get("/pickupRequests", authenticateFarmer, async (req, res) => {
  try {
    const farmerNIC = req.user.nic; // Get NIC from the authenticated farmer's token (req.user)

    // Find pickup requests that match the farmer's NIC
    const pickupRequests = await PickupRequest.find({ NIC: farmerNIC });

    if (!pickupRequests || pickupRequests.length === 0) {
      return res.status(404).json({ message: "No pickup requests found for this farmer" });
    }

    res.status(200).json(pickupRequests);
  } catch (error) {
    console.error("Error fetching pickup requests:", error);
    res.status(500).json({ message: "Server error fetching pickup requests" });
  }
});



// Fetch all pickup requests for admins
router.get('/all-pickup-requests', async (req, res) => {
  try {
    const pickupRequests = await PickupRequest.find();
    res.json(pickupRequests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load pickup requests.' });
  }
});

// Update status of a pickup request
router.put('/update-status/:id', async (req, res) => {
  const { status } = req.body;
  
  try {
    const updatedRequest = await PickupRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

// Get a single pickup request by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pickupRequest = await PickupRequest.findById(id);
    if (!pickupRequest) {
      return res.status(404).json({ message: "Pickup request not found" });
    }
    res.status(200).json(pickupRequest);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving pickup request",
        error: error.message,
      });
  }
});

// Update a pickup request by ID
router.put("/:id", async (req, res) => {
  const {
    NIC,
    preferredDate,
    preferredTime,
    address,
    status,
    crops,
    location,
  } = req.body;

  // Ensure all required fields are present
  if (
    !NIC ||
    !preferredDate ||
    !preferredTime ||
    !address ||
    !location ||
    !location.lat ||
    !location.lng
  ) {
    return res.status(400).json({
      message: "Error updating pickup request",
      error:
        "NIC, preferredDate, preferredTime, address, location.lat, and location.lng are required.",
    });
  }

  try {
    // Update the request and return the modified document
    const updatedRequest = await PickupRequest.findByIdAndUpdate(
      req.params.id,
      {
        NIC,
        preferredDate,
        preferredTime,
        address,
        status,
        crops, // Ensure crops array is passed for update
        location,
      },
      { new: true, runValidators: true } // Run validators and return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Pickup request not found" });
    }

    res.json({
      message: "Pickup request updated successfully",
      updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating pickup request",
      error: error.message,
    });
  }
});

// Delete a pickup request by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await PickupRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Pickup request not found" });
    }
    res
      .status(200)
      .json({ message: "Pickup request deleted successfully", deletedRequest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting pickup request", error: error.message });
  }
});

router.get('/api/pickup-requests/count', async (req, res) => {
  try {
    const pickupRequestCount = await PickupRequest.countDocuments();
    res.json({ count: pickupRequestCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pickup request count' });
  }
});







module.exports = router;

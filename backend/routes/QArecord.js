const router = require("express").Router();
let QARecord = require("../models/QArecord");
let IncomingBatch = require("../models/IncomingBatches");

module.exports = (io) => {
  // Route to add a new QA record
  router.route("/add").post(async (req, res) => {
    const { vegetableType, gradeAWeight, gradeBWeight, gradeCWeight, batchId } = req.body;

    const newQARecord = new QARecord({
      vegetableType,
      gradeAWeight,
      gradeBWeight,
      gradeCWeight,
      batchId
    });

    try {
      // Save the QA Record
      await newQARecord.save();

      // Delete the corresponding batch by batchId
      await IncomingBatch.findByIdAndDelete(batchId);

      // Emit new QA record event to connected clients
      if (io) {
        io.emit("new-qa-record", {
          vegetableType,
          gradeAWeight,
          gradeBWeight,
          gradeCWeight,
          batchId
        });
      }

      res.json("QA Record added successfully and Incoming Batch deleted!");
    } catch (err) {
      res.status(400).json("Error: " + err);
    }
  });

  // Route to get all QA records
  router.route("/").get((req, res) => {
    QARecord.find()
      .then(records => res.json(records)) // The generated ID will be included in the response
      .catch(err => res.status(400).json("Error: " + err));
  });

  // Route to get a specific QA record by ID
  router.route("/get/:id").get((req, res) => {
    const { id } = req.params;

    QARecord.findById(id)
      .then(record => res.json(record)) // The generated ID will be included in the response
      .catch(err => res.status(400).json("Error: " + err));
  });

  // Route to update a specific QA record by ID
  router.route("/update/:id").put((req, res) => {
    const { id } = req.params;
    const { vegetableType, gradeAWeight, gradeBWeight, gradeCWeight } = req.body;

    QARecord.findById(id)
      .then(record => {
        record.vegetableType = vegetableType;
        record.gradeAWeight = gradeAWeight;
        record.gradeBWeight = gradeBWeight;
        record.gradeCWeight = gradeCWeight;

        record.save()
          .then(() => res.json("QA Record updated successfully!"))
          .catch(err => res.status(400).json("Error: " + err));
      })
      .catch(err => res.status(400).json("Error: " + err));
  });

  // Route to get only grade C records
router.route("/gradeC").get((req, res) => {
  QARecord.find({ gradeCWeight: { $gt: 0 } })
    .then(records => res.json(records))
    .catch(err => res.status(400).json("Error: " + err));
});


  // Route to delete a specific QA record by ID
  router.route("/delete/:id").delete((req, res) => {
    const { id } = req.params;

    QARecord.findByIdAndDelete(id)
      .then(() => res.json("QA Record deleted."))
      .catch(err => res.status(400).json("Error: " + err));
  });

  return router;
};

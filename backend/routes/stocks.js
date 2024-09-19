const router = require("express").Router();
let Stock = require("../models/Stock");

//add stock
router.route("/add").post((req,res) => {
    const vegType = req.body.vegType;
    const qualityGrade = req.body.qualityGrade;
    const batchNumber = req.body.batchNumber;
    const quantity = req.body.quantity;
    const expDate = req.body.expDate;

    const newStock = new Stock({
        vegType,
        qualityGrade,
        batchNumber,
        quantity,
        expDate
    })

    newStock.save().then(() => {
        res.status(200).send({status: "Stock Added"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "An error occured while adding the stock"})
    })
})

//Display stock
router.route("/all-stocks").get((req,res) => {
    Stock.find().then((stocks) => {
        res.status(200).send({status: "Stock Displayed", stocks});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "An error occured while displaying the stock"});
    })
})

//Update stock
router.route("/update/:stockId").put(async (req,res) => {
    let stockId = req.params.stockId;
    const {vegType, qualityGrade, batchNumber, quantity, expDate} = req.body;

    const updateStock = {
        vegType,
        qualityGrade,
        batchNumber,
        quantity,
        expDate
    }

    const update = await Stock.findByIdAndUpdate(stockId, updateStock).then(() => {
        res.status(200).send({status: "Stock Updated"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "An error occured while updating the stock"});
    })
})

//Remove stock
router.route("/delete/:stockId").delete(async (req,res) => {
    let stockId = req.params.stockId;

    await Stock.findByIdAndDelete(stockId).then(() => {
        res.status(200).send({status: "Stock Removed"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "An error occured while removing the stock"});
    })
})

//Fetch a stock
router.route("/get/:stockId").get(async (req,res) => {
    let stockId = req.params.stockId;

    const stock = await Stock.findById(stockId).then((stock) => {
        res.status(200).send({status: "Stock Fetched", stock});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "An error occured while fetching the stock"});
    })
})

module.exports = router;
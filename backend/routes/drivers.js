const router = require('express').Router();
let Driver = require('../models/Driver');

router.route('/add').post((req, res) =>{
    const name = req.body.name;
    const nic = req.body.nic;
    const dob = req.body.dob;
    const licenseExpDate = req.body.licenseExpDate;
    const mobileNo = Number(req.body.mobileNo);
    const email = req.body.email;
    const password = req.body.password;
    

    const newDriver = new Driver({
        name,
        nic,
        dob,
        licenseExpDate,
        mobileNo,
        email,
        password

    })

    newDriver.save().then(()=> {
        res.json("Driver added");
    }).catch(err =>{
        console.log(err);
    })

})

router.route("/").get((req, res)=> {
    Driver.find().then((drivers)=>{ 
        res.json(drivers)
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/update/:driverid").put(async(req, res) => {
    let driverid = req.params.driverid;
    const { name,nic,dob,licenseExpDate,mobileNo,email,password} = req.body;

    const updateDriver= {
        name,
        nic,
        dob,
        licenseExpDate,
        mobileNo,
        email,
        password
    };

    try {
        const update = await Driver.findByIdAndUpdate(driverid, updateDriver, { new: true });
        if (update) {
            res.status(200).send({ status: 'updated', driver: update });
        } else {
            res.status(404).send({ status: 'Driver not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: 'Error with updating', error: err.message });
    }
});


router.route("/delete/:driverid").delete(async (req, res) => {
    let userId = req.params.driverid; 

    await Driver.findByIdAndDelete(userId).then(() => {
        res.status(200).send({status:'success'});
    }).catch(err => {
        console.log(err);
        res.status(500).send({status:'error'});
    })
})

module.exports = router;
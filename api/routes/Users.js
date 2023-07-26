const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const verify = require("../verifyToken")

//update !!! 

router.put("/:id", verify, async(req, res)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt
            (req.body.password, SECRET_KEY).toString();
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set:req.body
                }, 
                { 
                    new: true
                 });

            res.status(200).json(updatedUser)
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("Та зөвхөн өөрийн бүртгэлээ шинэчлэх боломжтой")
    }
})

//delete !!!

router.delete("/:id", verify, async(req, res)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        try {
            await User.findByIdAndDelete(req.params.id);

            res.status(200).json("Хэрэглэгчийг устгасан!")
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("Та зөвхөн өөрийн бүртгэлээ устгах боломжтой")
    }
})

//get !!!

router.get("/find/:id", async(req, res)=>{
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err);
        }

})

//get all !!!

router.get("/", async(req, res)=>{
    const query = req.query.new;
    if(req.user.isAdmin){
        try {
            const user = query ? 
            await User.find().sort({_id:-1}).
            limit(10) : await User.find();
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("зөвхөн админыг зөвшөөрнө")
    }
});

//get users stat

router.get("/stats", async (req, res)=>{
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear() -1);
    
    const mouthsArray = [
        "1-дүгээр сар",
        "2-дугаар сар",
        "3-дугаар сар",
        "4-дүгээр сар",
        "5-дугаар сар",
        "6-дугаар сар",
        "7-дугаар сар",
        "8-дугаар сар",
        "9-дүгээр сар",
        "10-дугаар сар",
        "11-дүгээр сар",
        "12-дугаар сар",
    ];

    try {
        const data = await User.aggregate([
            {
                $project:{
                    month: {$month: "$createdAt"},
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1 },
                },
            },
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
});


module.exports = router;
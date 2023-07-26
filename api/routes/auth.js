const router =  require("express").Router();
const { response } = require("express");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");


router.post("/register",  async (req, res)=>{
    const newUser = new User
    (
        {
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, SECRET_KEY).toString()
        }
    );
    try{
        const user = await newUser.save();
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err);
    }
})

//login !!!

router.post("/login", async (req,res)=>{
    try {
        const user =  await User.findOne({email: req.body.email});
        !user && res.status(401).json("буруу нууц үг эсвэл эмэйл");

        const bytes  = CryptoJS.AES.decrypt(user.password, SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password && res.status(401).json("буруу нууц үг эсвэл эмэйл");

        const accessToken = jwt.sign({ 
            id: user._id, isAdmin: user.isAdmin}, 
            SECRET_KEY, {expiresIn: "7d"});

        res.status(200).json({user, accessToken});
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;
const router = require("express").Router();
const { query } = require("express");
const List = require("../models/List");
const verify = require("../verifyToken");
const { aggregate } = require("../models/Movie");

//Create

router.post("/", verify, async(req, res)=>{
    if(req.user.isAdmin){
        const newList = new List(req.body);

        try {
            const savedList = await newList.save();
            res.status(200).json(savedList)
        } catch (err) {
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("зөвхөн админыг зөвшөөрнө")
    }
})

//delete list 

router.delete("/:id", verify, async(req, res)=>{
    if(req.user.isAdmin){
        try {
            await List.findByIdAndDelete(req.params.id);
            res.status(200).json("жагсаалтыг устгасан")
        } catch (err) {
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("зөвхөн админыг зөвшөөрнө")
    }
})

// get lists

router.get("/", verify, async(req, res)=>{
    const typeQuery = req.query.type;
    const genreQuery  = req.query.genre;
    let list = [];

    try {
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([{$sample:{size: 2}},
                {$match: {type:typeQuery, genre: genreQuery}}
                ]);
            }else{
                list = await List.aggregate([{$sample:{size: 2}},
                {$match: {type:typeQuery}}])
            }
        }
        else{
            list = await List.aggregate([{$sample:{size: 2}}]);
        }
        res.status(200).json(list)
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router;
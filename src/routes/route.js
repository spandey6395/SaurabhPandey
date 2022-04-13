const express = require('express');
const router = express.Router();
// const UserModel= require("../models/userModel.js")
const bookmodel= require("../bookmodel/bookmodel.js")
// const UserController= require("../controllers/userController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

// router.post("/createUser", UserController.createUser  )

// router.get("/getUsersData", UserController.getUsersData)



router.post("/book", async function(req,res){

    let book =  req.body
    let saveBook = await bookmodel.create(book)
    res.send({msg:saveBook})


    })

router.get("/bookList", async function(req,res){

    let allBooks= await bookmodel.find().select({bookName:1, authorName:1, _id:0 })
    res.send({msg: allBooks})
})

router.get("/getBooksInYear", async function(req, res){
    let inYear= req.query.year
    let allBooksinYear= await bookmodel.find({year: inYear}).select({_id:0, _v: 0,createdAt:0, updatedAt:0})
    res.send({msg: allBooksinYear})
    
})

router.post("/getParticularBooks", async function(req, res){
    let key= req.body
    let ParticularBooks= await bookmodel.find(key).select({_id:0, _v: 0,createdAt:0, updatedAt:0})
    res.send({msg: ParticularBooks})
    
})

// router.get("/getXINRBooks", async function(req, res){
//     let INRBooks= await bookmodel.find({prices: {indianPrice: {$in : [100, 200, 500] } }})
//     res.send({msg: INRBooks})
    
// })

router.get("/getRandomBooks", async function(req, res){
    let RandomBooks= await bookmodel.find({ $or: [{stockAvailable: true}, {pages: {$gt : 500}}]   })
    res.send({msg: RandomBooks})                        
    
})

module.exports = router;
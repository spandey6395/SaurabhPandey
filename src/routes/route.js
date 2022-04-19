const express = require('express');
const router = express.Router();

// const authorController= require("../controllers/authorController")
// const bookController= require("../controllers/bookController")

const batchesController = require("../controllers/batchesController")




router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

// router.post("/createAuthor", authorController.createAuthor  )

// router.get("/getAuthorsData", authorController.getAuthorsData)

// router.post("/createBook", bookController.createBook  )

// router.get("/getBooksData", bookController.getBooksData)

// router.get("/getBooksWithAuthorDetails", bookController.getBooksWithAuthorDetails)


//......................



router.post("/createBatch",batchesController.createBatch)
router.post("/createDevloper",batchesController.createDevloper)
router.get("/schlorship-devlopers",batchesController.scholarship)
router.get("/developers",batchesController.getdevloper)



module.exports = router;
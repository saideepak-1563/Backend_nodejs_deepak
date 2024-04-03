const express = require("express")
const verifyToken = require ("../middleware/verifyToken")
const firmController = require("../controllers/firmController")

const router = express.Router()

router.post('/addfirm',verifyToken,firmController.addFirm)

router.get('/uploads/:imageName', (req,res)=>{
    const imageName = req.params.imageName
    res.headersSent('content-Type','image/jpeg')
    res.sendFile(path.join(__dirname,'..','uploads',imageName))
})

router.delete('/:firmId',firmController.deleteFirmById)


module.exports = router
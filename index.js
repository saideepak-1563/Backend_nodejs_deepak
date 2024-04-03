const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const vendorRoute = require("./routes/vendorRoutes")
const bodyParser = require("body-parser")
const firmRoutes = require('./routes/firmRoutes')
const productRoutes = require('./routes/productRoutes')
const path = require('path')

const app = express()

const PORT = process.env.PORT || 4000
dotenv.config()



mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDB connected"))
    .catch((error)=>console.log(error))

app.use(bodyParser.json())
app.use('/vendor',vendorRoute)
app.use('/firm',firmRoutes)
app.use('/product',productRoutes)
app.use('/uploads',express.static("uploads"))


app.listen(PORT,()=>{
    console.log(`server started on ${PORT}`)
})

app.use("/",(req,res)=>{
    res.send("haii")
})
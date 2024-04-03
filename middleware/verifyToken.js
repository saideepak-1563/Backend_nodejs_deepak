const Vendor = require("../models/Vendor")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const { trace } = require("../routes/vendorRoutes")

dotenv.config()

const secretKey = process.env.WhatIsYourName

const verifyToken = async(req,res,next)=>{
    const token = req.headers.token

    if(!token){
        return res.status(401).json({error: "token required"})
    }

    try {
        const decoded = jwt.verify(token,secretKey)
        const vendor = await Vendor.findById(decoded.vendorId)

        if(!decoded){
            return res.status(401).json({error:"vendor not found"})
        }

        req.vendorId = vendor._id

        next()

    } catch (error) {
        console.error(error)
        return res.status(500).json({error:"invalid token"})
    }
}

module.exports = verifyToken
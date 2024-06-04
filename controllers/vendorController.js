const Vendor = require('../models/Vendor')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config()

const secretKey = process.env.WhatIsYourName


// const vendorRegister = async (req,res)=>{
//     const {username, email, password} = req.body
    
//     try {
//         const vendorEmail = await Vendor.findOne({email})
//         if(vendorEmail){
//             return res.status(400).json("email already exist")
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newVendor = new Vendor({
//             username,
//             email,
//             password : hashedPassword,
//         })

//         await newVendor.save()
        
//         res.status(201).json({message: "Vendor Registered Successfully"})
//         console.log("registered")

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({error:"internal server error"})
//     }
// }


const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if any of the required fields are missing
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if the email already exists in the database
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // Ensure password is not undefined

        // Create a new vendor instance with the hashed password
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword,
        });

        // Save the new vendor to the database
        await newVendor.save();

        // Respond with a success message
        res.status(201).json({ message: "Vendor Registered Successfully" });
    } catch (error) {
        // Handle any errors that occur during registration
        console.error("Error in vendor registration:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const vendorLogin = async(req,res)=>{
    const { email, password} = req.body

    try {
        const vendor = await Vendor.findOne({email})

        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error: "invalid username and password"})
        }

        const token = jwt.sign({vendorId: vendor._id}, secretKey, {expiresIn: "1h"})


        res.status(200).json({success: "login successfully", token})
        console.log(email, "this is token", token)

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal error"})
    }
}

const getAllVendors = async (req,res)=>{
    try {
        const vendors = await Vendor.find().populate('firm')
        res.json({vendors})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal"})
    }
}

const getVendorById = async(req,res)=>{
    const vendorId = req.params.id

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm')
        if(!vendor){
            return res.status(404).json({error:"vendor not found"})
        }
        res.status(200).json({vendor})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal"})
    }
}

module.exports = {vendorRegister, vendorLogin, getAllVendors, getVendorById}
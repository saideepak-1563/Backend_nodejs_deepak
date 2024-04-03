const mongoose = require("mongoose")

const firmSchema = new mongoose.Schema({
    firmName:{
        type: String,
        require: true,
        unique: true,
    },
    area: {
        type: String,
        require: true,
    },
    category: {
        type: [
            {
                type: String,
                enum: ["veg","non-veg"]
            }
        ]
    },
    region:{
        type:[
            {
                type:String,
                enum: ["south-indian","north-indian","chinise","bakery"]
            }
        ]
    },
    offer:{
        type: String,

    },
    image:{
        type: String,
        require: true
    },
    vendor:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'vendor'
        }
    ],
    product:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})

const Firm = mongoose.model("Firm",firmSchema)

module.exports = Firm
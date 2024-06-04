const Firm = require("../models/Firm");
const Product = require("../models/product")
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      // Generate a unique filename for uploaded files
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

const addProduct = async(req,res)=>{
    try {
        const {productName, price, category, bestSeller, description} = req.body;
        
        const image = req.file?req.file.filename : undefined;

        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId)

        if(!firm){
            return res.status(404).json({error:"no firm added"})
        }


        const product = new Product({
            productName, price, category, bestSeller, description, image, firm: firm._id
        })

        const savedProduct = await product.save()

        firm.product.push(savedProduct)

        await firm.save()

        res.status(200).json(savedProduct)

    } catch (error) {
        console.error(error)
        res.status(500).json({error:"internal error"})
    }
}

const getProductByFirm = async(req,res)=>{
    try {
        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId)

        if(!firm){
            return res.status(404).json({error:"no firm found"})
        }

        const resturantName = firm.firmName
        const products = await Product.find({firm: firmId})

        res.status(200).json({resturantName, products})

    } catch (error) {
        console.error(error)
        res.status(500).json({error:"internal error"})
    }
}

const deleteProductByid = async(req,res)=>{
    try {
        const productId = req.params.productId

        const deleteProduct = await Product.findByIdAndDelete(productId)

        if(!deleteProduct){
            return res.status(404).json({error:"no product found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"internal error"})
    }
}

module.exports = {addProduct:[upload.single('image'),addProduct], getProductByFirm, deleteProductByid}
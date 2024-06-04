const Firm = require("../models/Firm")
const multer = require("multer")
const Vendor = require("../models/Vendor")
const path = require ('path')

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


const addFirm = async (req,res)=>{

    try {
        
    const {firmName, area, category, region, offer} = req.body

    const image = req.file?req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId)

    if(!vendor){
        res.status(404).json({message:"vendor not found"})
    }


    const firm = new Firm({
        firmName, area, category, region, offer, image, vendor:vendor._id
    })

    const savedFirm = await firm.save()

    vendor.firm.push(savedFirm)

    await vendor.save()

    return res.status(200).json({message:"firm added sucessfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json("internal error")
    }
}

const deleteFirmById = async(req,res)=>{
  try {
      const productId = req.params.firmId

      const deleteProduct = await Firm.findByIdAndDelete(productId)

      if(!deleteProduct){
          return res.status(404).json({error:"no product found"})
      }
  } catch (error) {
      console.error(error)
      res.status(500).json({error:"internal error"})
  }
}


module.exports = {addFirm: [upload.single('image'),addFirm],deleteFirmById}
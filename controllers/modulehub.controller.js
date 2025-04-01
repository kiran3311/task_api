
const ModuleHubModel = require("../models/ModuleHubModel")

exports.createmodulehub = async(req,res)=>{
    try {
        const{hubname,hubdetails, productid,hubcode} = req.body
        const newModuleHub = await ModuleHubModel.create({
            MODULEHUBNAME:hubname,
            HUBDETAILS:hubdetails,
            PRODUCTID:productid,
            HUBCODE:hubcode
        })
        return res.status(201).json({
            success: true,
            message: "Module Hub created Successfully.",
            data: newModuleHub
        })
        
    } catch (error) {
        console.log("Error in create modulehub api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in create modulehub api",
            error: error.message
        })
        
    }
}



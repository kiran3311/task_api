
const ManagerUserMappingModal = require("../models/ManagerUserMappingModal")
const ProductModel = require("../models/ProductModel")
const { Op } = require('sequelize');
const oracledb = require("oracledb")
const{getConnection } = require("../dbconnection")

// exports.createproduct = async(req,res)=>{
//     let connection;
//     try {
//         const { productcode, productname } = req.body
//         connection = await getConnection();
//         const query = `INSERT INTO PRODUCTS (PRODUCTCODE, PRODUCTNAME) VALUES (:productcode, :productname, :createdAt, :updatedAt) RETURNING ID INTO :id`;
//         const binds = [productcode, productname];
//         const currentTimestamp = new Date()

//         const result = await connection.execute(
//             `INSERT INTO PRODUCTS (PRODUCTCODE, PRODUCTNAME, CREATEDAT, UPDATEDAT) 
//              VALUES (:productcode, :productname, :createdAt, :updatedAt) 
//              RETURNING ID INTO :id`,
//             {
//                 productcode,
//                 productname,
//                 createdAt: currentTimestamp,
//                 updatedAt: currentTimestamp,
//                 id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } // Returning ID
//             },
//             { autoCommit: true } // Commit transaction
//         );
//         const newProductId = result.outBinds.id[0]; 
//         console.log("✅ Product inserted successfully!");
//         return res.status(201).json({
//                         success: true,
//                         message: "Product created Successfully.",
//                         data: {
//                             id: newProductId,
//                            // projectname: newProduct.PRODUCTNAME
//                         }
//                     })
//     }catch (error) {
//         console.error("❌ Error inserting product:", error);
//         return res.status(400).json({
//                         success: false,
//                         message: "Some error occured in createproduct api",
//                         error: error.message,
//                         data: {
//                             id: "",
//                             projectname: ""
//                         }
//                     })
//     } finally {
//         if (connection) {
//             await connection.close();
//         }
//     }
// }




// exports.createproduct = async (req, res) => {
//     try {
//         const { productcode, productname } = req.body
//         const newProduct = await ProductModel.create({
//             PRODUCTCODE: productcode,
//             PRODUCTNAME: productname,
//         },
//         {
//             returning: ['ID', 'PRODUCTCODE', 'PRODUCTNAME', 'CREATEDAT', 'UPDATEDAT']  
//         })

//         return res.status(201).json({
//             success: true,
//             message: "Product created Successfully.",
//             data: {
//                 id: newProduct.ID,
//                 projectname: newProduct.PRODUCTNAME
//             }
//         })
//     } catch (error) {
//         console.log("Error in create product api", error)
//         return res.status(400).json({
//             success: false,
//             message: "Some error occured in createproduct api",
//             error: error.message,
//             data: {
//                 id: "",
//                 projectname: ""
//             }
//         })
//     }
// }



exports.createproduct = async (req, res) => {
    try {
        const { productcode, productname } = req.body
        const newProduct = await ProductModel.create({
            PRODUCTCODE: productcode,
            PRODUCTNAME: productname,
        })

        return res.status(201).json({
            success: true,
            message: "Product created Successfully.",
            data: {
                id: newProduct.ID,
                projectname: newProduct.PRODUCTNAME
            }
        })
    } catch (error) {
        console.log("Error in create product api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createproduct api",
            error: error.message,
            data: {
                id: "",
                projectname: ""
            }
        })
    }
}


// exports.getallproducts = async (req, res) => {
//     try {
//         const allprojects = await ProductModel.findAll({
//             order: [['PRODUCTNAME', 'ASC']],
//             attributes: ['ID', 'PRODUCTCODE', 'PRODUCTNAME'],
//         })

//         const newAllProjects = allprojects.map(project => {
//             return {
//                 id: project.ID,
//                 productcode: project.PRODUCTCODE,
//                 productname: project.PRODUCTNAME,
//             }
//         })
//         return res.status(200).json({
//             success: true,
//             message: "getallproducts fetched Successfully.",
//             data: newAllProjects
//         })
//     } catch (error) {
//         console.log("Error in getallproducts api", error)
//         return res.status(400).json({
//             success: false,
//             message: "Some error occured in getallproducts api",
//             error: error.message,
//             data: []
//         })
//     }
// }

// exports.getallproductsfortask = async (req, res) => {
//     try {

//         let productidList = await ManagerUserMappingModal.findAll({
//             where: {
//                 MANAGERID: req.user.id
//             },
//             attributes: ['PRODUCTID']
//         })


//         const productids = productidList.map(product => product.PRODUCTID)

//         if (productids.length <= 0) {
//             return res.status(201).json({
//                 success: true,
//                 message: "Successfully fetched getallproductsfortask",
//                 data: []
//             })
//         }
//         const allproductid = await ProductModel.findAll({
//             where: {
//                 ID: {
//                     [Op.in]: productids
//                 },
//             },
//             order: [['PRODUCTNAME', 'ASC']],
//             attributes: ['ID', 'PRODUCTCODE', 'PRODUCTNAME'],
//         })

//         const newAllProducts = allproductid.map(product => {
//             return {
//                 id: product.ID,
//                 productcode: product.PRODUCTCODE,
//                 productname: product.PRODUCTNAME,
//             }
//         })
//         return res.status(200).json({
//             success: true,
//             message: "getallproducts fetched Successfully.",
//             data: newAllProducts
//         })
//     } catch (error) {
//         console.log("Error in getallproducts api", error)
//         return res.status(400).json({
//             success: false,
//             message: "Some error occured in getallproducts api",
//             error: error.message,
//             data: []
//         })
//     }
// }



// exports.getproductbyid = async (req, res) => {
//     try {
//         const { productid } = req.params
//         const productDetails = await ProductModel.findOne({
//             where: {
//                 ID: productid
//             },
//             attributes: ['ID', 'PRODUCTCODE', 'PRODUCTNAME'],
//         })

//         let newProduct =
//         {
//             id: productDetails.ID,
//             productcode: productDetails.PRODUCTCODE,
//             productname: productDetails.PRODUCTNAME,


//         }

//         return res.status(200).json({
//             success: true,
//             message: "Product fetched Successfully.",
//             data: newProduct
//         });
//     } catch (error) {
//         console.log("Error in getproduct details api", error)
//         return res.status(400).json({
//             success: false,
//             message: "Some error occured in getallusers api",
//             error: error.message,
//             data: []
//         });
//     }
// }



// exports.editproductbyid = async (req, res) => {
//     try {
//         const { productid } = req.params
//         let {
//             productcode,
//             productname,
//         } = req.body;


//         const updateProduct = await ProductModel.update(
//             {
//                 PRODUCTCODE: productcode,
//                 PRODUCTNAME: productname,

//             },
//             { where: { ID: productid } }
//         );

//         if (updateProduct[0] === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found or no changes made",
//                 data: null
//             });
//         }

//         return res.status(201).json({
//             success: true,
//             message: "Product updated successfully",
//             data: {
//                 id: productid,
//                 productcode: productcode
//             }

//         })
//     }
//     catch (error) {

//         console.error("Error updating product:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message
//         });

//     }
// }


// exports.createproduct = async (req, res) => {
//     try {
//         const { productcode, productname } = req.body
//         const newProduct = await ProductModel.create({
//             PRODUCTCODE: productcode,
//             PRODUCTNAME: productname,
//         })

//         return res.status(201).json({
//             success: true,
//             message: "Product created Successfully.",
//             data: {
//                 id: newProduct.ID,
//                 projectname: newProduct.PRODUCTNAME
//             }
//         })
//     } catch (error) {
//         console.log("Error in create product api", error)
//         return res.status(400).json({
//             success: false,
//             message: "Some error occured in createproduct api",
//             error: error.message,
//             data: {
//                 id: "",
//                 projectname: ""
//             }
//         })
//     }
// }

// exports.getallproducts = async (req, res) => {
//     try {
//         const allprojects = await ProductModel.findAll({
//             order: [['PRODUCTNAME', 'ASC']],
//             attributes: ['ID', 'PRODUCTCODE', 'PRODUCTNAME'],
//         })

//         const newAllProjects = allprojects.map(project => {
//             return {
//                 id: project.ID,
//                 productcode: project.PRODUCTCODE,
//                 productname: project.PRODUCTNAME,
//             }
//         })
//         return res.status(200).json({
//             success: true,
//             message: "getallproducts fetched Successfully.",
//             data: newAllProjects
//         })
//     } catch (error) {
//         console.log("Error in getallproducts api", error)
//         return res.status(400).json({
//             success: false,
//             message: "Some error occured in getallproducts api",
//             error: error.message,
//             data: []
//         })
//     }
// }


// exports.getproductbyid = async (req, res) => {
//     try {
//         const { productid } = req.params
//         const productDetails = await ProductModel.findOne({
//             where: {
//                 ID: productid
//             },
//             attributes: ['ID', 'PRODUCTCODE', 'PRODUCTNAME'],
//         })

//         let newProduct =
//         {
//             id: productDetails.ID,
//             productcode: productDetails.PRODUCTCODE,
//             productname: productDetails.PRODUCTNAME,


//         }

//         return res.status(200).json({
//             success: true,
//             message: "Product fetched Successfully.",
//             data: newProduct
//         });
//     } catch (error) {
//         console.log("Error in getproduct details api", error)
//         return res.status(400).json({
//             success: false,
//             message: "Some error occured in getallusers api",
//             error: error.message,
//             data: []
//         });
//     }
// }



// exports.editproductbyid = async (req, res) => {
//     try {
//         const { productid } = req.params
//         let {
//             productcode,
//             productname,
//         } = req.body;


//         const updateProduct = await ProductModel.update(
//             {
//                 PRODUCTCODE: productcode,
//                 PRODUCTNAME: productname,

//             },
//             { where: { ID: productid } }
//         );

//         if (updateProduct[0] === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Product not found or no changes made",
//                 data: null
//             });
//         }

//         return res.status(201).json({
//             success: true,
//             message: "Product updated successfully",
//             data: {
//                 id: productid,
//                 productcode: productcode
//             }

//         })
//     }
//     catch (error) {

//         console.error("Error updating product:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message
//         });

//     }
// }









////------------------------------------------------------------------------------------------------------------




//const ProductModel = require("../models/ProductModel")

// exports.createproduct = async (req, res) => {
//     try {
//         const { productcode, productname } = req.body
//         const newProduct = await ProductModel.create({
//             PRODUCTCODE: productcode,
//             PRODUCTNAME: productname,
//         })

//         return res.status(201).json({
//             success: true,
//             message: "Product created Successfully.",
//             data: {
//                 id: newProduct.ID,
//                 projectname: newProduct.PRODUCTNAME
//             }
//         })
//     } catch (error) {
//         console.log("Error in create product api", error)
//         return res.status(400).json({
//             success: false,
//             message: "Some error occured in createproduct api",
//             error: error.message,
//             data: {
//                 id: "",
//                 projectname: ""
//             }
//         })
//     }
// }

exports.getallproducts = async (req, res) => {
    try {
        const allprojects = await ProductModel.findAll({
            order: [['PRODUCTNAME', 'ASC']],
            attributes: ['ID', 'PRODUCTCODE', 'PRODUCTNAME'],
        })

        const newAllProjects = allprojects.map(project => {
            return {
                id: project.ID,
                productcode: project.PRODUCTCODE,
                productname: project.PRODUCTNAME,
            }
        })
        return res.status(200).json({
            success: true,
            message: "getallproducts fetched Successfully.",
            data: newAllProjects
        })
    } catch (error) {
        console.log("Error in getallproducts api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallproducts api",
            error: error.message,
            data: []
        })
    }
}


exports.getproductbyid = async (req, res) => {
    try {
        const { productid } = req.params
        const productDetails = await ProductModel.findOne({
            where: {
                ID: productid
            },
            attributes: ['ID', 'PRODUCTCODE', 'PRODUCTNAME'],
        })

        let newProduct =
        {
            id: productDetails.ID,
            productcode: productDetails.PRODUCTCODE,
            productname: productDetails.PRODUCTNAME,


        }

        return res.status(200).json({
            success: true,
            message: "Product fetched Successfully.",
            data: newProduct
        });
    } catch (error) {
        console.log("Error in getproduct details api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallusers api",
            error: error.message,
            data: []
        });
    }
}



exports.editproductbyid = async (req, res) => {
    try {
        const { productid } = req.params
        let {
            productcode,
            productname,
             } = req.body;
    

        const updateProduct = await ProductModel.update(
            {
                PRODUCTCODE: productcode,
                PRODUCTNAME: productname,
                
            },
            { where: { ID: productid } }
        );

        if (updateProduct[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found or no changes made",
                data: null
            });
        }

        return res.status(201).json({
            success: true,
            message: "Product updated successfully",
            data: {
                id: productid,
                productcode: productcode
            }

        })
    }
    catch (error) {

        console.error("Error updating product:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });

    }
}


exports.getallproductsfortask = async (req, res) => {
    try {
        const role = req.user.role
        let productidList;
        if(role === "admin" || role === "manager"){
            productidList = await ManagerUserMappingModal.findAll({

                attributes: ['PRODUCTID']
            })
        }
        else{
            productidList = await ManagerUserMappingModal.findAll({

                where: {
                    MANAGERID: req.user.id
                },
                attributes: ['PRODUCTID']
            })
        }
        


        const productids = productidList.map(product => product.PRODUCTID)

        console.log("products-------------", req.user)

        if (productids.length <= 0) {
            return res.status(201).json({
                success: true,
                message: "Successfully fetched getallproductsfortask",
                data: []
            })
        }
        const allproductid = await ProductModel.findAll({
            where: {
                ID: {
                    [Op.in]: productids
                },
            },
            order: [['PRODUCTNAME', 'ASC']],
            attributes: ['ID', 'PRODUCTCODE', 'PRODUCTNAME'],
        })

        const newAllProducts = allproductid.map(product => {
            return {
                id: product.ID,
                productcode: product.PRODUCTCODE,
                productname: product.PRODUCTNAME,
            }
        })
        return res.status(200).json({
            success: true,
            message: "getallproducts fetched Successfully.",
            data: newAllProducts
        })
    } catch (error) {
        console.log("Error in getallproducts api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallproducts api",
            error: error.message,
            data: []
        })
    }
}

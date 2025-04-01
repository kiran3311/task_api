
const ClientModel = require("../models/ClientModel")
const ClientProductMappingModel = require("../models/ClientProductMappingModel")
const ProductModel = require("../models/ProductModel")
const { Sequelize, sequelize, Op } = require('sequelize');

exports.createclient = async (req, res) => {
    try {
        const { clientcode, clientname, clientdetails, productList } = req.body
        let client;
        client = await ClientModel.findOne({
            where: {
                CLIENTCODE: clientcode,
            }
        })

        // if CLIENTCODE does not exist create client and their mappings
        if (!client) {
            client = await ClientModel.create({
                CLIENTCODE: clientcode,
                CLIENTNAME: clientname,
                CLIENTDETAILS: clientdetails,
            },
                {
                    attributes: ["ID"],
                })


            const clientProductMappingArray = productList.map(product => {
                return {
                    CLIENTID: client.ID,
                    PRODUCTID: Number(product),
                    CREATEDAT: new Date(),
                    UPDATEDAT: new Date()
                }
            })

            const mappingResult = await ClientProductMappingModel.bulkCreate(clientProductMappingArray)
            return res.status(201).json({
                success: true,
                message: "Client created Successfully.",
                data: mappingResult
            })
        }

        const existingMapping = await ClientProductMappingModel.findAll({
            where: {
                PRODUCTID: {
                    [Op.in]: productList.map(p => Number(p))
                },
                CLIENTID: client.ID
            },
            attributes: ["ID", "PRODUCTID", "CLIENTID"],
        })


        const newMapping = productList.map(product => {
            return {
                PRODUCTID: Number(product),
                CLIENTID: client.ID,
                CREATEDAT: new Date(),
                UPDATEDAT: new Date()
            }
        })

        const mappingToAdd = newMapping.filter(newMap => {
            // Check if new mapping data is not present in existing mapping
            return !existingMapping.some(existingMap => {
                return (
                    existingMap.PRODUCTID === newMap.PRODUCTID &&
                    existingMap.CLIENTID === newMap.CLIENTID
                );
            });
        });

        const newmappingResult = await ClientProductMappingModel.bulkCreate(mappingToAdd);

        return res.status(201).json({
            success: true,
            message: "Client created Successfully.",
            data: newmappingResult,
            existingMapping,
            mappingToAdd,

        })
    } catch (error) {
        console.log("Error in create client api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createclient api",
            error: error.message,
            data: {}
        })
    }
}

exports.getallclients = async (req, res) => {
    try {
        const allclient = await ClientModel.findAll({
            order: [['CLIENTNAME', 'ASC']],
            attributes: ['ID', 'CLIENTCODE', 'CLIENTNAME', 'CLIENTDETAILS'],
        })

        const newAllClient = allclient.map(client => {
            return {
                id: client.ID,
                clientcode: client.CLIENTCODE,
                clientname: client.CLIENTNAME,
                clientdetails: client.CLIENTDETAILS,

            }
        })
        return res.status(200).json({
            success: true,
            message: "getallclients fetched Successfully.",
            data: newAllClient
        })
    } catch (error) {
        console.log("Error in getallclients api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallclients api",
            error: error.message,
            data: []
        })
    }
}

exports.getclientbyproductid = async (req, res) => {
    try {
        const { productid } = req.params
        const clientsInMapping = await ClientProductMappingModel.findAll({
            where: {
                PRODUCTID: productid
            },

            include: [
                {
                    model: ClientModel,

                    as: 'client',
                    attributes: ['ID', 'CLIENTCODE', 'CLIENTNAME', 'CLIENTDETAILS'],
                },
            ],
            order: [[{ model: ClientModel, as: 'client' }, 'CLIENTNAME', 'ASC']],
        });



        const newClientObj = clientsInMapping.map(client => {
            return {
                id: client.client.ID,
                clientcode: client.client.CLIENTCODE,
                clientname: client.client.CLIENTNAME,
                clientdetails: client.client.CLIENTDETAILS,
            }
        })

        return res.status(200).json({
            success: true,
            message: "getallclients fetched Successfully.",
            data: newClientObj
        })
    } catch (error) {
        console.log("Error in getallclients api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallclients api",
            error: error.message,
            data: []
        })
    }
}

const isProductCheck = (productid, mappedProduct) => {
    let isProductExist = mappedProduct.find(f => Number(f.ID) === Number(productid))
    return isProductExist ? true : false
}


exports.getclientbyclientid = async (req, res) => {
    try {
        const { clientid } = req.params
        const clients = await ClientModel.findOne({
            where: {
                ID: clientid
            },
            attributes: ['ID', 'CLIENTCODE', 'CLIENTNAME', 'CLIENTDETAILS'],
            include: [
                {
                    model: ClientProductMappingModel,
                    as: "clientproductmappings",
                    include: [
                        {
                            model: ProductModel,
                            as: "product",
                            attributes: ["ID", "PRODUCTNAME", "PRODUCTCODE"]
                        },
                    ]
                }
            ]
        })


        const newClients = {
            id: clients.ID,
            clientcode: clients.CLIENTCODE,
            clientname: clients.CLIENTNAME,
            products: clients.clientproductmappings.map(map => {
                return {
                    id: map.ID,
                    productname: map.product.PRODUCTNAME,
                    productcode: map.product.PRODUCTCODE,
                }
            })
        }



        // console.log("clients =?",JSON.stringify(clients,null,2))

        // productid:clients.client.product.ID,
        // productname:clients.client.product.PRODUCTNAME,


        return res.status(200).json({
            success: true,
            message: "getallclients fetched Successfully.",
            data: newClients
        })
    } catch (error) {
        console.log("Error in getallclients api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallclients api",
            error: error.message,
            data: []
        })
    }
}


exports.getclientandproductmappingbyclientid = async (req, res) => {
    try {
        const { clientid } = req.params
        const clients = await ClientModel.findOne({
            where: {
                ID: clientid
            },
            attributes: ['ID', 'CLIENTCODE', 'CLIENTNAME', 'CLIENTDETAILS'],
            include: [
                {
                    model: ClientProductMappingModel,
                    as: "clientproductmappings",
                    include: [
                        {
                            model: ProductModel,
                            as: "product",
                            attributes: ["ID", "PRODUCTNAME", "PRODUCTCODE"]
                        },
                    ]
                }
            ]
        })

        let mappedProduct = clients.clientproductmappings.map(map => {
            return map.product
        })


        const allproducts = await ProductModel.findAll({
            order: [['PRODUCTNAME', 'ASC']],
            attributes: ['ID', 'PRODUCTCODE', 'PRODUCTNAME'],
        })

        const newAllProducts = allproducts.map(project => {
            return {
                id: project.ID,
                productcode: project.PRODUCTCODE,
                productname: project.PRODUCTNAME,
            }
        })


        const newClients = {
            id: clients.ID,
            clientcode: clients.CLIENTCODE,
            clientname: clients.CLIENTNAME,
            products: newAllProducts.map(map => {
                return {
                    id: map.id,
                    productname: map.productcode,
                    productcode: map.productname,
                    isChecked: isProductCheck(map.id, mappedProduct)
                }
            })
        }

        const defaultValues = mappedProduct.map(map => {
            return map.ID.toString();
        })



        // console.log("clients =?",JSON.stringify(clients,null,2))

        // productid:clients.client.product.ID,
        // productname:clients.client.product.PRODUCTNAME,


        return res.status(200).json({
            success: true,
            message: "getallclients fetched Successfully.",
            data: { clients: newClients, defaultValues: defaultValues },
        })
    } catch (error) {
        console.log("Error in getallclients api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallclients api",
            error: error.message,
            data: []
        })
    }
}


exports.editclient = async (req, res) => {
    try {
        const { clientcode, clientname, clientdetails, productList } = req.body
        let client;
        client = await ClientModel.findOne({
            where: {
                CLIENTCODE: clientcode,
            },
            include: [
                {
                    model: ClientProductMappingModel,
                    as: "clientproductmappings",
                    include: [
                        {
                            model: ProductModel,
                            as: "product",
                            attributes: ["ID", "PRODUCTNAME", "PRODUCTCODE"]
                        },
                    ]
                }
            ]
        })

        ///////////////////////////
        const existingMapping = await ClientProductMappingModel.findAll({
            where: {
                PRODUCTID: {
                    [Op.in]: productList.map(p => Number(p))
                },
                CLIENTID: client.ID
            },
            attributes: ["ID", "PRODUCTID", "CLIENTID"],
        })


        const newMapping = productList.map(product => {
            return {
                PRODUCTID: Number(product),
                CLIENTID: client.ID,
                CREATEDAT: new Date(),
                UPDATEDAT: new Date()
            }
        })

        const mappingToAdd = newMapping.filter(newMap => {
            // Check if new mapping data is not present in existing mapping
            return !existingMapping.some(existingMap => {
                return (
                    existingMap.PRODUCTID === newMap.PRODUCTID &&
                    existingMap.CLIENTID === newMap.CLIENTID
                );
            });
        });

        const mappingToDelete = newMapping.filter(newMap => {
            // Check if new mapping data is not present in existing mapping
            return existingMapping.some(existingMap => {
                return (
                    existingMap.PRODUCTID === newMap.PRODUCTID &&
                    existingMap.CLIENTID === newMap.CLIENTID
                );
            });
        });


        const newmappingResult = await ClientProductMappingModel.bulkCreate(mappingToAdd);

        return res.status(201).json({
            success: true,
            message: "Client created Successfully.",
            data: newmappingResult
        })
    } catch (error) {
        console.log("Error in create client api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createclient api",
            error: error.message,
            data: {}
        })
    }
}

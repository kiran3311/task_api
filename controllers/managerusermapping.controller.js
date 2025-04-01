const ManagerUserMappingModal = require("../models/ManagerUserMappingModal");
const ProductModel = require("../models/ProductModel");
const UserModel = require("../models/UserModel")
const { Sequelize, sequelize, Op } = require('sequelize');
exports.createmanagerusermapping = async (req, res) => {
    try {
        const { productid, managerid, userlist } = req.body;

        const existingMapping = await ManagerUserMappingModal.findAll({
            where: {
                PRODUCTID: productid,
                MANAGERID: managerid,
                USERID: {
                    [Op.in]: userlist.map(u => Number(u))
                },
            },
            attributes: ["ID", "MANAGERID", "PRODUCTID", "USERID"],
        })


        const newMapping = userlist.map(user => {
            return {
                USERID: Number(user),
                PRODUCTID: productid,
                MANAGERID: managerid,
                CREATEDAT: new Date(),
                UPDATEDAT: new Date()
            }
        })

        const mappingToAdd = newMapping.filter(newMap => {
            // Check if new mapping data is not present in existing mapping
            return !existingMapping.some(existingMap => {
                return (
                    existingMap.USERID === newMap.USERID &&
                    existingMap.PRODUCTID === newMap.PRODUCTID &&
                    existingMap.MANAGERID === newMap.MANAGERID
                );
            });
        });


        const mappingResult = await ManagerUserMappingModal.bulkCreate(mappingToAdd);

        return res.status(201).json({
            success: true,
            message: "Manager user mapping created",
            mappingToAdd: mappingToAdd,
            data: mappingResult,
        })
    } catch (error) {
        console.log("Error in createmanagerusermapping   api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createmanagerusermapping api",
            error: error.message,
            data: {}
        })
    }
}

exports.getmanagerusermapping = async (req, res) => {
    try {
        const managers = await ManagerUserMappingModal.findAll({
            attributes: ['MANAGERID'],
            group: ['MANAGERID']
        });

        const managerList = managers.map(m => {
            return m.MANAGERID
        })

        const managersResult = await UserModel.findAll({
            order: [['USERNAME', 'ASC']],
            where: {
                ID: {
                    [Op.in]: managerList,
                },
            },
            attributes: ["ID", "FULLNAME", "USERNAME"],

        })

        const finalResult = managersResult.map(m => {
            return {
                id: m.ID,
                fullname: m.FULLNAME,
            }
        })

        return res.status(200).json({
            success: true,
            message: "Successfully fetched manager user mapping",
            data: finalResult
        })
    } catch (error) {
        console.log("Error in getmanagerusermapping   api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getmanagerusermapping api",
            error: error.message,
            data: {}
        })
    }
}

exports.getprojectleadbyproductid = async (req, res) => {
    try {
        const { productid } = req.params

        const managers = await ManagerUserMappingModal.findAll({

            where: {
                PRODUCTID: productid
            },
            attributes: ['MANAGERID'],
            group: ['MANAGERID']
        });


        const managerList = managers.map(m => {
            return m.MANAGERID
        })

        const managersResult = await UserModel.findAll({
            order: [['USERNAME', 'ASC']],
            where: {
                ID: {
                    [Op.in]: managerList,
                },
            },
            attributes: ["ID", "FULLNAME", "USERNAME"],

        })

        const newManagerResult = managersResult.map(user => {
            return {
                id: user.ID,
                fullname: user.FULLNAME,
                username: user.USERNAME
            }
        })


        return res.status(200).json({
            success: true,
            data: newManagerResult
        })
    } catch (err) {
        console.log("Error in getteamleadbyproduct api", err)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getteamleadbyproduct api",
            error: err.message,
            data: []
        })
    }
}

exports.getusersbyprojectidandprojectleadid = async (req, res) => {
    try {
        const { productid, managerid } = req.params
        const users = await ManagerUserMappingModal.findAll({
            order: [
                [{ model: UserModel, as: 'user' }, 'FULLNAME'] // Ordering by user's FULLNAME attribute
            ],

            where: {
                PRODUCTID: productid,
                MANAGERID: managerid
            },
            attributes: ["ID", "USERID"],
            include: [
                {
                    model: UserModel,
                    as: "user",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
            ]
        });

        const userlist = users.map(user => {
            return {
                id: user.user.ID,
                fullname: user.user.FULLNAME,
                username: user.user.USERNAME,
            }
        })
        return res.status(200).json({
            success: true,
            data: userlist
        })
    } catch (err) {
        console.log("Error in getusersbyprojectidandprojectleadid api", err)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getusersbyprojectidandprojectleadid api",
            error: err.message,
            data: []
        })
    }
}



exports.getteammanagermapping = async (req, res) => {
    try {
        const mappings = await ManagerUserMappingModal.findAll({
            order: [
                [{ model: UserModel, as: 'manager' }, 'FULLNAME', 'ASC'],
                [{ model: ProductModel, as: 'product' }, 'PRODUCTCODE', 'ASC']
            ],
            attributes: ["ID", "USERID"],
            include: [
                {
                    model: UserModel,
                    as: "manager",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: ProductModel,
                    as: "product",
                    attributes: ['ID', 'PRODUCTCODE', "PRODUCTNAME"],
                },
            ]
        });

        // Create a Set to store unique mappings based on product ID and manager ID
        const uniqueMappings = new Set();

        // Filter out duplicates manually
        const filteredMappings = mappings.filter(map => {
            const mappingKey = `${map.product.ID}-${map.manager.ID}`;
            if (!uniqueMappings.has(mappingKey)) {
                uniqueMappings.add(mappingKey);
                return true;
            }
            return false;
        });

        // Transform filtered mappings into desired format
        const newMappings = filteredMappings.map(map => {
            return {
                id: map.ID,
                product: {
                    id: map.product.ID,
                    productcode: map.product.PRODUCTCODE,
                    productname: map.product.PRODUCTNAME,
                },
                manager: {
                    id: map.manager.ID,
                    fullname: map.manager.FULLNAME,
                    username: map.manager.USERNAME,
                }
            }
        });
        return res.status(200).json({
            success: true,
            data: newMappings,
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: err
        })
    }
}

exports.getusermapping = async (req, res) => {
    try {
        const { managerid, productid } = req.params;
        const mappings = await ManagerUserMappingModal.findAll({
            where: {
                PRODUCTID: productid,
                MANAGERID: managerid
            },
            order: [
                [{ model: UserModel, as: 'user' }, 'USERNAME', 'ASC'],
            ],
            attributes: ["ID", "USERID"],
            include: [
                {
                    model: UserModel,
                    as: "manager",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                }, {
                    model: UserModel,
                    as: "user",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: ProductModel,
                    as: "product",
                    attributes: ['ID', 'PRODUCTCODE', "PRODUCTNAME"],
                },
            ],

        });

        const newMappings = mappings.map(map => {
            return {
                id: map.ID,
                product: {
                    id: map.product.ID,
                    productcode: map.product.PRODUCTCODE,
                    productname: map.product.PRODUCTNAME,
                },
                manager: {
                    id: map.manager.ID,
                    fullname: map.manager.FULLNAME,
                    username: map.manager.USERNAME,
                },
                user: {
                    id: map.user.ID,
                    fullname: map.user.FULLNAME,
                    username: map.user.USERNAME,
                }
            }
        })

        const users = newMappings.map(u => {
            return {
                id: u.user.id,
                fullname: u.user.fullname,
                username: u.user.username,
            }
        })
        return res.status(200).json({
            success: true,
            data: {
                id: newMappings.id,
                productid: newMappings[0].product.id,
                productname: newMappings[0].product.productname,
                managerid: newMappings[0].manager.id,
                managerfullname: newMappings[0].manager.fullname,
                users: users
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: err,
            success: false,
            message: "Error in getusermapping API"
        })
    }
}


exports.editmanagerusermapping = async (req, res) => {
    try {
        const { productid, managerid, userlist } = req.body;

        const existingMapping = await ManagerUserMappingModal.findAll({
            where: {
                PRODUCTID: productid,
                MANAGERID: managerid,
                USERID: {
                    [Op.in]: userlist.map(u => Number(u))
                },
            },
            attributes: ["ID", "MANAGERID", "PRODUCTID", "USERID"],
        })


        const newMapping = userlist.map(user => {
            return {
                USERID: Number(user),
                PRODUCTID: productid,
                MANAGERID: managerid,
                CREATEDAT: new Date(),
                UPDATEDAT: new Date()
            }
        })

        const mappingToAdd = newMapping.filter(newMap => {
            // Check if new mapping data is not present in existing mapping
            return !existingMapping.some(existingMap => {
                return (
                    existingMap.USERID === newMap.USERID &&
                    existingMap.PRODUCTID === newMap.PRODUCTID &&
                    existingMap.MANAGERID === newMap.MANAGERID
                );
            });
        });

        const mappingRemove = newMapping.filter(newMap => {
            // Check if new mapping data is not present in existing mapping
            return existingMapping.some(existingMap => {
                return (
                    existingMap.USERID === newMap.USERID &&
                    existingMap.PRODUCTID === newMap.PRODUCTID &&
                    existingMap.MANAGERID === newMap.MANAGERID
                );
            });
        });


        // const mappingResult = await ManagerUserMappingModal.bulkCreate(mappingToAdd);

        return res.status(201).json({
            success: true,
            message: "Manager user mapping created",
            newMapping,
            mappingToAdd: mappingToAdd,
            data: mappingResult,
            mappingRemove
        })
    } catch (error) {
        console.log("Error in createmanagerusermapping   api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createmanagerusermapping api",
            error: error.message,
            data: {}
        })
    }
}


const ProductModel = require("../models/ProductModel")
const ProjectModel = require("../models/ProjectModel")

exports.createproject = async (req, res) => {
    try {
        const { projectcode, projectcategory, projectname, productid } = req.body
        const newProject = await ProjectModel.create({
            PROJECTCODE: projectcode,
            PROJECTCATEGORY: projectcategory,
            PROJECTNAME: projectname,
            PRODUCTID: productid
        })

        return res.status(201).json({
            success: true,
            message: "Project created Successfully.",
            data: {
                id: newProject.ID,
                projectcode: newProject.PROJECTCODE
            }
        })
    } catch (error) {
        console.log("Error in create project api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createproject api",
            error: error.message,
            data: {
                id: "",
                projectcode: ""
            }
        })
    }
}

exports.getallprojects = async (req, res) => {
    try {
        const allprojects = await ProjectModel.findAll({
            order: [['PROJECTNAME', 'ASC']],
            attributes: ['ID', 'PROJECTCODE', 'PROJECTCATEGORY', 'PROJECTNAME', 'PRODUCTID'],
            include: [
                { model: ProductModel, as: "product", attributes: ["ID", "PRODUCTCODE", "PRODUCTNAME"] }
            ]
        })


        console.log(allprojects)

        const newAllProjects = allprojects.map(project => {
            return {
                id: project.ID,
                projectcode: project.PROJECTCODE,
                projectcategory: project.PROJECTCATEGORY,
                projectname: project.PROJECTNAME,
                productid: project.PRODUCTID,
                product: {
                    id: project.product.ID,
                    productcode: project.product.PRODUCTCODE,
                    productname: project.product.PRODUCTNAME
                }

            }
        })

        console.log("Product =< ", JSON.stringify(allprojects[0].product))

        return res.status(200).json({
            success: true,
            message: "getallprojects fetched Successfully.",
            data: newAllProjects
        })
    } catch (error) {
        console.log("Error in getallprojects api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallprojects api",
            error: error.message,
            data: []
        })
    }
}



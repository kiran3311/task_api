
const { where } = require("sequelize")
const ModuleModel = require("../models/ModuleModel")
const ProjectModel = require("../models/ProjectModel")
exports.createmodule = async (req, res) => {
    try {
        const { modulename, moduledescription, projectid, weightage, modulehubid } = req.body
        const newModule = await ModuleModel.create({
            MODULENAME: modulename,
            MODULEDESCRIPTION: moduledescription,
            PROJECTID: projectid,
            WEIGHTAGE: weightage,
            MODULEHUBID: modulehubid
        })

        return res.status(201).json({
            success: true,
            message: "Module created Successfully.",
            data: {
                id: newModule.ID,
                modulename: newModule.MODULENAME,
                moduledescription: newModule.MODULEDESCRIPTION,
                weightage: newModule.WEIGHTAGE

            }
        })
    } catch (error) {
        console.log("Error in create createmodule api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createmodule api",
            error: error.message,
            data: {
                id: "",
                modulename: "",
                moduledescription: ""
            }
        })
    }
}

exports.getallmodules = async (req, res) => {
    try {
        const allmodule = await ModuleModel.findAll({
            where: { ISDELETE: false },
            order: [['CREATEDAT', 'DESC']],
            include: [
                {
                    model: ProjectModel,
                    as: "project",
                    attributes: ['ID', 'PROJECTNAME'], // Specify the attributes you want from the User model
                },
            ],
            attributes: ['ID', 'MODULENAME', 'MODULEDESCRIPTION', 'WEIGHTAGE'],
        })

        const moduleData = {
            id: allmodule?.ID,
            modulename: allmodule?.MODULENAME,
            moduledescription: allmodule?.MODULEDESCRIPTION,
            weightage: allmodule?.WEIGHTAGE,
            project: allmodule?.ProjectModel?.PROJECTNAME
        }
        return res.status(200).json({
            success: true,
            message: "getallmodules fetched Successfully.",
            data: allmodule
        })
    } catch (error) {
        console.log("Error in getallmodules api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallmodules api",
            error: error.message,
            data: []
        })
    }
}


exports.getmodulebyprojectid = async (req, res) => {
    try {
        const { projectid } = req.params;
        const allmodule = await ModuleModel.findAll({
            include: [
                {
                    model: ProjectModel,
                    as: "project",
                    where: {
                        ID: projectid,
                    },
                    attributes: ['ID', 'PROJECTNAME'], // Specify the attributes you want from the User model
                },
            ],
            attributes: ['ID', 'MODULENAME', 'MODULEDESCRIPTION', 'WEIGHTAGE'],
        })

        return res.status(200).json({
            success: true,
            message: "getmodulebyprojectid fetched Successfully.",
            data: allmodule
        })
    } catch (error) {
        console.log("Error in getmodulebyprojectid api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getmodulebyprojectid api",
            error: error.message,
            data: []
        })
    }
}


exports.getmodulebyid = async (req, res) => {
    try {
        const { moduleid } = req.params;

        const getmodule = await ModuleModel.findOne({
            where: {
                ID: moduleid
            },
            attributes: ['ID', 'MODULENAME', 'MODULEDESCRIPTION', 'WEIGHTAGE'],

            include: [
                {
                    model: ProjectModel,
                    as: "project",
                    attributes: ['ID', 'PROJECTNAME']
                }
            ]
        })

        const moduledata = {

            id: getmodule?.ID,
            modulename: getmodule?.MODULENAME,
            moduledescription: getmodule?.MODULEDESCRIPTION,
            weightage: getmodule?.WEIGHTAGE,
            projectid: getmodule?.ProjectModel?.ID,

        }
        return res.status(200).json({
            success: true,
            message: "getmoduleby moduleid fetched Successfully.",
            data: getmodule
        })

    }
    catch (error) {

        console.log("Get error in fetch module by module id", error)
        return res.status(400).json({
            success: false,
            message: "Got some error in fetch module by module id",
            error: error.message,
            date: []
        })


    }

}



exports.updatemodule = async (req, res) => {

    try {

        const { moduleid } = req.params;
        const { modulename, moduledescription, projectid, weightage } = req.body

        const updatedmodule = await ModuleModel.update(
            {
                MODULENAME: modulename,
                MODULEDESCRIPTION: moduledescription,
                PROJECTID: projectid,
                WEIGHTAGE: weightage
            },
            {
                where: { ID: moduleid }

            })

        if (updatedmodule[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Module not found or no changes made",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "module updated succesfully",
            data: updatedmodule
        })

    } catch (error) {
        console.log("error in update module api", error)
        return res.status(400).json({
            success: false,
            message: "error in update module api",
            error: error.message,
            data: []
        })

    }


}


exports.deletemodulekbyid = async (req, res) => {

    try {
        const { moduleid } = req.params;
        const deleteModule = await ModuleModel.update(

            {
                ISDELETE: true
            },
            {
                where: { ID: moduleid },

            },

        )

        res.status(200).json({
            success: true,
            message: "module deleted successfully",
            data: deleteModule
        })
    } catch (error) {
        console.log("error in delete api", error)
        res.status(400).json({
            success: false,
            message: "error in delete api",
            error: error.message,
            data: []
        })

    }
}
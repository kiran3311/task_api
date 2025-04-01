
const TaskdescriptionModel = require("../models//TaskdescriptionModel")

exports.createtaskdescription = async (req, res) => {
    try {
        const { tasktype, taskdescription } = req.body
        const newtaskdescription = await TaskdescriptionModel.create({
            TASKDESCRIPTION: taskdescription,
            TASKTYPE: tasktype
        })

        return res.status(201).json({
            success: true,
            message: "Taskdescription created Successfully.",
            data: {
                id: newtaskdescription.ID,
                taskdescription: newtaskdescription.TASKDESCRIPTION
            }
        })
    } catch (error) {
        console.log("Error in create createtaskdescription api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createtaskdescription api",
            error: error.message,
            data: {
                id: "",
                taskdescription: ""
            }
        })
    }
}

exports.getalltaskdescription = async (req, res) => {
    try {
        const alltaskdescription = await TaskdescriptionModel.findAll({
            order: [['TASKDESCRIPTION', 'ASC']],
            attributes: ['ID', 'TASKDESCRIPTION', 'TASKTYPE'],
        })

        const newAllTaskDescription = alltaskdescription.map(td => {
            return {
                id: td.ID,
                taskdescription: td.TASKDESCRIPTION,
                tasktype: td.TASKTYPE,

            }
        })
        return res.status(200).json({
            success: true,
            message: "getalltaskdescription fetched Successfully.",
            data: newAllTaskDescription
        })
    } catch (error) {
        console.log("Error in getalltaskdescription api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getalltaskdescription api",
            error: error.message,
            data: []
        })
    }
}

exports.getalltaskdescriptionbytasktype = async (req, res) => {
    try {
        const { tasktype } = req.params;
        const alltaskdescription = await TaskdescriptionModel.findAll({
            order: [['TASKDESCRIPTION', 'ASC']],
            where: {
                TASKTYPE: tasktype
            },
            attributes: ['ID', 'TASKDESCRIPTION', 'TASKTYPE'],
        })

        const newAllTaskDescription = alltaskdescription.map(td => {
            return {
                id: td.ID,
                taskdescription: td.TASKDESCRIPTION,
                tasktype: td.TASKTYPE,
            }
        })
        return res.status(200).json({
            success: true,
            message: "getalltaskdescription fetched Successfully.",
            data: newAllTaskDescription
        })
    }
    catch (error) {
        console.log("Error in getalltaskdescription api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getalltaskdescription api",
            error: error.message,
            data: []
        })
    }
}

exports.gettasktypebyrole = async (req, res) => {
    try {
        const role = req.user.role;

        let taskType = [
            { key: "Development", value: "Development" },
            { key: "Support", value: "Support" },
        ]

        // if (role === 'support') {
        //     taskType = [
        //         { key: "Support", value: "Support" },
        //     ]
        // }

        return res.status(200).json({
            success: true,
            message: "successfully fetched tasktype ",
            data: taskType
        })
    } catch (err) {
        console.log("Error in gettasktypebyrole api", err)
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}


exports.gettaskdescriptionbyid = async(req, res)=>{

    try {
        const { tdid } = req.params
        const tdDetails = await TaskdescriptionModel.findOne({
            where: {
                ID: tdid
            },
            attributes: ['ID', 'TASKDESCRIPTION','TASKTYPE' ],
        })

        let newTd =
        {
            id: tdDetails.ID,
            taskdescription: tdDetails.TASKDESCRIPTION,
            tasktype: tdDetails.TASKTYPE,
                  
        }

        return res.status(200).json({
            success: true,
            message: "taskdescription fetched Successfully.",
            data: newTd
        });
    } catch (error) {
        console.log("Error in get task description details api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in taskdescription api",
            error: error.message,
            data: []
        });
    }

}


exports.edittaskdescriptionbyid = async (req,res)=>{

    try {
        const { tdid } = req.params
        let {
            taskdescription,
            tasktype,
             } = req.body;

           

        console.log(taskdescription, tasktype)

        const updateTaskdsc = await TaskdescriptionModel.update(
            {   
                TASKDESCRIPTION: taskdescription,
                TASKTYPE: tasktype,  
                
            },
            { where: { ID: tdid } }
        );

        if (updateTaskdsc[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Taskdescription not found or no changes made",
                data: null
            });
        }

        return res.status(201).json({
            success: true,
            message: "Taskdescription updated successfully",
            data: {
                id: tdid,
                taskdescription: taskdescription
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
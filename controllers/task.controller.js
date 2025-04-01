const moment = require("moment")
const TaskModel = require("../models/TaskModel")
const TaskHistoryModel = require("../models/TaskHistoryModel")
const ProductModel = require("../models/ProductModel")
const ProjectModel = require("../models/ProjectModel")
const ClientModel = require("../models/ClientModel")
const TaskdescriptionModel = require("../models/TaskdescriptionModel")
const UserModel = require("../models/UserModel")
const ModuleModel = require("../models/ModuleModel")
const TaskCommentModel = require("../models/TaskCommentModel")
const ManagerUserMappingModal = require("../models/ManagerUserMappingModal")
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { calculateDateDifference } = require('../helpers/task.helper');
const { QueryTypes } = require('sequelize');
exports.createtask = async (req, res) => {
    try {
        let { tasks, mainTaskDetails } = req.body
        let newDataObj = tasks.map(task => {
            for (let name in task) {
                let uppercaseName = name.toUpperCase()
                delete task.id
                task[uppercaseName] = task[name]
                delete task[name]


                if (name === "ACTUALSTARTDATE") {
                    task[name].actualstartdate = new Date(task[name])
                    task = { ...task, [name]: task[name] };
                } else if (name === "DUEDATE") {
                    task[name].duedate = new Date(task[name])
                    task = { ...task, [name]: task[name] };
                } else if (name === "COMPLETIONDATE") {
                    task[name].duedate = new Date(task[name])
                    task = { ...task, [name]: task[name] };
                } else if (name === "ASSIGNSTARTDATE") {
                    task[name].assignstartdate = new Date(task[name])
                    task = { ...task, [name]: task[name] };
                }
            }

            if (task.STATUS === "In Progress ") {
                task.ACTUALSTARTDATE = new Date();
            }
            if (task.STATUS === "Close") {
                task.ACTUALSTARTDATE = new Date();
                task.COMPLETIONDATE = new Date();
            }


            task.CREATEDBY = req.user.id;
            task.UPDATEDBY = req.user.id;
            task.UPDATEDAT = new Date();
            task.CREATEDAT = new Date();

            for (let name in mainTaskDetails) {
                let uppercaseName = name.toUpperCase()
                mainTaskDetails[uppercaseName] = mainTaskDetails[name]
                delete mainTaskDetails[name]
            }


            // for (let name in mainTaskDetails) {
            //     name = name.toUpperCase()
            //     if (name === "ACTUALSTARTDATE") {
            //         task[name].actualstartdate = new Date(task[name])
            //         task = { ...task, [name]: task[name] };
            //     } else if (name === "DUEDATE") {
            //         task[name].duedate = new Date(task[name])
            //         task = { ...task, [name]: task[name] };
            //     } else if (name === "COMPLETIONDATE") {
            //         task[name].duedate = new Date(task[name])
            //         task = { ...task, [name]: task[name] };
            //     } else if (name === "ASSIGNSTARTDATE") {
            //         task[name].assignstartdate = new Date(task[name])
            //         task = { ...task, [name]: task[name] };
            //     }
            // }

            return { ...task, ...mainTaskDetails, percentage: 0 }
        })

        const tasksResult = await TaskModel.bulkCreate(newDataObj)

        const newTaskHisory = tasksResult.map(task => {
            let taskId = task.ID;
            delete task.ID;

            return { ...task.dataValues, TASKID: taskId };
        })

        await TaskHistoryModel.bulkCreate(newTaskHisory)

        return res.status(201).json({
            success: true,
            message: "Successfully created tasks",
            data: tasksResult
        })
    } catch (error) {
        console.log("Error in createtask api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createtask api",
            error: error.message,
            data: {
                id: "",
                projectnameclientname: ""
            }
        })
    }
}


exports.getalltask = async (req, res) => {
    try {
        let tasks = []

        if (req.user.role === "admin" || req.user.role === "manager") {
            let productidList = await ManagerUserMappingModal.findAll({
                // where: {
                //     MANAGERID: req.user.id
                // },
                attributes: ['PRODUCTID']
            })

            const productids = productidList.map(product => product.PRODUCTID)

            tasks = await TaskModel.findAll({
                order: [['CREATEDAT', 'DESC']],
                where: {
                    ISDELETE: false,
                    PRODUCTID: {
                        [Op.in]: productids
                    },
                },
                include: [
                    {
                        model: ClientModel,
                        as: "client",
                        attributes: ["ID", "CLIENTNAME"]
                    },
                    {
                        model: ProductModel,
                        as: "product",
                        attributes: ["ID", "PRODUCTNAME"]
                    },
                    {
                        model: ProjectModel,
                        as: "project",
                        attributes: ['ID', 'PROJECTNAME'], // Specify the attributes you want from the User model
                    },
                    {
                        model: UserModel,
                        as: "assigneeuser",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: TaskdescriptionModel,
                        as: "taskdescription",
                        attributes: ['ID', 'TASKTYPE', "TASKDESCRIPTION"],
                    },
                ],
                attributes: ['ID', 'TASKNAME', 'REMARKFORINNERHTML', "STATUS", "PRIORITY", "ASSIGNSTARTDATE", "COMPLETIONDATE", 'PERCENTAGE'],
            })

        } else if (req.user.role === "user") {
            tasks = await TaskModel.findAll({
                order: [['CREATEDAT', 'DESC']],
                where: {
                    ASSIGNEEUSERID: req.user.id,
                    ISDELETE: false,
                },
                include: [
                    {
                        model: ClientModel,
                        as: "client",
                        attributes: ["ID", "CLIENTNAME"]
                    },
                    {
                        model: ProductModel,
                        as: "product",
                        attributes: ["ID", "PRODUCTNAME"]
                    },
                    {
                        model: ProjectModel,
                        as: "project",
                        attributes: ['ID', 'PROJECTNAME'], // Specify the attributes you want from the User model
                    },
                    {
                        model: UserModel,
                        as: "assigneeuser",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: TaskdescriptionModel,
                        as: "taskdescription",
                        attributes: ['ID', 'TASKTYPE', "TASKDESCRIPTION"],
                    },
                ],
                attributes: ['ID', 'TASKNAME', 'REMARKFORINNERHTML', "STATUS", "PERCENTAGE", "PRIORITY", "ASSIGNSTARTDATE", "COMPLETIONDATE"],
            })

        }
        else if (req.user.role === "support") {
            // let productidList = await ManagerUserMappingModal.findAll({

            //     attributes: ['PRODUCTID']
            // })

            let productidList = await ManagerUserMappingModal.findAll({
                where: {
                    MANAGERID: req.user.id
                },
                attributes: ['PRODUCTID']
            })

            const productids = productidList.map(product => product.PRODUCTID)

            if (productids.length <= 0) {
                return res.status(201).json({
                    success: true,
                    message: "Successfully fetched getallTask",
                    data: []
                })
            }
            tasks = await TaskModel.findAll({
                order: [['CREATEDAT', 'DESC']],
                where: {
                    ISDELETE: false,
                    PRODUCTID: {
                        [Op.in]: productids
                    },

                },
                include: [
                    {
                        model: ClientModel,
                        as: "client",
                        attributes: ["ID", "CLIENTNAME"]
                    },
                    {
                        model: ProductModel,
                        as: "product",
                        attributes: ["ID", "PRODUCTNAME"]
                    },
                    {
                        model: ProjectModel,
                        as: "project",
                        attributes: ['ID', 'PROJECTNAME'], // Specify the attributes you want from the User model
                    },
                    {
                        model: UserModel,
                        as: "assigneeuser",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: TaskdescriptionModel,
                        as: "taskdescription",
                        attributes: ['ID', 'TASKTYPE', "TASKDESCRIPTION"],
                    },
                ],
                attributes: ['ID', 'TASKNAME', 'REMARKFORINNERHTML', "STATUS", 'PERCENTAGE', "PRIORITY", "ASSIGNSTARTDATE", "COMPLETIONDATE"],
            })

        }

        const newtasks = tasks.map(task => {
            return {
                id: task.ID,
                taskname: task.TASKNAME,
                remarkforinnerhtml: task.REMARKFORINNERHTML,
                status: task.STATUS,
                priority: task.PRIORITY,
                assignstartdate: task.ASSIGNSTARTDATE,
                completiondate: task.COMPLETIONDATE,
                taskduration: moment(task.assignstartdate).fromNow(),
                percentage: task?.PERCENTAGE,
                client: {
                    id: task?.client?.ID,
                    clientname: task?.client?.CLIENTNAME,
                },
                product: {
                    id: task?.product?.ID,
                    productname: task?.product?.PRODUCTNAME,
                },
                project: {
                    id: task?.project?.ID,
                    projectname: task?.project?.PROJECTNAME,
                },
                assigneeuser: {
                    id: task?.assigneeuser?.ID,
                    fullname: task?.assigneeuser?.FULLNAME,
                },
                taskdesc: {
                    id: task?.taskdescription?.ID,
                    taskdesc: task?.taskdescription?.TASKDESCRIPTION
                }
            }
        })

        return res.status(201).json({
            success: true,
            message: "Successfully fetched getallTask",
            data: newtasks
        })
    } catch (error) {
        console.log("Error in getallTask api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallTask api",
            error: error.message,
            data: []
        })
    }
}


exports.dashboard = async (req, res) => {
    try {
        const nooftask = await TaskModel.count()

        const statusList = await TaskModel.findAll({
            where: { ISDELETE: false },
            attributes: ['STATUS', [Sequelize.fn('COUNT', 'ID'), 'count']],
            group: ['STATUS']
        })



        return res.status(201).json({
            success: true,
            message: "Successfully fetched getallTask",
            data: statusList
        })
    } catch (error) {
        console.log("Error in getallTask api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallTask api",
            error: error.message,
            data: []
        })
    }
}

exports.gettaskbyid = async (req, res) => {
    try {
        const { taskid } = req.params
        let taskResult;
        if (req.user.role === "admin" || req.user.role === "manager" || req.user.role === "support") {
            taskResult = await TaskModel.findOne({
                where: {
                    ID: taskid
                },
                attributes: ["ID", "TASKNAME", "TIMETOCOMPLETETASK", "ASSIGNEEUSERID", "PRIORITY", "ASSIGNSTARTDATE", "ACTUALSTARTDATE", "DUEDATE", "COMPLETIONDATE", "STATUS", "BILLINGTYPE", "APPROVALSTATUS", "REMARKFORINNERHTML", "FLAG", "TASKTYPE", "PERCENTAGE", "TASKDESCRIPTIONID"],

                include: [
                    {
                        model: ProductModel,
                        as: "product",
                        attributes: ["ID", "PRODUCTNAME"]
                    },
                    {
                        model: ProjectModel,
                        as: "project",
                        attributes: ["ID", "PROJECTNAME"]
                    },

                    {
                        model: ClientModel,
                        as: "client",
                        attributes: ["ID", "CLIENTNAME"]
                    },
                    {
                        model: TaskdescriptionModel,
                        as: "taskdescription",
                        attributes: ["ID", "TASKDESCRIPTION", "TASKTYPE"]
                    },
                    {
                        model: UserModel,
                        as: "projectlead",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: UserModel,
                        as: "teamleaduser",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: UserModel,
                        as: "assigneeuser",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: ModuleModel,
                        as: "module",
                        attributes: ["ID", "MODULENAME", "WEIGHTAGE"]
                    },
                    {

                        include: [{
                            model: UserModel,
                            as: "user",
                            attributes: ["ID", "FULLNAME"]
                        }],
                        model: TaskCommentModel,
                        as: "comments",
                        attributes: ["ID", "COMMENT", "TASKID", "STARTDATE", "ENDDATE", 'CREATEDAT']
                    }
                ],
                order: [[{ model: TaskCommentModel, as: 'comments' }, 'CREATEDAT', 'DESC']],
            })
        } else if (req.user.role === 'user') {
            taskResult = await TaskModel.findOne({
                where: {
                    ID: taskid,
                    ASSIGNEEUSERID: req.user.id
                },
                attributes: ["ID", "TASKNAME", "TIMETOCOMPLETETASK", "ASSIGNEEUSERID", "PRIORITY", "ASSIGNSTARTDATE", "ACTUALSTARTDATE", "DUEDATE", "COMPLETIONDATE", "STATUS", "BILLINGTYPE", "APPROVALSTATUS", "REMARKFORINNERHTML", "FLAG", "TASKTYPE", "PERCENTAGE", "TASKDESCRIPTIONID"],
                include: [
                    {
                        model: ProductModel,
                        as: "product",
                        attributes: ["ID", "PRODUCTNAME"]
                    },
                    {
                        model: ProjectModel,
                        as: "project",
                        attributes: ["ID", "PROJECTNAME"]
                    },

                    {
                        model: ClientModel,
                        as: "client",
                        attributes: ["ID", "CLIENTNAME"]
                    },
                    {
                        model: TaskdescriptionModel,
                        as: "taskdescription",
                        attributes: ["ID", "TASKDESCRIPTION", "TASKTYPE"]
                    },
                    {
                        model: UserModel,
                        as: "projectlead",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: UserModel,
                        as: "teamleaduser",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: UserModel,
                        as: "assigneeuser",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: ModuleModel,
                        as: "module",
                        attributes: ["ID", "MODULENAME", "WEIGHTAGE"]
                    },
                    {

                        include: [{
                            model: UserModel,
                            as: "user",
                            attributes: ["ID", "FULLNAME"]
                        }],
                        model: TaskCommentModel,
                        as: "comments",
                        attributes: ["ID", "USERIDCOMMENTED", "COMMENT", "TASKID", "STARTDATE", "ENDDATE", 'CREATEDAT'],
                        where: {
                            USERIDCOMMENTED: req.user.id // Replace with the actual user ID you want to filter by
                        },
                        required: false
                    }
                ],
                order: [[{ model: TaskCommentModel, as: 'comments' }, 'CREATEDAT', 'DESC']],
            })
        }


        if (!taskResult) {
            return res.status(400).json({
                success: true,
                message: "Task not found",
                data: {

                }
            })
        }


        let newObj = {
            id: taskResult?.ID,
            taskname: taskResult?.TASKNAME,
            priority: taskResult?.PRIORITY,
            actualstartdate: taskResult?.ACTUALSTARTDATE,
            assignstartdate: taskResult?.ASSIGNSTARTDATE,
            duedate: taskResult?.DUEDATE,
            completiondate: taskResult?.COMPLETIONDATE,
            status: taskResult?.STATUS,
            billingtype: taskResult?.BILLINGTYPE,
            approvalstatus: taskResult?.APPROVALSTATUS,
            clientname: taskResult?.client?.CLIENTNAME,
            clientid: taskResult?.client?.ID,
            projectname: taskResult?.project?.PROJECTNAME,
            projectid: taskResult?.project?.ID,
            remarkforinnerhtml: taskResult?.REMARKFORINNERHTML,
            remarkforeditting: "",
            flag: taskResult?.FLAG,
            assigneeuser: taskResult?.assigneeuser?.FULLNAME,
            assigneeuserid: taskResult?.assigneeuser?.ID,
            modulename: taskResult?.module?.MODULENAME,
            moduleid: taskResult?.module?.ID,
            productname: taskResult?.product?.PRODUCTNAME,
            productid: taskResult?.product?.ID,
            projectlead: taskResult?.projectlead?.FULLNAME,
            projectleaduserid: taskResult?.projectlead?.ID,
            tasktype: taskResult?.taskdescription?.TASKTYPE,
            taskdescriptionname: taskResult?.taskdescription?.TASKDESCRIPTION,
            tasktype: taskResult?.TASKTYPE,
            teamleaduser: taskResult?.teamleaduser?.FULLNAME,
            teamleaduserid: taskResult?.teamleaduser?.ID,
            percentage: taskResult?.PERCENTAGE || 0,
            comments: taskResult?.comments.map(comment => {
                return {
                    id: comment.ID,
                    comment: comment.COMMENT,
                    taskid: comment.TASKID,
                    startdate: comment.STARTDATE,
                    enddate: comment.ENDDATE,
                    createdAt: comment.CREATEDAT,
                    user: {
                        id: comment.user.ID,
                        fullname: comment.user.FULLNAME,
                    }
                }
            }),

            taskdescriptionid: taskResult?.TASKDESCRIPTIONID
            ,
        }

        return res.status(200).json({
            message: "Task fetched succesfully",
            data: newObj,
            success: true
        })

    } catch (error) {
        console.log("Error in getTaskById api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getTaskById api",
            error: error.message,
            data: {}
        })
    }
}

exports.updatetaskpercentage = async (req, res) => {
    try {
        const { taskid, percentage } = req.body;

        const result = await TaskModel.update(
            { percentage: percentage },
            {
                where: {
                    ID: taskid,
                    ASSIGNEEUSERID: req.user.id
                },
            }
        );

        return res.json({
            success: true,
            message: "Updated percentage successfully"
        })
    } catch (error) {
        console.log("Error in updateTaskPercentage api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in updateTaskPercentage api",
            error: error.message,
            data: []
        })
    }
}


exports.getprojectsbyproductid = async (req, res) => {
    try {
        const { productid } = req.params;
        const allprojects = await ProjectModel.findAll({
            order: [['PROJECTNAME', 'ASC']],
            where: {
                PRODUCTID: productid
            },
            attributes: ['ID', 'PROJECTCODE', 'PROJECTCATEGORY', 'PROJECTNAME'],

        })

        const newallprojects = allprojects.map(project => {
            return {
                id: project.ID,
                projectcode: project.PROJECTCODE,
                projectcategory: project.PROJECTCATEGORY,
                projectname: project.PROJECTNAME,
            }
        })
        return res.status(200).json({
            data: newallprojects,
            message: "Task fetched succesfully",
            success: true
        })
    } catch (error) {
        console.log("Error in getprojectsByProductId api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getprojectsByProductId api",
            error: error.message,
            data: []
        })
    }
}

exports.getallusersbyrole = async (req, res) => {
    try {
        const { role } = req.params;
        const allusers = await UserModel.findAll({
            order: [['USERNAME', 'ASC']],
            where: {
                ROLE: {
                    [Op.in]: role !== 'user' ? ['admin', 'manager', "support"] : ["user", "support"],
                },
            },
            attributes: ['ID', 'FULLNAME', 'USERNAME', 'ROLE'],
        })

        let newUsers = allusers.map(user => {
            return {
                id: user.ID,
                fullname: user.FULLNAME,
                username: user.USERNAME,
                role: user.ROLE,
            }
        })
        return res.status(200).json({
            success: true,
            message: "User fetched Successfully.",
            data: newUsers
        });
    } catch (error) {
        console.log("Error in getallusers api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallusers api",
            error: error.message,
            data: []
        });
    }
}

exports.getcommentbytaskid = async (req, res) => {
    try {
        const { taskid } = req.params
        const { role } = req.user;
        let commentList;

        if (role === 'admin' || role === "manager") {
            commentList = await TaskCommentModel.findAll({
                order: [['CREATEDAT', 'DESC']],
                where: {
                    TASKID: taskid
                },
                attributes: ["ID", "COMMENT", "TASKID"]
            })
        }
        if (role === 'user') {
            let taskResult = await TaskModel.findOne({
                where: {
                    ID: taskid,
                    ASSIGNEEUSERID: req.user.id
                },
                attributes: ["ID", "ASSIGNEEUSERID"],
            });

            if (!taskResult) {
                return res.status(400).json({
                    success: true,
                    message: "You do not have permission"
                })
            }

            commentList = await TaskCommentModel.findAll({
                order: [['CREATEDAT', 'DESC']],
                where: {
                    TASKID: taskid,
                    USERIDCOMMENTED: req.user.id
                },
                attributes: ["ID", "COMMENT", "TASKID"]
            })
        }


        return res.status(200).json({
            success: true,
            message: "User fetched Successfully.",
            data: commentList
        });
    } catch (error) {
        console.log("Error in getcommentbytaskid api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getcommentbytaskid api",
            error: error.message,
            data: []
        });
    }
}

exports.createtaskcomment = async (req, res) => {
    try {
        const { id, role } = req.user;
        const { taskid, comment, startdate, enddate } = req.body;


        let taskResult = await TaskModel.findOne({
            where: {
                ID: Number(taskid),
                ASSIGNEEUSERID: req.user.id
            },
            attributes: ["ID", "ASSIGNEEUSERID", "STATUS"],
        });

        if (!taskResult) {
            return res.status(400).json({
                success: true,
                message: "Task not found"
            });
        }

        if (taskResult.STATUS === "Close") {
            return res.status(400).json({
                success: true,
                message: "Status is closed"
            })
        }


        const commentResult = await TaskCommentModel.create({
            TASKID: Number(taskid),
            COMMENT: comment,
            USERIDCOMMENTED: id,
            STARTDATE: startdate,
            ENDDATE: enddate
        },
            {
                attributes: ["ID", "COMMENT", "TASKID", "STARTDATE", "ENDDATE", "USERIDCOMMENTED", "CREATEDAT"]
            })

        if (!commentResult) {
            return res.status(400).json({
                success: true,
                message: "Comment not added"
            })
        }

        const userdetails = await UserModel.findOne({
            where: {
                ID: commentResult.USERIDCOMMENTED
            },
            attributes: ["ID", "FULLNAME", "USERNAME"]
        })

        const newCommentObj = {
            id: commentResult.ID,
            comment: commentResult.COMMENT,
            taskid: commentResult.TASKID,
            startdate: commentResult.STARTDATE,
            enddate: commentResult.ENDDATE,
            useridcommented: commentResult.USERIDCOMMENTED,
            createdAt: commentResult.CREATEDAT,

        }
        return res.status(201).json({
            success: true,
            message: "Comment added successfully.",
            data: { ...newCommentObj, user: { username: userdetails.USERNAME, fullname: userdetails.FULLNAME } }
        });
    } catch (error) {
        console.log("Error in taskcomment api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in taskcomment api",
            error: error.message,
            data: []
        });
    }
}


exports.updatetask = async (req, res) => {
    try {
        let { id, taskname, remarkforinnerhtml, priority, actualstartdate, duedate, completiondate, status, billingtype, approvalstatus, tasktype, clientid, productid, projectid, projectleaduserid, assigneeuserid, teamleaduserid, taskdescriptionid, moduleid, assignstartdate, } = req.body

        const task = await TaskModel.findOne({
            where: {
                ID: id
            }
        })
        if (status === "Close") {
            completiondate = new Date();
        }

        if (status === "In Progress") {
            actualstartdate = new Date();
            completiondate = null;
        }

        if (status === "Open") {
            actualstartdate = null
            completiondate = null;
            // actualstartdate = new Date();
        }
        if (status === "Hold") {
            completiondate = null;
        }
        let newDataObj = {
            TASKNAME: taskname,
            REMARKFORINNERHTML: remarkforinnerhtml,
            PRIORITY: priority,
            ACTUALSTARTDATE: actualstartdate,
            DUEDATE: duedate,
            COMPLETIONDATE: completiondate,
            STATUS: status,
            BILLINGTYPE: billingtype,
            TASKTYPE: tasktype,
            CLIENTID: clientid,
            PRODUCTID: productid,
            PROJECTID: projectid,
            PROJECTLEADUSERID: projectleaduserid,
            ASSIGNEEUSERID: assigneeuserid,
            TASKDESCRIPTIONID: taskdescriptionid,
            MODULEID: moduleid,
            ASSIGNSTARTDATE: assignstartdate,
            UPDATEDBY: req.user.id,
            UPDATEDAT: new Date()
        }



        const updatedTask = await TaskModel.update(
            newDataObj,
            { where: { ID: id } }
        );

        const newUpdatedTaskHistory = { ...task.dataValues, ...newDataObj }
        delete newUpdatedTaskHistory.CREATEDBY;
        delete newUpdatedTaskHistory.ID;
        newUpdatedTaskHistory.TASKID = id;
        const updatedTaskHistory = await TaskHistoryModel.create(newUpdatedTaskHistory);

        // progress----
        if (status === "Close") {
            const updatedTaskProgressStatusResult = await TaskModel.update(
                {
                    PERCENTAGE: 100
                },
                {
                    where: { ID: id },

                },
            );
        }

        return res.status(201).json({
            success: true,
            message: "Successfully created tasks",
            data: updatedTask
        })
    } catch (error) {
        console.log("Error in createtask api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createtask api",
            error: error.message,
            data: {
                id: "",
                projectnameclientname: ""
            }
        })
    }
}

exports.updatetaskstatusandtime = async (req, res) => {
    try {
        const { status, timetocompletetask, taskid } = req.body
        let newDataObj = {
            STATUS: status,
            TIMETOCOMPLETETASK: timetocompletetask
        }

        const updatedTaskStatusAndTime = await TaskModel.update(
            newDataObj,
            { where: { ID: taskid } }
        );



        return res.status(201).json({
            success: true,
            message: "Successfully created tasks",
            data: updatedTaskStatusAndTime
        })

    } catch (error) {
        console.log("Error in createtask api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createtask api",
            error: error.message,
            data: {
                id: "",
                projectnameclientname: ""
            }
        })
    }
}
exports.updatetaskstatus = async (req, res) => {
    try {
        const userid = req.user.id
        const { status, taskid } = req.body
        const task = await TaskModel.findOne({
            where: {
                ID: taskid
            },
            attributes: ['ID', 'STATUS', 'COMPLETIONDATE', 'ASSIGNEEUSERID'],
        })

        if (!task) {
            return res.status(400).json({
                success: true,
                message: "Task not found"
            })
        }
        if (task.STATUS === "Close") {
            return res.status(400).json({
                success: true,
                message: "You cannot change status once it is close"
            })
        }

        if (task.ASSIGNEEUSERID === userid || task.PROJECTLEADUSERID === userid) {

            let isUpdatedCompletionDate = status === "Close" && task.STATUS !== 'Close'
            let isUpdatedActualStartDate = status === "In Progress" && task.STATUS !== "In Progress"

            const updatedTaskStatusResult = await TaskModel.update(
                {
                    STATUS: status,
                    ACTUALSTARTDATE: isUpdatedActualStartDate ? new Date() : task.ACTUALSTARTDATE,
                    COMPLETIONDATE: isUpdatedCompletionDate ? new Date() : task.COMPLETIONDATE
                },
                {
                    where: { ID: taskid, ASSIGNEEUSERID: userid },

                },
            );
            // progress----
            if (status === "Close") {
                const updatedTaskProgressStatusResult = await TaskModel.update(
                    {
                        PERCENTAGE: 100
                    },
                    {
                        where: { ID: taskid, ASSIGNEEUSERID: userid },

                    },
                );
            }

            const taskUpdated = await TaskModel.findOne({
                where: {
                    ID: taskid
                },
                attributes: ['ID', 'STATUS', 'COMPLETIONDATE', 'ASSIGNEEUSERID', "ACTUALSTARTDATE"],
            })

            const newTaskUpdated = {
                id: taskUpdated.ID,
                status: taskUpdated.STATUS,
                completiondate: taskUpdated.COMPLETIONDATE,
                assigneeuserid: taskUpdated.ASSIGNEEUSERID,
                actualstartdate: taskUpdated.ACTUALSTARTDATE,
            }
            return res.json({ success: true, data: newTaskUpdated, isUpdatedActualStartDate, isUpdatedCompletionDate })
        } else {
            return res.status(400).json({
                success: true,
                message: "You do not have permission"
            })
        }
    }
    catch (error) {
        console.log("Error in updatetaskstatus api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in updatetaskstatus api",
            error: error.message,
            data: {
                id: "",
                projectnameclientname: ""
            }
        })
    }
}

exports.updateactualstartdatetaskstatus = async (req, res) => {
    try {
        const userid = req.user.id
        const { status, taskid } = req.body
        const task = await TaskModel.findOne({
            where: {
                ID: taskid
            },
            attributes: ['ID', 'STATUS', 'ACTUALSTARTDATE', 'ASSIGNEEUSERID'],
        })

        if (!task) {
            return res.status(400).json({
                success: true,
                message: "Task not found"
            })
        }

        if (task.ASSIGNEEUSERID === userid || task.PROJECTLEADUSERID === userid) {

            let isUpdated = status === "In Progress" && task.STATUS !== 'In Progress'

            const updatedTaskStatusResult = await TaskModel.update(
                {
                    STATUS: status,
                    ACTUALSTARTDATE: isUpdated ? new Date() : task.ACTUALSTARTDATE
                },
                {
                    where: { ID: taskid, ASSIGNEEUSERID: userid },

                },
            );

            const taskUpdated = await TaskModel.findOne({
                where: {
                    ID: taskid
                },
                attributes: ['ID', 'STATUS', 'ACTUALSTARTDATE', 'ASSIGNEEUSERID'],
            })
            return res.json({ success: true, data: taskUpdated, isUpdated: isUpdated })
        } else {
            return res.status(400).json({
                success: true,
                message: "You do not have permission"
            })
        }
    }
    catch (error) {
        console.log("Error in updatetaskstatus api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in updatetaskstatus api",
            error: error.message,
            data: {
                id: "",
                projectnameclientname: ""
            }
        })
    }
}


exports.deletetaskbyid = async (req, res) => {
    try {
        let { taskid } = req.params

        const deltedTask = await TaskModel.update(
            {
                ISDELETE: true
            },
            {
                where: { ID: taskid },

            },
        );

        return res.status(200).json({
            success: true,
            message: "Task Deleted Successfully.",
            data: deltedTask
        })
    }
    catch (error) {
        console.log("Error in deletetaskbyid api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in deletetaskbyid api",
            error: error.message,
            data: {
                id: "",
                projectnameclientname: ""
            }
        })
    }
}



exports.getallproducts = async (req, res) => {
    try {
        const allprojects = await ProductModel.findAll({
            order: [['PRODUCTCODE', 'ASC']],
            attributes: ['ID', 'PRODUCTCODE', 'PRODUCTNAME'],
        })
        const newResult = allprojects.map(p => {
            return {
                value: p.ID,
                label: p.PRODUCTNAME
            }
        })

        newResult.unshift({ value: "all", label: "All" })
        return res.status(200).json({
            success: true,
            message: "getallproducts fetched Successfully.",
            data: newResult
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


exports.getallclients = async (req, res) => {
    try {
        const allclient = await ClientModel.findAll({
            order: [['CLIENTCODE', 'ASC']],
            attributes: ['ID', 'CLIENTCODE', 'CLIENTNAME', 'CLIENTDETAILS'],
        })

        const newResult = allclient.map(c => {
            return {
                value: c.ID,
                label: c.CLIENTNAME
            }
        })

        newResult.unshift({ value: "all", label: "All" })
        return res.status(200).json({
            success: true,
            message: "getallclients fetched Successfully.",
            data: newResult
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

exports.getallprojects = async (req, res) => {
    try {
        const allprojects = await ProjectModel.findAll({
            order: [['PROJECTCODE', 'ASC']],
            attributes: ['ID', 'PROJECTCODE', 'PROJECTCATEGORY', 'PROJECTNAME'],
        })

        const newResult = allprojects.map(p => {
            return {
                value: p.ID,
                label: p.PROJECTNAME
            }
        })
        newResult.unshift({ value: "all", label: "All" })
        return res.status(200).json({
            success: true,
            message: "getallprojects fetched Successfully.",
            data: newResult
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

exports.getallprojectleads = async (req, res) => {
    try {
        const allusers = await UserModel.findAll({
            order: [['USERNAME', 'ASC']],
            where: {
                ROLE: {
                    [Op.in]: ['admin', 'manager']
                },
            },
            attributes: ['ID', 'FULLNAME', 'USERNAME', 'ROLE'],
        })
        const newResult = allusers.map(pl => {
            return {
                value: pl.ID,
                label: pl.FULLNAME
            }
        })

        newResult.unshift({ value: "all", label: "All" })
        return res.status(200).json({
            success: true,
            message: "Project Leads fetched Successfully.",
            data: newResult
        });
    } catch (error) {
        console.log("Error in getallprojectleads api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallprojectleads api",
            error: error.message,
            data: []
        });
    }
}


exports.getallassignee = async (req, res) => {
    try {
        const allusers = await UserModel.findAll({
            order: [['USERNAME', 'ASC']],
            where: {
                ROLE: {
                    [Op.in]: ['admin', 'manager', "support", "user", "reports"]
                },
            },
            attributes: ['ID', 'FULLNAME', 'USERNAME', 'ROLE'],
        })
        const newResult = allusers.map(al => {
            return {
                value: al.ID,
                label: al.FULLNAME,
                role: al.ROLE
            }
        })

        newResult.unshift({ value: "all", label: "All", role: "NA" })

        return res.status(200).json({
            success: true,
            message: "User fetched Successfully.",
            data: newResult
        });
    } catch (error) {
        console.log("Error in getallassignee api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallassignee api",
            error: error.message,
            data: []
        });
    }
}


exports.taskreports = async (req, res) => {
    try {
        let { products, clients, projects, projectleads, assignees, billingtype, status, fromdate, todate } = req.query
        const startDate = moment(fromdate).startOf('day');
        const endDate = moment(todate).endOf('day');
        // taskfromdate = startOfDay(new Date(taskfromdate));
        // taskstodate = endOfDay(new Date(taskstodate));

        // console.log("taskfromdate",taskfromdate)
        // console.log("taskstodate",taskstodate)

        // createdAt: {
        //     [Op.between]: [taskfromdate, taskstodate],
        // },
        const tasksResult = await TaskModel.findAll({
            order: [['CREATEDAT', 'DESC']],
            where: {

                CREATEDAT: {
                    [Op.gte]: new Date(startDate),
                    [Op.lte]: new Date(endDate),
                },
                ISDELETE: false,

                ...(products?.length > 0 && !products?.includes('all') && {
                    PRODUCTID: {
                        [Op.in]: [...products.map(f => Number(f))]
                    }
                }),
                ...(clients?.length > 0 && !clients?.includes('all') && {
                    CLIENTID: {
                        [Op.in]: [...clients.map(f => Number(f))]
                    }
                }),
                ...(projects?.length > 0 && !projects?.includes('all') && {
                    PROJECTID: {
                        [Op.in]: [...projects.map(f => Number(f))],
                    }
                }),
                ...(projectleads?.length > 0 && !projectleads?.includes('all') && {
                    PROJECTLEADUSERID: {
                        [Op.in]: [...projectleads.map(f => Number(f))]
                    }
                }),
                ...(assignees?.length > 0 && !assignees?.includes('all') && {
                    ASSIGNEEUSERID: {
                        [Op.in]: [...assignees.map(f => Number(f))]
                    }
                }),
                ...(billingtype?.length > 0 && !billingtype?.includes('all') && {
                    BILLINGTYPE: {
                        [Op.in]: [...billingtype],
                    }
                }),
                ...(status?.length > 0 && !status?.includes('all') && {
                    STATUS: {
                        [Op.in]: [...status],
                    }
                }),
            },
            attributes: ["ID", "TASKNAME", "PRIORITY", "TIMETOCOMPLETETASK", "ASSIGNSTARTDATE", "ACTUALSTARTDATE", "DUEDATE", "COMPLETIONDATE", "STATUS", "BILLINGTYPE", "APPROVALSTATUS", "REMARKFORINNERHTML", "FLAG", "TASKTYPE", "PERCENTAGE"],
            include: [
                {
                    model: ProductModel,
                    as: "product",
                    attributes: ["ID", "PRODUCTNAME"]
                },
                {
                    model: ProjectModel,
                    as: "project",
                    attributes: ["ID", "PROJECTNAME"]
                },

                {
                    model: ClientModel,
                    as: "client",
                    attributes: ["ID", "CLIENTNAME"]
                },
                {
                    model: TaskdescriptionModel,
                    as: "taskdescription",
                    attributes: ["ID", "TASKDESCRIPTION", "TASKTYPE"]
                },
                {
                    model: UserModel,
                    as: "projectlead",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "teamleaduser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "assigneeuser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: ModuleModel,
                    as: "module",
                    attributes: ["ID", "MODULENAME", "WEIGHTAGE"]
                },
            ],
        })

        let newObj = tasksResult.map(t => {
            const taskduration = (t?.ACTUALSTARTDATE && t?.COMPLETIONDATE) ? calculateDateDifference(t?.ACTUALSTARTDATE, t?.COMPLETIONDATE) : null;
            // console.log(t?.ACTUALSTARTDATE, t?.COMPLETIONDATE, taskduration)
            return {
                id: t?.ID,
                taskname: t.TASKNAME,
                priority: t.PRIORITY,
                actualstartdate: t.ACTUALSTARTDATE,
                assignstartdate: t.ASSIGNSTARTDATE,
                duedate: t.DUEDATE,
                completiondate: t.COMPLETIONDATE,
                status: t.STATUS,
                billingtype: t.BILLINGTYPE,
                approvalstatus: t.APPROVALSTATUS,
                clientname: t.client?.CLIENTNAME,
                clientid: t?.client?.ID,
                projectname: t?.project?.PROJECTNAME,
                projectid: t?.project?.ID,
                remarkforinnerhtml: t.REMARKFORINNERHTML,
                remarkforeditting: "",
                flag: t.FLAG,
                assigneeuser: t.assigneeuser?.FULLNAME,
                assigneeuserid: t.assigneeuser?.ID,
                modulename: t?.module?.MODULENAME,
                moduleid: t?.module?.ID,
                productname: t?.product?.PRODUCTNAME,
                productid: t?.product?.ID,
                projectlead: t?.projectlead?.FULLNAME,
                projectleaduserid: t?.projectlead?.ID,
                tasktype: t?.taskdescription?.TASKTYPE,
                taskdescriptionname: t?.taskdescription?.TASKDESCRIPTION,
                tasktype: t.TASKTYPE,
                teamleaduser: t.teamleaduser?.FULLNAME,
                teamleaduserid: t.teamleaduser?.ID,
                percentage: t?.PERCENTAGE || 0,
                taskduration: taskduration
            }

        })

        return res.status(200).json({
            success: true,
            message: "Successfull fetched tasks",
            data: newObj
        })
    }
    catch (error) {
        console.log("Error in taskreports api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in taskreports api",
            error: error.message,
            data: []
        })
    }
}



exports.taskreportwithcomments = async (req, res) => {
    try {
        let { products, clients, projects, projectleads, assignees, billingtype, status, fromdate, todate } = req.query
        const startDate = moment(fromdate).startOf('day');
        const endDate = moment(todate).endOf('day');
        const tasksResult = await TaskModel.findAll({
            where: {
                ISDELETE: false,
                CREATEDAT: {
                    [Op.gte]: new Date(startDate),
                    [Op.lte]: new Date(endDate),
                },
                ...(products?.length > 0 && !products?.includes('all') && {
                    PRODUCTID: {
                        [Op.in]: [...products.map(f => Number(f))]
                    }
                }),
                ...(clients?.length > 0 && !clients?.includes('all') && {
                    CLIENTID: {
                        [Op.in]: [...clients.map(f => Number(f))]
                    }
                }),
                ...(projects?.length > 0 && !projects?.includes('all') && {
                    PROJECTID: {
                        [Op.in]: [...projects.map(f => Number(f))],
                    }
                }),
                ...(projectleads?.length > 0 && !projectleads?.includes('all') && {
                    PROJECTLEADUSERID: {
                        [Op.in]: [...projectleads.map(f => Number(f))]
                    }
                }),
                ...(assignees?.length > 0 && !assignees?.includes('all') && {
                    ASSIGNEEUSERID: {
                        [Op.in]: [...assignees.map(f => Number(f))]
                    }
                }),
                ...(billingtype?.length > 0 && !billingtype?.includes('all') && {
                    BILLINGTYPE: {
                        [Op.in]: [...billingtype],
                    }
                }),
                ...(status?.length > 0 && !status?.includes('all') && {
                    STATUS: {
                        [Op.in]: [...status],
                    }
                }),
            },
            attributes: ["ID", "TASKNAME", "PRIORITY", "TIMETOCOMPLETETASK", "ASSIGNSTARTDATE", "ACTUALSTARTDATE", "DUEDATE", "COMPLETIONDATE", "STATUS", "BILLINGTYPE", "APPROVALSTATUS", "REMARKFORINNERHTML", "FLAG", "TASKTYPE", "PERCENTAGE", "CREATEDAT"]
            ,
            include: [
                {
                    model: ProductModel,
                    as: "product",
                    attributes: ["ID", "PRODUCTNAME", "PRODUCTCODE"]
                },
                {
                    model: ProjectModel,
                    as: "project",
                    attributes: ["ID", "PROJECTNAME", "PROJECTCATEGORY", "PROJECTCODE"]
                },

                {
                    model: ClientModel,
                    as: "client",
                    attributes: ["ID", "CLIENTNAME", "CLIENTCODE"]
                },
                {
                    model: TaskdescriptionModel,
                    as: "taskdescription",
                    attributes: ["ID", "TASKDESCRIPTION", "TASKTYPE"]
                },
                {
                    model: UserModel,
                    as: "projectlead",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "teamleaduser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "assigneeuser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: ModuleModel,
                    as: "module",
                    attributes: ["ID", "MODULENAME", "WEIGHTAGE"]
                },
                {
                    include: [{
                        model: UserModel,
                        as: "user",
                        attributes: ["ID", "FULLNAME"]
                    }],
                    model: TaskCommentModel,
                    as: "comments",
                    attributes: ["ID", "COMMENT", "TASKID", "STARTDATE", "ENDDATE", "CREATEDAT"]
                }
            ],
            order: [[{ model: TaskCommentModel, as: 'comments' }, 'CREATEDAT', 'DESC']],
        })

        let newTimesheetData = [];


        tasksResult.forEach((t) => {
            if (t?.comments.length > 0) {
                t?.comments.forEach(c => {
                    const commentduration = calculateDateDifference(c?.STARTDATE, c?.ENDDATE)
                    newTimesheetData.push({
                        id: t.ID,
                        taskname: t.TASKNAME,
                        priority: t.PRIORITY,
                        actualstartdate: t.ACTUALSTARTDATE,
                        assignstartdate: t.ASSIGNSTARTDATE,
                        duedate: t.DUEDATE,
                        completiondate: t.COMPLETIONDATE,
                        status: t.STATUS,
                        billingtype: t.BILLINGTYPE,
                        approvalstatus: t.APPROVALSTATUS,
                        clientname: t.client?.CLIENTNAME,
                        clientid: t.client?.ID,
                        projectname: t.project?.PROJECTNAME,
                        projectid: t.project?.ID,
                        remarkforinnerhtml: t.REMARKFORINNERHTML,
                        remarkforeditting: "",
                        flag: t.FLAG,
                        assigneeuser: c.user.FULLNAME,
                        assigneeuserid: t.assigneeuser?.ID,
                        modulename: t.module?.MODULENAME,
                        moduleid: t.module?.ID,
                        productname: t.product?.PRODUCTNAME,
                        productid: t.product?.ID,
                        projectlead: t.projectlead?.FULLNAME,
                        projectleaduserid: t.projectlead?.ID,
                        tasktype: t.taskdescription?.TASKTYPE,
                        taskdescriptionname: t.taskdescription?.TASKDESCRIPTION,
                        tasktype: t.TASKTYPE,
                        teamleaduser: t.teamleaduser?.FULLNAME,
                        teamleaduserid: t.teamleaduser?.ID,
                        percentage: t?.PERCENTAGE || 0,
                        commentstartdate: c?.STARTDATE,
                        commentenddate: c?.ENDDATE,
                        comment: c?.COMMENT,
                        po_date: t?.ASSIGNSTARTDATE,
                        taskcreatedate: t?.CREATEDAT,
                        clientcode: t?.client?.CLIENTCODE,
                        productcode: t?.product?.PRODUCTCODE,
                        projectcode: t?.project?.PROJECTCODE,
                        projectcategory: t?.project?.PROJECTCATEGORY,
                        commentid: c?.ID,
                        commentduration: commentduration
                    }
                    )
                })
            }
            else {
                newTimesheetData.push({
                    id: t.ID,
                    taskname: t.TASKNAME,
                    priority: t.PRIORITY,
                    actualstartdate: t.ACTUALSTARTDATE,
                    assignstartdate: t.ASSIGNSTARTDATE,
                    duedate: t.DUEDATE,
                    completiondate: t.COMPLETIONDATE,
                    status: t.STATUS,
                    billingtype: t.BILLINGTYPE,
                    approvalstatus: t.APPROVALSTATUS,
                    clientname: t.client?.CLIENTNAME,
                    clientid: t.client?.ID,
                    projectname: t.project?.PROJECTNAME,
                    projectid: t.project?.ID,
                    remarkforinnerhtml: t.REMARKFORINNERHTML,
                    remarkforeditting: "",
                    flag: t.FLAG,
                    assigneeuser: t?.assigneeuser?.FULLNAME,
                    assigneeuserid: t.assigneeuser?.ID,
                    modulename: t.module?.MODULENAME,
                    moduleid: t.module?.ID,
                    productname: t.product?.PRODUCTNAME,
                    productid: t.product?.ID,
                    projectlead: t.projectlead?.FULLNAME,
                    projectleaduserid: t.projectlead?.ID,
                    tasktype: t.taskdescription?.TASKTYPE,
                    taskdescriptionname: t.taskdescription?.TASKDESCRIPTION,
                    tasktype: t.TASKTYPE,
                    teamleaduser: t.teamleaduser?.FULLNAME,
                    teamleaduserid: t.teamleaduser?.ID,
                    percentage: t?.PERCENTAGE || 0,
                    commentstartdate: "",
                    commentenddate: "",
                    comment: "",
                    po_date: t?.ASSIGNSTARTDATE,
                    taskcreatedate: t?.CREATEDAT,
                    clientcode: t?.client?.CLIENTCODE,
                    productcode: t?.product?.PRODUCTCODE,
                    projectcode: t?.project?.PROJECTCODE,
                    projectcategory: t?.project?.PROJECTCATEGORY,
                    commentid: "",
                    commentduration: ""
                }
                )
            }
        })

        return res.status(200).json({
            success: true,
            message: "Successfull fetched tasks",
            data: newTimesheetData
        })
    }
    catch (error) {
        console.log("Error in taskreports api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in taskreports api",
            error: error.message,
            data: []
        })
    }
}

exports.tasktimesheetwithcomments = async (req, res) => {
    try {
        let { products, clients, projects, projectleads, assignees, billingtype, status, fromdate, todate } = req.query
        const startDate = moment(fromdate).startOf('day');
        const endDate = moment(todate).endOf('day');

        const timesheetresult = await TaskModel.findAll({
            where: {
                ISDELETE: false,

                ...(products?.length > 0 && !products?.includes('all') && {
                    PRODUCTID: {
                        [Op.in]: [...products.map(f => Number(f))]
                    }
                }),
                ...(clients?.length > 0 && !clients?.includes('all') && {
                    CLIENTID: {
                        [Op.in]: [...clients.map(f => Number(f))]
                    }
                }),
                ...(projects?.length > 0 && !projects?.includes('all') && {
                    PROJECTID: {
                        [Op.in]: [...projects.map(f => Number(f))],
                    }
                }),
                ...(projectleads?.length > 0 && !projectleads?.includes('all') && {
                    PROJECTLEADUSERID: {
                        [Op.in]: [...projectleads.map(f => Number(f))]
                    }
                }),
                ...(assignees?.length > 0 && !assignees?.includes('all') && {
                    ASSIGNEEUSERID: {
                        [Op.in]: [...assignees.map(f => Number(f))]
                    }
                }),
                ...(billingtype?.length > 0 && !billingtype?.includes('all') && {
                    BILLINGTYPE: {
                        [Op.in]: [...billingtype],
                    }
                }),
                ...(status?.length > 0 && !status?.includes('all') && {
                    STATUS: {
                        [Op.in]: [...status],
                    }
                }),
            },
            attributes: ["ID", "TASKNAME", "PRIORITY", "TIMETOCOMPLETETASK", "ASSIGNSTARTDATE", "ACTUALSTARTDATE", "DUEDATE", "COMPLETIONDATE", "STATUS", "BILLINGTYPE", "APPROVALSTATUS", "REMARKFORINNERHTML", "FLAG", "TASKTYPE", "PERCENTAGE", "CREATEDAT"]
            ,
            include: [
                {
                    model: ProductModel,
                    as: "product",
                    attributes: ["ID", "PRODUCTNAME", "PRODUCTCODE"]
                },
                {
                    model: ProjectModel,
                    as: "project",
                    attributes: ["ID", "PROJECTNAME", "PROJECTCATEGORY", "PROJECTCODE"]
                },

                {
                    model: ClientModel,
                    as: "client",
                    attributes: ["ID", "CLIENTNAME", "CLIENTCODE"]
                },
                {
                    model: TaskdescriptionModel,
                    as: "taskdescription",
                    attributes: ["ID", "TASKDESCRIPTION", "TASKTYPE"]
                },
                {
                    model: UserModel,
                    as: "projectlead",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "teamleaduser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "assigneeuser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: ModuleModel,
                    as: "module",
                    attributes: ["ID", "MODULENAME", "WEIGHTAGE"]
                },
                {
                    include: [{
                        model: UserModel,
                        as: "user",
                        attributes: ["ID", "FULLNAME"]
                    }],
                    model: TaskCommentModel,
                    as: "comments",
                    attributes: ["ID", "COMMENT", "TASKID", "STARTDATE", "ENDDATE", "CREATEDAT"],
                    where: {
                        [Op.and]: [
                            { STARTDATE: { [Op.gte]: startDate } },
                            { STARTDATE: { [Op.lte]: endDate } }
                        ]
                    }
                }
            ],
            order: [[{ model: TaskCommentModel, as: 'comments' }, 'STARTDATE', 'DESC']],
        })

        let newTimesheetData = [];


        timesheetresult.forEach((t) => {

            t?.comments.forEach(c => {
                const commentduration = calculateDateDifference(c?.STARTDATE, c?.ENDDATE)
                const taskduration = (t?.ACTUALSTARTDATE && t?.COMPLETIONDATE) ? calculateDateDifference(t?.ACTUALSTARTDATE, t?.COMPLETIONDATE) : null;
                newTimesheetData.push({
                    id: t.ID,
                    taskname: t.TASKNAME,
                    priority: t.PRIORITY,
                    actualstartdate: t.ACTUALSTARTDATE,
                    assignstartdate: t.ASSIGNSTARTDATE,
                    duedate: t.DUEDATE,
                    completiondate: t.COMPLETIONDATE,
                    status: t.STATUS,
                    billingtype: t.BILLINGTYPE,
                    approvalstatus: t.APPROVALSTATUS,
                    clientname: t.client?.CLIENTNAME,
                    clientid: t.client?.ID,
                    projectname: t.project.PROJECTNAME,
                    projectid: t.project.ID,
                    remarkforinnerhtml: t.REMARKFORINNERHTML,
                    remarkforeditting: "",
                    flag: t.FLAG,
                    assigneeuser: c.user?.FULLNAME,
                    assigneeuserid: t.assigneeuser?.ID,
                    modulename: t.module?.MODULENAME,
                    moduleid: t.module?.ID,
                    productname: t.product?.PRODUCTNAME,
                    productid: t.product?.ID,
                    projectlead: t.projectlead?.FULLNAME,
                    projectleaduserid: t.projectlead?.ID,
                    tasktype: t.taskdescription?.TASKTYPE,
                    taskdescriptionname: t.taskdescription?.TASKDESCRIPTION,
                    tasktype: t.TASKTYPE,
                    teamleaduser: t.teamleaduser?.FULLNAME,
                    teamleaduserid: t.teamleaduser?.ID,
                    percentage: t?.PERCENTAGE || 0,
                    commentstartdate: c?.STARTDATE,
                    commentenddate: c?.ENDDATE,
                    comment: c?.COMMENT,
                    po_date: t?.ASSIGNSTARTDATE,
                    taskcreatedate: t?.CREATEDAT,
                    clientcode: t?.client?.CLIENTCODE,
                    productcode: t?.product?.PRODUCTCODE,
                    projectcode: t?.project?.PROJECTCODE,
                    projectcategory: t?.project?.PROJECTCATEGORY,
                    commentid: c?.ID,
                    commentduration: commentduration,
                    taskduration: taskduration
                }
                )
            })


        })


        let sortTaskByCommentStartDate = newTimesheetData.sort((a, b) => {
            // Compare based on the latest comment's STARTDATE in descending order
            return moment(b.commentstartdate).diff(moment(a.commentstartdate));
        });
        return res.status(200).json({
            success: true,
            message: "Successfull fetched tasks",
            data: sortTaskByCommentStartDate
        })
    }
    catch (error) {
        console.log("Error in taskreports api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in taskreports api",
            error: error.message,
            data: []
        })
    }
}

const { sequelize } = require("../dbconnection")
exports.taskdashboarddata = async (req, res) => {
    let { status } = req.query
    let whereCondition = 'isdelete = \'0\''
    // if (status?.length > 0) {
    //     const statusCondition = status.map(status => `STATUS = '${status}'`).join(' OR ');
    //     whereCondition += ` AND (${statusCondition})`;
    //     console.log(statusCondition)
    // }

    console.log(status)
    let statusArray = []

    if (!status) {
        const arr = ['Close', 'In Progress', 'Open', 'Hold']
        statusArray = arr
    }
    else if (status?.length > 0) {
        statusArray = status
    }

    try {
        const results = await sequelize.query(
            `
          SELECT PRODUCTNAME, FULLNAME, COUNT(FULLNAME) AS PRODUCTCOUNT
          FROM TASKS, PRODUCTS, USERS
          WHERE ISDELETE = 0 AND STATUS IN(:status)
            AND TASKS.PRODUCTID = PRODUCTS.ID
            AND TASKS.ASSIGNEEUSERID = USERS.ID
          GROUP BY TASKS.PRODUCTID, ASSIGNEEUSERID, PRODUCTNAME, FULLNAME
          ORDER BY PRODUCTNAME;
          `,
            {
                replacements: { status: [...statusArray] },
                type: QueryTypes.SELECT,
            }
        );

        const result = {};

        console.log(status)

        results.forEach(entry => {
            if (!result[entry.PRODUCTNAME]) {
                result[entry.PRODUCTNAME] = {};
            }
            result[entry.PRODUCTNAME][entry.FULLNAME] = entry.PRODUCTCOUNT;
        });

        const finalResult = Object.entries(result).map(([name, counts]) => ({
            name,
            ...counts
        }));



        return res.status(200).json({
            success: true,
            message: "Successfull fetched tasks",
            data: finalResult
        })
    } catch (error) {
        console.error('Error executing query:', error);
    }
}






exports.usertimesheetwithcomments = async (req, res) => {
    try {
        let { assignees, fromdate, todate } = req.query
        const startDate = moment(fromdate).startOf('day');
        const endDate = moment(todate).endOf('day');

        const timesheetresult = await TaskModel.findAll({
            where: {
                ISDELETE: false,
                ...(assignees?.length > 0 && {
                    '$assigneeuser.FULLNAME$': assignees
                }),
            },
            attributes: ["ID", "TASKNAME", "PRIORITY", "TIMETOCOMPLETETASK", "ASSIGNSTARTDATE", "ACTUALSTARTDATE", "DUEDATE", "COMPLETIONDATE", "STATUS", "BILLINGTYPE", "APPROVALSTATUS", "REMARKFORINNERHTML", "FLAG", "TASKTYPE", "PERCENTAGE", "CREATEDAT"]
            ,
            include: [
                {
                    model: ProductModel,
                    as: "product",
                    attributes: ["ID", "PRODUCTNAME", "PRODUCTCODE"]
                },
                {
                    model: ProjectModel,
                    as: "project",
                    attributes: ["ID", "PROJECTNAME", "PROJECTCATEGORY", "PROJECTCODE"]
                },

                {
                    model: ClientModel,
                    as: "client",
                    attributes: ["ID", "CLIENTNAME", "CLIENTCODE"]
                },
                {
                    model: TaskdescriptionModel,
                    as: "taskdescription",
                    attributes: ["ID", "TASKDESCRIPTION", "TASKTYPE"]
                },
                {
                    model: UserModel,
                    as: "projectlead",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "teamleaduser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "assigneeuser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: ModuleModel,
                    as: "module",
                    attributes: ["ID", "MODULENAME", "WEIGHTAGE"]
                },
                {
                    include: [{
                        model: UserModel,
                        as: "user",
                        attributes: ["ID", "FULLNAME"]
                    }],
                    model: TaskCommentModel,
                    as: "comments",
                    attributes: ["ID", "COMMENT", "TASKID", "STARTDATE", "ENDDATE", "CREATEDAT"],
                    where: {
                        [Op.and]: [
                            { STARTDATE: { [Op.gte]: startDate } },
                            { STARTDATE: { [Op.lte]: endDate } }
                        ]
                    },
                    order: [['ENDDATE', 'DESC']]
                }
            ],
        })

        // order: [[{ model: TaskCommentModel, as: 'comments' }, 'ENDDATE', 'DESC']],
        let newTimesheetData = [];


        timesheetresult.forEach((t) => {

            t?.comments.forEach(c => {
                const commentduration = calculateDateDifference(c?.STARTDATE, c?.ENDDATE)
                const taskduration = (t?.ACTUALSTARTDATE && t?.COMPLETIONDATE) ? calculateDateDifference(t?.ACTUALSTARTDATE, t?.COMPLETIONDATE) : null;
                newTimesheetData.push({
                    id: t.ID,
                    taskname: t.TASKNAME,
                    priority: t.PRIORITY,
                    actualstartdate: t.ACTUALSTARTDATE,
                    assignstartdate: t.ASSIGNSTARTDATE,
                    duedate: t.DUEDATE,
                    completiondate: t.COMPLETIONDATE,
                    status: t.STATUS,
                    billingtype: t.BILLINGTYPE,
                    approvalstatus: t.APPROVALSTATUS,
                    clientname: t.client?.CLIENTNAME,
                    clientid: t.client?.ID,
                    projectname: t.project.PROJECTNAME,
                    projectid: t.project.ID,
                    remarkforinnerhtml: t.REMARKFORINNERHTML,
                    remarkforeditting: "",
                    flag: t.FLAG,
                    assigneeuser: c.user?.FULLNAME,
                    assigneeuserid: t.assigneeuser?.ID,
                    modulename: t.module?.MODULENAME,
                    moduleid: t.module?.ID,
                    productname: t.product?.PRODUCTNAME,
                    productid: t.product?.ID,
                    projectlead: t.projectlead?.FULLNAME,
                    projectleaduserid: t.projectlead?.ID,
                    tasktype: t.taskdescription?.TASKTYPE,
                    taskdescriptionname: t.taskdescription?.TASKDESCRIPTION,
                    tasktype: t.TASKTYPE,
                    teamleaduser: t.teamleaduser?.FULLNAME,
                    teamleaduserid: t.teamleaduser?.ID,
                    percentage: t?.PERCENTAGE || 0,
                    commentstartdate: c?.STARTDATE,
                    commentenddate: c?.ENDDATE,
                    comment: c?.COMMENT,
                    po_date: t?.ASSIGNSTARTDATE,
                    taskcreatedate: t?.CREATEDAT,
                    clientcode: t?.client?.CLIENTCODE,
                    productcode: t?.product?.PRODUCTCODE,
                    projectcode: t?.project?.PROJECTCODE,
                    projectcategory: t?.project?.PROJECTCATEGORY,
                    commentid: c?.ID,
                    commentduration: commentduration,
                    taskduration: taskduration
                }
                )
            })


        })

        let sortTaskByCommentStartDate = newTimesheetData.sort((a, b) => {
            // Compare based on the latest comment's STARTDATE in descending order
            return moment(b.commentstartdate).diff(moment(a.commentstartdate));
        });

        return res.status(200).json({
            success: true,
            message: "Successfull fetched tasks",
            data: sortTaskByCommentStartDate
        })
    }
    catch (error) {
        console.log("Error in user taskreports api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in user taskreports api",
            error: error.message,
            data: []
        })
    }
}


exports.getcommentbycommentid = async (req, res) => {
    try {
        const { commentid } = req.params
        const getComment = await TaskCommentModel.findOne({
            where: { ID: commentid },
            attributes: ["ID", "COMMENT", "TASKID", "STARTDATE", "ENDDATE", 'CREATEDAT']
        })
        const commentData = {
            comment: getComment?.COMMENT,
            startDate: getComment?.STARTDATE,
            endDate: getComment?.ENDDATE
        }

        return res.status(200).json({
            success: true,
            message: "comment fetched Successfully.",
            data: commentData
        })

    } catch (error) {
        console.log("Error in fetch comment")
        return res.status(400).json({
            success: false,
            message: "Some error occured in fetch comment api",
            error: error.message,
            data: []
        })

    }

}

exports.updatecommentbyid = async (req, res) => {

    try {
        const { commentid } = req.params
        let { comment, startdate, enddate } = req.body

        const updateComment = await TaskCommentModel.update(
            {
                COMMENT: comment,
                STARTDATE: startdate,
                ENDDATE: enddate
            },
            { where: { ID: commentid } }
        )

        if (updateComment[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Comment not found or no changes made",
                data: null
            });
        }
        return res.status(201).json({
            success: true,
            message: "Comment updated successfully",
            data: {
                id: commentid,
                startdate: startdate,
                enddate: enddate
            }

        })


    } catch (error) {
        console.error("Error updating comment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })

    }
}


exports.updateprogresspercentage = async (req, res) => {



    try {
        const userid = req.user.id
        const { taskid, percentage } = req.body

        const task = await TaskModel.findOne({
            where: {
                ID: taskid
            },
            attributes: ['ID', 'STATUS', 'COMPLETIONDATE', 'ASSIGNEEUSERID', 'PERCENTAGE'],
        })

        if (!task) {
            return res.status(400).json({
                success: true,
                message: "Task not found"
            })
        }
        // if (task.STATUS === "Close") {
        //     return res.status(400).json({
        //         success: true,
        //         message: "You cannot change Progress status once it is close"
        //     })
        // }


        if (task.ASSIGNEEUSERID === userid || task.PROJECTLEADUSERID === userid) {

            // let isUpdatedCompletionDate = status === "Close" && task.STATUS !== 'Close'
            // let isUpdatedActualStartDate = status === "In Progress" && task.STATUS !== "In Progress"

            const updatedTaskProgressStatusResult = await TaskModel.update(
                {
                    PERCENTAGE: percentage
                },
                {
                    where: { ID: taskid, ASSIGNEEUSERID: userid },

                },
            );

            const taskUpdated = await TaskModel.findOne({
                where: {
                    ID: taskid
                },
                attributes: ['ID', 'STATUS', 'COMPLETIONDATE', 'ASSIGNEEUSERID', "ACTUALSTARTDATE", 'PERCENTAGE'],
            })

            const newTaskUpdated = {
                id: taskUpdated.ID,
                status: taskUpdated.STATUS,
                completiondate: taskUpdated.COMPLETIONDATE,
                assigneeuserid: taskUpdated.ASSIGNEEUSERID,
                actualstartdate: taskUpdated.ACTUALSTARTDATE,
                percentage: taskUpdated.PERCENTAGE
            }
            return res.json({ success: true, data: newTaskUpdated })

        }
        else {
            return res.status(400).json({
                success: true,
                message: "You do not have permission"
            })
        }

    } catch (error) {
        console.log("Error in updatetaskstatus api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in updatetaskstatus api",
            error: error.message,
            data: {
                id: "",
                projectnameclientname: ""
            }
        })
    }
}


exports.taskbyproduct111 = async (req, res) => {
    try {
        let { products } = req.query

        // taskfromdate = startOfDay(new Date(taskfromdate));
        // taskstodate = endOfDay(new Date(taskstodate));

        // console.log("taskfromdate",taskfromdate)
        // console.log("taskstodate",taskstodate)

        // createdAt: {
        //     [Op.between]: [taskfromdate, taskstodate],
        // },
        const tasksResult = await TaskModel.findAll({
            order: [['CREATEDAT', 'DESC']],
            where: {


                ISDELETE: false,

                ...(products?.length > 0 && !products?.includes('all') && {
                    PRODUCTID: {
                        [Op.in]: [...products.map(f => Number(f))]
                    }
                }),

            },
            //attributes: ["ID", "TASKNAME", "PRIORITY", "TIMETOCOMPLETETASK", "ASSIGNSTARTDATE", "ACTUALSTARTDATE", "DUEDATE", "COMPLETIONDATE", "STATUS", "BILLINGTYPE", "APPROVALSTATUS", "REMARKFORINNERHTML", "FLAG", "TASKTYPE", "PERCENTAGE"],

            attributes: ['ID', 'TASKNAME', 'REMARKFORINNERHTML', "STATUS", "PRIORITY", "ASSIGNSTARTDATE", "COMPLETIONDATE", 'PERCENTAGE'],



            include: [
                {
                    model: ProductModel,
                    as: "product",
                    attributes: ["ID", "PRODUCTNAME"]
                },
                {
                    model: ProjectModel,
                    as: "project",
                    attributes: ["ID", "PROJECTNAME"]
                },

                {
                    model: ClientModel,
                    as: "client",
                    attributes: ["ID", "CLIENTNAME"]
                },
                {
                    model: TaskdescriptionModel,
                    as: "taskdescription",
                    attributes: ["ID", "TASKDESCRIPTION", "TASKTYPE"]
                },
                {
                    model: UserModel,
                    as: "projectlead",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "teamleaduser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "assigneeuser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: ModuleModel,
                    as: "module",
                    attributes: ["ID", "MODULENAME", "WEIGHTAGE"]
                },
            ],
        })

        let newObj = tasksResult.map(t => {
            const taskduration = (t?.ACTUALSTARTDATE && t?.COMPLETIONDATE) ? calculateDateDifference(t?.ACTUALSTARTDATE, t?.COMPLETIONDATE) : null;
            // console.log(t?.ACTUALSTARTDATE, t?.COMPLETIONDATE, taskduration)
            return {
                id: t?.ID,
                taskname: t.TASKNAME,
                priority: t.PRIORITY,
                actualstartdate: t.ACTUALSTARTDATE,
                assignstartdate: t.ASSIGNSTARTDATE,
                duedate: t.DUEDATE,
                completiondate: t.COMPLETIONDATE,
                status: t.STATUS,
                billingtype: t.BILLINGTYPE,
                approvalstatus: t.APPROVALSTATUS,
                clientname: t.client?.CLIENTNAME,
                clientid: t?.client?.ID,
                projectname: t?.project?.PROJECTNAME,
                projectid: t?.project?.ID,
                remarkforinnerhtml: t.REMARKFORINNERHTML,
                remarkforeditting: "",
                flag: t.FLAG,
                assigneeuser: t.assigneeuser?.FULLNAME,
                assigneeuserid: t.assigneeuser?.ID,
                modulename: t?.module?.MODULENAME,
                moduleid: t?.module?.ID,
                productname: t?.product?.PRODUCTNAME,
                productid: t?.product?.ID,
                projectlead: t?.projectlead?.FULLNAME,
                projectleaduserid: t?.projectlead?.ID,
                tasktype: t?.taskdescription?.TASKTYPE,
                taskdescriptionname: t?.taskdescription?.TASKDESCRIPTION,
                tasktype: t.TASKTYPE,
                teamleaduser: t.teamleaduser?.FULLNAME,
                teamleaduserid: t.teamleaduser?.ID,
                percentage: t?.PERCENTAGE || 0,
                taskduration: taskduration
            }

        })

        return res.status(200).json({
            success: true,
            message: "Successfull fetched tasks",
            data: newObj
        })
    }
    catch (error) {
        console.log("Error in taskreports api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in taskreports api",
            error: error.message,
            data: []
        })
    }
}




exports.getalltaskbyproduct = async (req, res) => {
    try {

        let { products } = req.query

        let tasks = []

        if (req.user.role === "admin" || req.user.role === "manager") {
            let productidList = await ManagerUserMappingModal.findAll({
                where: {
                    MANAGERID: req.user.id,

                    ...(products?.length > 0 && !products?.includes('all') && {
                        PRODUCTID: {
                            [Op.in]: [...products.map(f => Number(f))]
                        }
                    }),
                },
                attributes: ['PRODUCTID']
            })

            const productids = productidList.map(product => product.PRODUCTID)

            tasks = await TaskModel.findAll({
                order: [['CREATEDAT', 'DESC']],
                where: {
                    ISDELETE: false,
                    PRODUCTID: {
                        [Op.in]: productids
                    },
                },
                include: [
                    {
                        model: ClientModel,
                        as: "client",
                        attributes: ["ID", "CLIENTNAME"]
                    },
                    {
                        model: ProductModel,
                        as: "product",
                        attributes: ["ID", "PRODUCTNAME"]
                    },
                    {
                        model: ProjectModel,
                        as: "project",
                        attributes: ['ID', 'PROJECTNAME'], // Specify the attributes you want from the User model
                    },
                    {
                        model: UserModel,
                        as: "assigneeuser",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: TaskdescriptionModel,
                        as: "taskdescription",
                        attributes: ['ID', 'TASKTYPE', "TASKDESCRIPTION"],
                    },
                ],
                attributes: ['ID', 'TASKNAME', 'REMARKFORINNERHTML', "STATUS", "PRIORITY", "ASSIGNSTARTDATE", "COMPLETIONDATE", 'PERCENTAGE'],
            })

        } else if (req.user.role === "user") {
            tasks = await TaskModel.findAll({
                order: [['CREATEDAT', 'DESC']],
                where: {
                    ASSIGNEEUSERID: req.user.id,
                    ISDELETE: false,
                    ...(products?.length > 0 && !products?.includes('all') && {
                        PRODUCTID: {
                            [Op.in]: [...products.map(f => Number(f))]
                        }
                    }),
                },
                include: [
                    {
                        model: ClientModel,
                        as: "client",
                        attributes: ["ID", "CLIENTNAME"]
                    },
                    {
                        model: ProductModel,
                        as: "product",
                        attributes: ["ID", "PRODUCTNAME"]
                    },
                    {
                        model: ProjectModel,
                        as: "project",
                        attributes: ['ID', 'PROJECTNAME'], // Specify the attributes you want from the User model
                    },
                    {
                        model: UserModel,
                        as: "assigneeuser",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: TaskdescriptionModel,
                        as: "taskdescription",
                        attributes: ['ID', 'TASKTYPE', "TASKDESCRIPTION"],
                    },
                ],
                attributes: ['ID', 'TASKNAME', 'REMARKFORINNERHTML', "STATUS", "PERCENTAGE", "PRIORITY", "ASSIGNSTARTDATE", "COMPLETIONDATE"],
            })

        }
        else if (req.user.role === "support") {
            // let productidList = await ManagerUserMappingModal.findAll({

            //     attributes: ['PRODUCTID']
            // })

            let productidList = await ManagerUserMappingModal.findAll({
                where: {
                    MANAGERID: req.user.id
                },
                attributes: ['PRODUCTID'],

                ...(products?.length > 0 && !products?.includes('all') && {
                    PRODUCTID: {
                        [Op.in]: [...products.map(f => Number(f))]
                    }
                }),

            })

            const productids = productidList.map(product => product.PRODUCTID)

            if (productids.length <= 0) {
                return res.status(201).json({
                    success: true,
                    message: "Successfully fetched getallTask",
                    data: []
                })
            }
            tasks = await TaskModel.findAll({
                order: [['CREATEDAT', 'DESC']],
                where: {
                    ISDELETE: false,
                    PRODUCTID: {
                        [Op.in]: productids
                    },

                },
                include: [
                    {
                        model: ClientModel,
                        as: "client",
                        attributes: ["ID", "CLIENTNAME"]
                    },
                    {
                        model: ProductModel,
                        as: "product",
                        attributes: ["ID", "PRODUCTNAME"]
                    },
                    {
                        model: ProjectModel,
                        as: "project",
                        attributes: ['ID', 'PROJECTNAME'], // Specify the attributes you want from the User model
                    },
                    {
                        model: UserModel,
                        as: "assigneeuser",
                        attributes: ['ID', 'FULLNAME', "USERNAME"],
                    },
                    {
                        model: TaskdescriptionModel,
                        as: "taskdescription",
                        attributes: ['ID', 'TASKTYPE', "TASKDESCRIPTION"],
                    },
                ],
                attributes: ['ID', 'TASKNAME', 'REMARKFORINNERHTML', "STATUS", 'PERCENTAGE', "PRIORITY", "ASSIGNSTARTDATE", "COMPLETIONDATE"],
            })

        }

        const newtasks = tasks.map(task => {
            return {
                id: task.ID,
                taskname: task.TASKNAME,
                remarkforinnerhtml: task.REMARKFORINNERHTML,
                status: task.STATUS,
                priority: task.PRIORITY,
                assignstartdate: task.ASSIGNSTARTDATE,
                completiondate: task.COMPLETIONDATE,
                taskduration: moment(task.assignstartdate).fromNow(),
                percentage: task?.PERCENTAGE,
                client: {
                    id: task?.client?.ID,
                    clientname: task?.client?.CLIENTNAME,
                },
                product: {
                    id: task?.product?.ID,
                    productname: task?.product?.PRODUCTNAME,
                },
                project: {
                    id: task?.project?.ID,
                    projectname: task?.project?.PROJECTNAME,
                },
                assigneeuser: {
                    id: task?.assigneeuser?.ID,
                    fullname: task?.assigneeuser?.FULLNAME,
                },
                taskdesc: {
                    id: task?.taskdescription?.ID,
                    taskdesc: task?.taskdescription?.TASKDESCRIPTION
                }
            }
        })

        return res.status(201).json({
            success: true,
            message: "Successfully fetched getallTaskproduct",
            data: newtasks
        })
    } catch (error) {
        console.log("Error in getallTaskbyproduct api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in getallTaskproduct api",
            error: error.message,
            data: []
        })
    }
}



exports.taskbyassignee = async (req, res) => {
    try {
        let { assigneeuserid } = req.body

        console.log("Assigne idddd", assigneeuserid)
        const tasksResult = await TaskModel.findAll({
            order: [['CREATEDAT', 'DESC']],
            where: {


                ISDELETE: false,
                ASSIGNEEUSERID: assigneeuserid,

            },
            //attributes: ["ID", "TASKNAME", "PRIORITY", "TIMETOCOMPLETETASK", "ASSIGNSTARTDATE", "ACTUALSTARTDATE", "DUEDATE", "COMPLETIONDATE", "STATUS", "BILLINGTYPE", "APPROVALSTATUS", "REMARKFORINNERHTML", "FLAG", "TASKTYPE", "PERCENTAGE"],

            attributes: ['ID', 'TASKNAME', 'REMARKFORINNERHTML', "STATUS", "PRIORITY", "ASSIGNSTARTDATE", "COMPLETIONDATE", 'PERCENTAGE'],



            include: [
                {
                    model: ProductModel,
                    as: "product",
                    attributes: ["ID", "PRODUCTNAME"]
                },
                {
                    model: ProjectModel,
                    as: "project",
                    attributes: ["ID", "PROJECTNAME"]
                },

                {
                    model: ClientModel,
                    as: "client",
                    attributes: ["ID", "CLIENTNAME"]
                },
                {
                    model: TaskdescriptionModel,
                    as: "taskdescription",
                    attributes: ["ID", "TASKDESCRIPTION", "TASKTYPE"]
                },
                {
                    model: UserModel,
                    as: "projectlead",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "teamleaduser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: UserModel,
                    as: "assigneeuser",
                    attributes: ['ID', 'FULLNAME', "USERNAME"],
                },
                {
                    model: ModuleModel,
                    as: "module",
                    attributes: ["ID", "MODULENAME", "WEIGHTAGE"]
                },
            ],
        })

    
        const totalTask = tasksResult.length
        let openCount = 0;
        let inprocessCount = 0;
        let closeCount = 0;
        let holdCounter = 0;
        tasksResult.forEach(t => {
            if (t.STATUS === "Open") { openCount++ }
            else if (t.STATUS === "In Progress") { inprocessCount++ }
            else if (t.STATUS === "Close") { closeCount++ }
            else if (t.STATUS === "Hold") { holdCounter++ }
        });
        let newObj = tasksResult.map(t => {
            const taskduration = (t?.ACTUALSTARTDATE && t?.COMPLETIONDATE) ? calculateDateDifference(t?.ACTUALSTARTDATE, t?.COMPLETIONDATE) : null;
            // console.log(t?.ACTUALSTARTDATE, t?.COMPLETIONDATE, taskduration)

            // if (t.STATUS === "Open") { openCount++ }
            // else if (t.STATUS === "In Progress") { inprocessCount++ }
            // else if (t.STATUS === "Closed") { closeCount++ }
            return {

                id: t?.ID,
                taskname: t.TASKNAME,
                priority: t.PRIORITY,
                actualstartdate: t.ACTUALSTARTDATE,
                assignstartdate: t.ASSIGNSTARTDATE,
                duedate: t.DUEDATE,
                completiondate: t.COMPLETIONDATE,
                status: t.STATUS,
                billingtype: t.BILLINGTYPE,
                approvalstatus: t.APPROVALSTATUS,
                clientname: t.client?.CLIENTNAME,
                clientid: t?.client?.ID,
                projectname: t?.project?.PROJECTNAME,
                projectid: t?.project?.ID,
                remarkforinnerhtml: t.REMARKFORINNERHTML,
                remarkforeditting: "",
                flag: t.FLAG,
                assigneeuser: t.assigneeuser?.FULLNAME,
                assigneeuserid: t.assigneeuser?.ID,
                modulename: t?.module?.MODULENAME,
                moduleid: t?.module?.ID,
                productname: t?.product?.PRODUCTNAME,
                productid: t?.product?.ID,
                projectlead: t?.projectlead?.FULLNAME,
                projectleaduserid: t?.projectlead?.ID,
                tasktype: t?.taskdescription?.TASKTYPE,
                taskdescriptionname: t?.taskdescription?.TASKDESCRIPTION,
                tasktype: t.TASKTYPE,
                teamleaduser: t.teamleaduser?.FULLNAME,
                teamleaduserid: t.teamleaduser?.ID,
                percentage: t?.PERCENTAGE || 0,
                taskduration: taskduration,
                
            }

        })

        return res.status(200).json({
            success: true,
            message: "Successfull fetched tasks",
           // data: newObj,
            count :{
                totaltask: totalTask,
                opentask: openCount,
                inprosesstask: inprocessCount,
                closetask: closeCount,
                holdTask:holdCounter
            }
        })
    }
    catch (error) {
        console.log("Error in taskreports api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in taskreports api",
            error: error.message,
            data: []
        })
    }
}

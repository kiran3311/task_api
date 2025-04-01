const moment = require("moment/moment")

exports.updateTaskStatus = async ({ userid, status, taskid }) => {
    try {
        // const userid = req.user.id
        // const { status, taskid } = req.body
        const task = await TaskModel.findOne({
            where: {
                id: taskid
            },
            attributes: ['id', 'status', 'completiondate', 'assigneeuserid'],
        })

        if (!task) {
            return {
                error: true,
                message: "Task not found"
            }
        }

        if (task.assigneeuserid == userid || task.projectleaduserid === userid) {

            let isUpdatedCompletionDate = status === "Close" && task.status !== 'Close'
            let isUpdatedActualStartDate = status === "In Progress" && task.status !== "In Progress"

            const updatedTaskStatusResult = await TaskModel.update(
                {
                    status: status,
                    actualstartdate: isUpdatedActualStartDate ? new Date() : task.actualstartdate,
                    completiondate: isUpdatedCompletionDate ? new Date() : task.completiondate
                },
                {
                    where: { id: taskid, assigneeuserid: userid },

                },
            );

            const taskUpdated = await TaskModel.findOne({
                where: {
                    id: taskid
                },
                attributes: ['id', 'status', 'completiondate', 'assigneeuserid', "actualstartdate"],
            })
            return { error: false, success: true, data: taskUpdated, isUpdatedActualStartDate, isUpdatedCompletionDate }
        } else {
            return {
                error: true,
                message: "You do not have permission"
            }
        }
    } catch (error) {
        console.log("Error in updateTaskStatus HELPER METHOD")
        return res.json({
            success: false,
            message: "Error in updateTaskStatus HELPER Method"
        })
    }
}
exports.calculateDateDifference = (_startdate, _enddate) => {
    const startdate = moment(_startdate, "DD/MM/YYYY HH:mm:ss");
    const enddate = moment(_enddate, "DD/MM/YYYY HH:mm:ss");

    // Calculate the difference in milliseconds
    const differenceInMillis = enddate.diff(startdate);

    // Convert milliseconds to a Moment.js duration
    const duration = moment.duration(differenceInMillis);

    // Extract days, hours, minutes, and seconds from the duration
    const days = Math.floor(duration.asDays()).toString().padStart(3, '0');
    const hours = duration.hours().toString().padStart(2, '0');
    const minutes = duration.minutes().toString().padStart(2, '0');
    const seconds = duration.seconds().toString().padStart(2, '0');

    // Format the duration
    const formattedDifference = `${days}:${hours}:${minutes}:${seconds}`;
    return formattedDifference;
}
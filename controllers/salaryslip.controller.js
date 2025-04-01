
const ClientModel = require("../models/ClientModel")
const ClientProductMappingModel = require("../models/ClientProductMappingModel")
const SalarySlipModel = require("../models/SalarySlipModel")
const { Sequelize, sequelize, Op } = require('sequelize');

// exports.uploadsalary = async (req, res) => {
//     try {
//         const reqbody = req.body;
//         console.log("Uploading Data---", reqbody)
//         const salarySlips = await SalarySlipModel.bulkCreate(reqbody)
//         return res.status(201).json({
//             success: true,
//             message: "Successfully  uploaded salary",
//             data: salarySlips
//         })
//     } catch (error) {
//         console.log("Error in   uploadsalary api", error)
//         return res.status(400).json({
//             success: false,
//             message: "Some error occured in uploadsalary api",
//             error: error.message,
//             data: {}
//         })
//     }
// }


exports.uploadsalary = async (req, res) => {
    try {
        const reqbody = req.body;
        console.log("Uploading Data---", reqbody);

        for (const record of reqbody) {
            await SalarySlipModel.upsert(record);  // Insert if not exists, update if exists
        }

        return res.status(201).json({
            success: true,
            message: "Successfully uploaded salary",
            data: reqbody
        });
    } catch (error) {
        console.log("Error in uploadsalary API", error);
        return res.status(400).json({
            success: false,
            message: "Some error occurred in uploadsalary API",
            error: error.message
        });
    }
};


exports.getemployeeonstatementdate = async (req, res) => {
    try {
        const { statementDate } = req.params;
        const date = new Date(statementDate);

        const year = date.getFullYear(); // Get the current year
        const month = date.getMonth() + 1; // Get the current month (0-11, so add 1)

        const employees = await SalarySlipModel.findAll({
            attributes: ['ID', "EMPCODE", "EMPLOYEENAME"], // Specify which columns you want to retrieve
            where: {
                STATEMENTDATE: {
                    [Op.gte]: new Date(year, month - 1, 1), // Start of the month
                    [Op.lt]: new Date(year, month, 1) // Start of the next month
                }
            }
        });


        const newUpdatedEmployee = employees.map(emp => {
            return {
                value: emp.EMPCODE,
                label: emp.EMPLOYEENAME
            }
        })

        
        const newEmpArray = [{ value: "all", label: "All" }, ...newUpdatedEmployee]

        console.log("changed array=====", newEmpArray)

        return res.status(200).json({
            success: true,
            message: "Successfully  generated salary slips",
            data: newEmpArray
        })
    } catch (error) {
        console.log("Error in   generatesalaryslips api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in generatesalaryslips api",
            error: error.message,
            data: []
        })
    }
}



exports.getsalaryslip = async (req, res) => {
    try {
        let { employeesFilter, statementDate } = req.query;
        const date = new Date(statementDate);


        const year = date.getFullYear();
        const month = date.getMonth();

        const startOfTheMonth = new Date(year, month, 1);
        startOfTheMonth.setHours(0, 0, 0, 0);

        const startOfTheNextMonth = new Date(year, month + 1, 1);
        startOfTheNextMonth.setHours(0, 0, 0, 0);

        const salarySlips = await SalarySlipModel.findAll({
            order: [['EMPLOYEENAME', 'ASC']],
            where: {
                STATEMENTDATE: {
                    [Op.gte]: startOfTheMonth,
                    [Op.lte]: startOfTheNextMonth
                },
                ...(employeesFilter?.length > 0 && !employeesFilter?.includes('all') && {
                    EMPCODE: {
                        [Op.in]: [...employeesFilter],
                    }
                }),
            }
        });

      
        // Map through the data and ensure every field is converted to a string with null check
        const salarySlipsWithStringValues = salarySlips.map((slip) => {
            return {
                ID: slip.ID !== null ? slip.ID.toString() : '',
                STATEMENTDATE: slip.STATEMENTDATE !== null ? slip.STATEMENTDATE.toString() : '',
                EMPCODE: slip.EMPCODE !== null ? slip.EMPCODE.toString() : '',
                EPFUANNO: slip.EPFUANNO !== null ? slip.EPFUANNO.toString() : '',
                ESICNO: slip.ESICNO !== null ? slip.ESICNO.toString() : '',
                GENDER: slip.GENDER !== null ? slip.GENDER.toString() : '',
                DOB: slip.DOB !== null ? slip.DOB.toString() : '',
                PAN: slip.PAN !== null ? slip.PAN.toString() : '',
                AADHAAR: slip.AADHAAR !== null ? slip.AADHAAR.toString() : '',
                MEDICLAIMNO: slip.MEDICLAIMNO !== null ? slip.MEDICLAIMNO.toString() : '',
                EMPLOYEENAME: slip.EMPLOYEENAME !== null ? slip.EMPLOYEENAME.toString() : '',
                DOJ: slip.DOJ !== null ? slip.DOJ.toString() : '',
                STATUS: slip.STATUS !== null ? slip.STATUS.toString() : '',
                DOE: slip.DOE !== null ? slip.DOE.toString() : '',
                TEAM: slip.TEAM !== null ? slip.TEAM.toString() : '',
                DESIGNATION: slip.DESIGNATION !== null ? slip.DESIGNATION.toString() : '',
                LEAVEOPBALANCE: slip.LEAVEOPBALANCE !== null ? slip.LEAVEOPBALANCE.toString() : '',
                LEAVEADDITION: slip.LEAVEADDITION !== null ? slip.LEAVEADDITION.toString() : '',
                PRESENTDAYS: slip.PRESENTDAYS !== null ? slip.PRESENTDAYS.toString() : '',
                WOFF: slip.WOFF !== null ? slip.WOFF.toString() : '',
                LALEAVENTAKEN: slip.LALEAVENTAKEN !== null ? slip.LALEAVENTAKEN.toString() : '',
                ABSENTDAYS: slip.ABSENTDAYS !== null ? slip.ABSENTDAYS.toString() : '', // Handles null values
                HALFDAY: slip.HALFDAY !== null ? slip.HALFDAY.toString() : '',
                COMPOFF: slip.COMPOFF !== null ? slip.COMPOFF.toString() : '',
                WFH: slip.WFH !== null ? slip.WFH.toString() : '', // Handles null values
                PAIDDAYS: slip.PAIDDAYS !== null ? slip.PAIDDAYS.toString() : '',
                LEAVECF: slip.LEAVECF !== null ? slip.LEAVECF.toString() : '',
                BASICSTRUCTURE: slip.BASICSTRUCTURE !== null ? slip.BASICSTRUCTURE.toString() : '',
                HRASTRUCTURE: slip.HRASTRUCTURE !== null ? slip.HRASTRUCTURE.toString() : '',
                CONVSTRUCTURE: slip.CONVSTRUCTURE !== null ? slip.CONVSTRUCTURE.toString() : '',
                MEDSTRUCTURE: slip.MEDSTRUCTURE !== null ? slip.MEDSTRUCTURE.toString() : '',
                EDUSTRUCTURE: slip.EDUSTRUCTURE !== null ? slip.EDUSTRUCTURE.toString() : '',
                CCASTRUCTURE: slip.CCASTRUCTURE !== null ? slip.CCASTRUCTURE.toString() : '',
                GROSSPMSTRUCTURE: slip.GROSSPMSTRUCTURE !== null ? slip.GROSSPMSTRUCTURE.toString() : '',
                BASIC: slip.BASIC !== null ? slip.BASIC.toString() : '',
                HRA: slip.HRA !== null ? slip.HRA.toString() : '',
                CONV: slip.CONV !== null ? slip.CONV.toString() : '',
                MED: slip.MED !== null ? slip.MED.toString() : '',
                EDU: slip.EDU !== null ? slip.EDU.toString() : '',
                CCA: slip.CCA !== null ? slip.CCA.toString() : '',
                INCENTIVES: slip.INCENTIVES !== null ? slip.INCENTIVES.toString() : '',
                OTHERARREARS: slip.OTHERARREARS !== null ? slip.OTHERARREARS.toString() : '',
                TOTALCALCULATEDGROSSASPERPRESENDAYS: slip.TOTALCALCULATEDGROSSASPERPRESENDAYS !== null ? slip.TOTALCALCULATEDGROSSASPERPRESENDAYS.toString() : '',
                PT: slip.PT !== null ? slip.PT.toString() : '',
                PF: slip.PF !== null ? slip.PF.toString() : '',
                ESIC: slip.ESIC !== null ? slip.ESIC.toString() : '',
                TDS: slip.TDS !== null ? slip.TDS.toString() : '',
                LWF: slip.LWF !== null ? slip.LWF.toString() : '',
                OTHERDEDUCTION: slip.OTHERDEDUCTION !== null ? slip.OTHERDEDUCTION.toString() : '',
                TOTALDEDUCTION: slip.TOTALDEDUCTION !== null ? slip.TOTALDEDUCTION.toString() : '',
                NETSALARY: slip.NETSALARY !== null ? slip.NETSALARY.toString() : '',
                WFHDEDUCTION: slip.WFHDEDUCTION !== null ? slip.WFHDEDUCTION.toString() : '',
                NETSALARYINHAND: slip.NETSALARYINHAND !== null ? slip.NETSALARYINHAND.toString() : '',
                PAYMENTMODE: slip.PAYMENTMODE !== null ? slip.PAYMENTMODE.toString() : '',
                MONTH: slip.MONTH !== null ? slip.MONTH.toString() : '',
                GRATUITYPM: slip.GRATUITYPM !== null ? slip.GRATUITYPM.toString() : '',
                MEDICLAIMPM: slip.MEDICLAIMPM !== null ? slip.MEDICLAIMPM.toString() : '',
                EMPLOYERPFPM: slip.EMPLOYERPFPM !== null ? slip.EMPLOYERPFPM.toString() : '',
                EMPLOYERESIC: slip.EMPLOYERESIC !== null ? slip.EMPLOYERESIC.toString() : '',
                CTCPM: slip.CTCPM !== null ? slip.CTCPM.toString() : '',
                CTCPA: slip.CTCPA !== null ? slip.CTCPA.toString() : '',
                BONUS: slip.BONUS !== null ? slip.BONUS.toString() : '',
                GRATUITYPMSTRUCTURE: slip.GRATUITYPMSTRUCTURE !== null ? slip.GRATUITYPMSTRUCTURE.toString() : '',
                MEDICLAIMPMSTRUCTURE: slip.MEDICLAIMPMSTRUCTURE !== null ? slip.MEDICLAIMPMSTRUCTURE.toString() : '',
                EMPLOYERPFPMSTRUCTURE: slip.EMPLOYERPFPMSTRUCTURE !== null ? slip.EMPLOYERPFPMSTRUCTURE.toString() : '',
                EMPLOYERESICSTRUCTURE: slip.EMPLOYERESICSTRUCTURE !== null ? slip.EMPLOYERESICSTRUCTURE.toString() : '',
                TOTALSTRUCTURE: slip.TOTALSTRUCTURE !== null ? slip.TOTALSTRUCTURE.toString() : '',
                CTCSTRUCTURE: slip.CTCSTRUCTURE !== null ? slip.CTCSTRUCTURE.toString() : '',
                CREATEDAT: slip.CREATEDAT !== null ? slip.CREATEDAT.toString() : '',
                UPDATEDAT: slip.UPDATEDAT !== null ? slip.UPDATEDAT.toString() : ''
            };
        });

        return res.status(200).json({
            success: true,
            message: "Successfully  generated salary slips",
            data: salarySlipsWithStringValues
        })
    } catch (error) {
        console.log("Error in   generatesalaryslips api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in generatesalaryslips api",
            error: error.message,
            data: []
        })
    }
}
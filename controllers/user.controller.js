const { secretKey } = require("../config");
const UserModel = require("../models/UserModel")
const jwt = require('jsonwebtoken');

exports.createuser = async (req, res) => {
    try {
        let { fullname, username, password, role } = req.body
        username = username.toLowerCase()
        const newUser = await UserModel.create({
            USERNAME: username,
            PASSWORD: password,
            ROLE: role,
            FULLNAME: fullname
        })

        return res.status(201).json({
            success: true,
            message: "User created Successfully.",
            data: {
                id: newUser.ID,
                username: newUser.USERNAME
            }
        })
    } catch (error) {
        console.log("Error in create user api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in createuser api",
            error: error.message,
            data: {
                id: "",
                username: ""
            }
        })
    }
}

exports.getallusers = async (req, res) => {
    try {
        const allusers = await UserModel.findAll({
            order: [['USERNAME', 'ASC']],
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

exports.loginuser = async (req, res) => {
    try {
        console.log("HEELo")
        let { username, password } = req.body;

        username = username.toLowerCase()
        const user = await UserModel.findOne({
            where: {
                USERNAME: username,
                PASSWORD: password,
            },
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }


        const jwtToken = jwt.sign(
            {
                id: user.ID,
                username: user.USERNAME,
                role: user.ROLE,
                fullname: user.FULLNAME
            },
            secretKey,
            { expiresIn: '57m' } // You can adjust the expiration time as needed
        );

        return res.status(200).json({
            success: true, message: 'Login successful', token: jwtToken, data: {
                username: user.USERNAME
            }
        });

    } catch (error) {
        console.log("Error in loginuser api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in loginuser api",
            error: error.message,
            data: []
        })
    }
}

exports.changepassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { oldpassword, newpassword } = req.body;
        const user = await UserModel.findOne({
            where: {
                ID: id
            },
            attributes: ["ID", "USERNAME", "PASSWORD"]
        })

        if (!user) {
            return res.status(400).json({
                success: true,
                message: "User not found."
            })
        }

        if (oldpassword !== user.PASSWORD) {
            return res.status(400).json({
                success: true,
                message: "Old Password does not match"
            })
        }
        const updatedPassword = await UserModel.update(
            { PASSWORD: newpassword },
            { where: { ID: id } }
        );

        return res.status(201).json({
            success: true,
            message: "Password changed successfully",
            data: {
                id: user.ID,
                username: user.USERNAME
            }
        })
    } catch (error) {
        console.log("Error in updatedPassword api", error)
        return res.status(400).json({
            success: false,
            message: "Some error occured in updatedPassword api",
            error: error.message,
            data: {}
        });
    }
}





exports.getuserbyid = async (req, res) => {
    try {
        const { userid } = req.params
        const allusers = await UserModel.findOne({
            where: {
                ID: userid
            },
            attributes: ['ID', 'FULLNAME', 'USERNAME', 'ROLE'],
        })

        let newUsers =
        {
            id: allusers.ID,
            fullname: allusers.FULLNAME,
            username: allusers.USERNAME,
            role: allusers.ROLE,
        }

        console.log("data fetched==>", newUsers)

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


exports.edituserbyid = async (req, res) => {
    try {
        const { userid } = req.params
        let {
            fullname,
            username,
            role } = req.body;
        username = username.toLowerCase()

        console.log(userid, fullname, username, role)

        const user = await UserModel.findOne({
            where: {
                ID: userid
            },
            attributes: ['ID', 'FULLNAME', 'USERNAME', 'ROLE'],

        })

        const updateUser = await UserModel.update(
            {
                FULLNAME: fullname,
                USERNAME: username,
                ROLE: role
            },
            { where: { ID: userid } }
        );

        if (updateUser[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found or no changes made",
                data: null
            });
        }

        return res.status(201).json({
            success: true,
            message: "User updated successfully",
            data: {
                id: userid,
                username: username
            }

        })
    }
    catch (error) {

        console.error("Error updating user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });

    }
}
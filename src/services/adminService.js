require("dotenv").config();
const db = require("../models");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const { Op } = require("sequelize");
const { createJWT } = require("../middleware/jwtAction");
const hashPass = (password) => {
    return bcrypt.hashSync(password, salt);
};
const checkEmail = async (email) => {
    let account = await db.Account.findOne({
        where: { email: email },
    });

    if (account) {
        return true;
    }
    return false;
};
const checkPassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

const registerAccount = async (rawData) => {
    let hashpass = hashPass(rawData.password);
    try {
        let isEmail = await checkEmail(rawData.email);
        if (isEmail === true) {
            return {
                EC: 1,
                EM: "Email already exists",
                DT: "",
            };
        }
        let data = await db.Account.create({
            email: rawData.email,
            password: hashpass,
            roleId: rawData.roleId,
        });
        return {
            EC: 0,
            EM: "Account created successfully",
            DT: data.id,
        };
    } catch (err) {
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};

const loginAccount = async (rawData) => {
    try {
        let account = await db.Account.findOne({
            // where: {
            //     [Op.or]:[
            //         {email: rawData.emailorphone},
            //         {phone: rawData.emailorphone}
            //     ]
            // }
            where: {
                email: rawData.email,
            },
        });
        if (account) {
            let isPassword = checkPassword(rawData.password, account.password);
            // let user = await db.Role.findOne({
            //     where: { id: account.roleId },
            // });
            let role = await db.Role.findOne({
                where: { id: account.roleId },
            });
            let payload = {
                email: account.email,
                role: role.roleName,
            };
            let token = createJWT(payload);
            // const imageBuffer = user.image; // Giả sử hình ảnh được lưu trong trường "image" của bản ghi
            // const base64Image = Buffer.from(imageBuffer, "binary").toString("base64");
            // user.image = base64Image;
            if (isPassword === true) {
                return {
                    EC: 0,
                    EM: "Login succeed",
                    DT: {
                        access_token: token,
                        refresh_token: "refresh_token",
                        email: account.email,
                        //username: user.username,
                        //userId: user.id,
                        image: "",
                        role: role.roleName,
                    },
                };
            }
        }
        return {
            EC: 1,
            EM: "Email or password is incorrect",
            DT: "",
        };
    } catch (err) {
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};
const createNewMedicalStaff = async (fullName, accountId) => {
    try {
        await db.MedicalStaff.create({
            fullName: fullName,
            dateCreated: Date.now(),
            accountId: accountId,
        });
        return {
            EC: 0,
            EM: "User created successfully",
            DT: "",
        };
    } catch (err) {
        console.log(err);
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};
module.exports = {
    registerAccount,
    loginAccount,
    createNewMedicalStaff,
};

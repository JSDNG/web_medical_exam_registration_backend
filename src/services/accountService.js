require("dotenv").config();
const db = require("../models");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const { Op } = require("sequelize");
const getGroupWithRoles = require("./jwtService");
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
const checkUsername = async (username) => {
    let user = await db.User.findOne({
        where: { username: username },
    });

    if (user) {
        return true;
    }
    return false;
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
        let isUsername = await checkUsername(rawData.username);
        if (isUsername === true) {
            return {
                EC: 1,
                EM: "Username already exists",
                DT: "",
            };
        } else {
            let data = await db.Account.create({
                email: rawData.email,
                password: hashpass,
            });
            return {
                EC: 0,
                EM: "Account created successfully",
                DT: data.id,
            };
        }
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
            let user = await db.User.findOne({
                where: { accountId: account.id },
            });

            let dataRoles = await getGroupWithRoles(user.get({ plain: true }));
            let payload = {
                email: account.email,
                dataRoles,
            };
            let token = createJWT(payload);
            const imageBuffer = user.image; // Giả sử hình ảnh được lưu trong trường "image" của bản ghi
            const base64Image = Buffer.from(imageBuffer, "binary").toString("base64");
            user.image = base64Image;
            if (isPassword === true) {
                return {
                    EC: 0,
                    EM: "Login succeed",
                    DT: {
                        access_token: token,
                        refresh_token: "refresh_token",
                        email: account.email,
                        username: user.username,
                        userId: user.id,
                        image: user.image,
                        dataRoles,
                    },
                };
            }
        }
        console.log(">>> Not found email");
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
const getAllAccount = async () => {
    try {
        let lists = await db.Account.findAll();
        return {
            EC: 0,
            EM: "Get all",
            DT: lists,
        };
    } catch (err) {
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};

const getAccountById = async (id) => {
    try {
        let data = await db.Account.findByPk(id);
        //let data = results && results.length > 0 ? results : {};
        return {
            EC: 0,
            EM: "Get data",
            DT: data.get({ plain: true }),
        };
    } catch (err) {
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};

const updateAccountById = async (rawData) => {
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
        let isPassword = checkPassword(rawData.current_password, account.password);
        if (isPassword === true) {
            await db.Account.update(
                {
                    password: rawData.new_password,
                },
                {
                    where: { id: id },
                }
            );
            return {
                EC: 0,
                EM: "Change password",
                DT: "",
            };
        } else {
            return {
                EC: 1,
                EM: " password",
                DT: "",
            };
        }
    } catch (err) {
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};

module.exports = {
    getAllAccount,
    getAccountById,
    registerAccount,
    loginAccount,
    updateAccountById,
};

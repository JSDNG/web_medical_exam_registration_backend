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
            accountType: rawData.accountType,
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
            where: { email: rawData?.email },
        });

        if (!account || !checkPassword(rawData?.password, account?.password)) {
            return {
                EC: 1,
                EM: "Email or password is incorrect",
                DT: "",
            };
        }

        const rolePromise = db.Role.findOne({ where: { id: account.roleId } });

        let userPromise;
        if (account.accountType === "MedicalStaff") {
            userPromise = db.MedicalStaff.findOne({
                where: { accountId: account.id },
                attributes: [
                    "id",
                    "fullName",
                    "image",
                    "dateOfBirth",
                    "gender",
                    "phone",
                    "description",
                    "address",
                    "dateCreated",
                ],
                include: [
                    {
                        model: db.Specialty,
                        attributes: ["id", "specialtyName", "description", "image"],
                        through: { attributes: [] }, // Chỉ cần nếu có bảng trung gian
                    },
                    {
                        model: db.Position,
                        attributes: ["id", "positionName"],
                    },
                ],
            });
        } else if (account.accountType === "Patient") {
            userPromise = db.Patient.findOne({
                where: { accountId: account.id },
                attributes: ["id", "fullName", "image", "dateOfBirth", "gender", "phone", "address", "dateCreated"],
            });
        }

        const [role, user] = await Promise.all([rolePromise, userPromise]);

        let payload = {
            email: account.email,
            role: role.roleName,
        };
        let token = createJWT(payload);
        if (user.image) {
            user.image = Buffer.from(user.image, "binary").toString("base64");
        }

        if (user.Specialties && user.Specialties.length > 0) {
            user.Specialties.forEach((item) => {
                if (item.image) {
                    item.image = Buffer.from(item.image, "binary").toString("base64");
                }
            });
        }

        return {
            EC: 0,
            EM: "Login succeed",
            DT: {
                access_token: token,
                refresh_token: "refresh_token",
                email: account.email,
                user: user,
                role: role.roleName,
            },
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
const createNewUser = async (fullName, accountId, accountType) => {
    try {
        const userCreationData = {
            fullName: fullName,
            dateCreated: Date.now(),
            accountId: accountId,
        };

        if (accountType === "MedicalStaff") {
            await db.MedicalStaff.create(userCreationData);
        } else if (accountType === "Patient") {
            await db.Patient.create(userCreationData);
        } else {
            throw new Error("Invalid account type");
        }

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
    createNewUser,
};

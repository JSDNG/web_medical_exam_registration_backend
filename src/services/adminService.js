require("dotenv").config();
const db = require("../models/index");
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
const checkUser = async (id) => {
    let userId = await db.MedicalStaff.findOne({
        where: { id: id },
    });
    if (userId) {
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
                attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "address", "dateCreated"],
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
const getTime = async () => {
    try {
        let results = await db.PeriodOfTime.findAll({ attributes: ["id", "time"] });
        let data = results && results.length > 0 ? results.map((result) => result.get({ plain: true })) : [];
        return {
            EC: 0,
            EM: "Get the time list",
            DT: data,
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
const getSpecialty = async () => {
    try {
        let results = await db.Specialty.findAll({ attributes: ["id", "specialtyName", "description", "image"] });
        results.forEach((specialty) => {
            if (specialty.image) {
                specialty.image = Buffer.from(specialty.image, "binary").toString("base64");
            }
        });
        let data = results && results.length > 0 ? results.map((result) => result.get({ plain: true })) : [];
        return {
            EC: 0,
            EM: "Get the specialty list",
            DT: data,
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
const getMedicalStaff = async (rawData) => {
    try {
        if (rawData !== "bac-si" && rawData !== "nhan-vien") {
            return { EC: 0, EM: "Not found Medical Staff", DT: [] };
        }
        const list = await db.MedicalStaff.findAll({
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
                    through: { attributes: [] },
                },
                {
                    model: db.Position,
                    attributes: ["id", "positionName"],
                },
                {
                    model: db.Account,
                    attributes: ["id", "email"],
                    include: { model: db.Role, attributes: ["id", "roleName"] },
                },
            ],
        });

        if (!list || list.length === 0) {
            return { EC: 0, EM: "No doctor found", DT: [] };
        }

        const filteredList = list.filter((item) => {
            const roleName = item?.Account?.Role?.roleName;
            if (
                (rawData === "bac-si" && (roleName === "Nhân viên" || roleName === "Quản trị viên")) ||
                (rawData === "nhan-vien" && (roleName === "Bác sĩ" || roleName === "Quản trị viên"))
            ) {
                return false;
            }
            if (item.image) {
                item.image = Buffer.from(item.image, "binary").toString("base64");
            }
            if (item.Specialties) {
                item.Specialties.forEach((specialty) => {
                    if (specialty.image) {
                        specialty.image = Buffer.from(specialty.image, "binary").toString("base64");
                    }
                });
            }
            return true;
        });

        return { EC: 0, EM: "Get list doctor", DT: filteredList };
    } catch (err) {
        console.error(err);
        return { EC: -1, EM: "Something went wrong in service...", DT: "" };
    }
};
const getMedicalStaffById = async (id) => {
    try {
        let isUser = await checkUser(id);
        if (!isUser) {
            return {
                EC: 1,
                EM: "User doesn't already exist",
                DT: "",
            };
        }
        let user = await db.MedicalStaff.findOne({
            where: { id: id },
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
            // raw: true,
            // nest: true,
        });
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
            EM: "get user success",
            DT: user,
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
const putMedicalStaffById = async (rawData) => {
    try {
        let isUserId = await checkUser(rawData.id);
        if (!isUserId) {
            return {
                EC: 1,
                EM: "User doesn't already exist",
                DT: "",
            };
        }
        //const binaryData = Buffer.from(rawData.image, "base64");
        let user = await db.MedicalStaff.update(
            {
                fullName: rawData.fullName,
                image: null,
                //dateOfBirth: new Date(rawData.dateOfBirth),
                gender: rawData.gender,
                phone: rawData.phone,
                description: rawData.description,
                address: rawData.address,
                positionId: rawData.positionId,
            },
            {
                where: { id: rawData.id },
            }
        );
        return {
            EC: 0,
            EM: "User updated successfully",
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
const deleteMedicalStaffById = async (id) => {
    try {
        let isSet = await checkStudySetId(id);
        if (!isSet) {
            return {
                EC: 1,
                EM: "Study Set doesn't already exist",
                DT: "",
            };
        }
        let data = await db.StudySet.destroy({
            where: {
                id: id,
            },
        });
        return {
            EC: 0,
            EM: "Deleted Study Set",
            DT: "",
        };
    } catch (err) {
        return {
            EC: -1,
            EM: "Somthing wrongs in service... ",
            DT: "",
        };
    }
};
const deleteDoctorSpecialtyById = async (id) => {
    try {
        let isUser = await checkUser(id);
        if (!isUser) {
            return {
                EC: 1,
                EM: "Study Set doesn't already exist",
                DT: "",
            };
        }
        let data = await db.DoctorSpecialty.destroy({
            where: {
                doctorId: id,
            },
        });
        return {
            EC: 0,
            EM: "Deleted Study Set",
            DT: "",
        };
    } catch (err) {
        return {
            EC: -1,
            EM: "Somthing wrongs in service... ",
            DT: "",
        };
    }
};

module.exports = {
    registerAccount,
    loginAccount,
    createNewUser,
    getTime,
    getSpecialty,
    getMedicalStaff,
    getMedicalStaffById,
    putMedicalStaffById,
    deleteMedicalStaffById,
    deleteDoctorSpecialtyById,
};

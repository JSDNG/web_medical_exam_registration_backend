require("dotenv").config();
const db = require("../models/index");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
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
        console.log(err);
        return {
            EC: -1,
            EM: "Something wrongs in service... ",
            DT: "",
        };
    }
};
const loginWithLocal = async (rawData) => {
    try {
        let account = await db.Account.findOne({
            where: { email: rawData?.email },
        });
        if (!account.password) {
            return {
                EC: 1,
                EM: "Email or password is incorrect",
                DT: "",
            };
        }
        if (!account || !checkPassword(rawData?.password, account?.password)) {
            return {
                EC: 1,
                EM: "Email or password is incorrect",
                DT: "",
            };
        }

        const rolePromise = db.Role.findOne({ where: { id: account.roleId }, raw: true, nest: true });

        let userPromise;
        if (account.accountType === "MedicalStaff") {
            userPromise = db.MedicalStaff.findOne({
                where: { accountId: account.id },
                attributes: ["id", "fullName", "image", "gender", "phone", "description", "price"],
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
                attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "address"],
                raw: true,
                nest: true,
            });
        }

        let [role, user] = await Promise.all([rolePromise, userPromise]);

        let payload = {
            id: +account.id,
            email: account.email,
            role: role.roleName,
        };
        const access_token = createJWT(payload, process.env.JWT_ACCESS_TOKEN_EXIRES_IN);
        const refresh_token = createJWT(payload, process.env.JWT_REFRESH_TOKEN_EXIRES_IN);
        if (role.roleName !== "Bệnh nhân") {
            user = user.get({ plain: true });
        }

        if (user.image) {
            user.image = Buffer.from(user.image, "binary").toString("base64");
        }
        // const formattedAmount = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        //     user?.price
        // );
        // user.price = user?.price ? formattedAmount : null;
        user.dateOfBirth = user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] : null;
        if (user.Specialties && user.Specialties.length > 0) {
            user.Specialties.forEach((item) => {
                if (item.image) {
                    item.image = Buffer.from(item.image, "binary").toString("base64");
                }
            });
        }

        await db.Account.update(
            {
                refreshToken: refresh_token,
            },
            {
                where: { id: account.id },
            }
        );
        return {
            EC: 0,
            EM: "Login succeed",
            DT: {
                access_token: access_token,
                refresh_token: refresh_token,
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
const loginWithGoogle = async (authType, rawData) => {
    try {
        let account = null;
        if (authType === "google") {
            account = await db.Account.findOne({
                where: { authGoogleId: rawData.authGoogleId, authType: "google" },
                raw: true,
            });

            if (!account) {
                account = await db.Account.create({
                    email: rawData.email,
                    accountType: "Patient",
                    authGoogleId: rawData.authGoogleId,
                    authType: "google",
                    roleId: 4,
                });
                account = account.get({ plain: true });

                await db.Patient.create({
                    fullName: rawData.fullName,
                    accountId: +account.id,
                });
            }
        }

        const rolePromise = db.Role.findOne({ where: { id: +account.roleId }, raw: true, nest: true });
        const patientPrmise = db.Patient.findOne({
            where: { accountId: +account.id },
            attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "address"],
            raw: true,
            nest: true,
        });

        let [role, patient] = await Promise.all([rolePromise, patientPrmise]);

        let payload = {
            id: +account.id,
            email: account.email,
            role: role.roleName,
        };
        const access_token = createJWT(payload, process.env.JWT_ACCESS_TOKEN_EXIRES_IN);
        const refresh_token = createJWT(payload, process.env.JWT_REFRESH_TOKEN_EXIRES_IN);

        patient.dateOfBirth = patient.dateOfBirth ? patient.dateOfBirth.toISOString().split("T")[0] : null;
        await db.Account.update(
            {
                refreshToken: refresh_token,
            },
            {
                where: { id: +account.id },
            }
        );
        return {
            EC: 0,
            EM: "Login succeed",
            DT: {
                access_token: access_token,
                refresh_token: refresh_token,
                email: account.email,
                user: patient,
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
const createNewUser = async (fullName, accountId, accountType, phone) => {
    try {
        let image =
            "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";
        const binaryData = Buffer.from(image, "base64");
        const userCreationData = {
            fullName: fullName,
            image: binaryData,
            phone: phone,
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
        data.sort((a, b) => {
            const timeA = a.time.split(" - ")[0];
            const timeB = b.time.split(" - ")[0];
            const [hoursA, minutesA] = timeA.split(":").map(Number);
            const [hoursB, minutesB] = timeB.split(":").map(Number);

            if (hoursA !== hoursB) {
                return hoursA - hoursB;
            } else {
                return minutesA - minutesB;
            }
        });
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
const getPosition = async () => {
    try {
        let results = await db.Position.findAll({ attributes: ["id", "positionName"] });
        let data = results && results.length > 0 ? results.map((result) => result.get({ plain: true })) : [];
        return {
            EC: 0,
            EM: "Get the position list",
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
const createNewSpecialty = async (rawData) => {
    try {
        const binaryData = Buffer.from(rawData.image, "base64");
        let data = await db.Specialty.create({
            specialtyName: rawData.specialtyName,
            image: binaryData,
            description: rawData.description,
        });
        return {
            EC: 0,
            EM: "Specialty created successfully",
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

const putSpecialtyById = async (rawData) => {
    try {
        const binaryData = Buffer.from(rawData.image, "base64");
        await db.Specialty.update(
            {
                specialtyName: rawData.specialtyName,
                image: binaryData,
                description: rawData.description,
            },
            {
                where: { id: rawData.id },
            }
        );
        return {
            EC: 0,
            EM: "Specialty updated successfully",
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

const getOneSpecialty = async (id) => {
    try {
        let result = await db.Specialty.findOne({
            where: { id: id },
            attributes: ["id", "specialtyName"],
            raw: true,
            nest: true,
        });
        return {
            EC: 0,
            EM: "Get the specialty",
            DT: result,
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
        const results = await db.MedicalStaff.findAll({
            attributes: ["id", "fullName", "image", "gender", "phone", "description", "price"],
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
            // raw: true,
            // nest: true,
            // group: ["MedicalStaff.id"],
        });
        let data = results && results.length > 0 ? results.map((result) => result.get({ plain: true })) : [];
        if (!data || data.length === 0) {
            return { EC: 0, EM: "No doctor found", DT: [] };
        }

        const filteredList = data.filter((item) => {
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
            // const formattedAmount = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
            //     item?.price
            // );
            // item.price = item?.price ? formattedAmount : null;

            if (item.Specialties) {
                item.Specialties.forEach((specialty) => {
                    if (specialty.image) {
                        specialty.image = Buffer.from(specialty.image, "binary").toString("base64");
                    }
                });
            }
            return true;
        });

        return { EC: 0, EM: "Get list medical staff", DT: filteredList };
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
            attributes: ["id", "fullName", "image", "gender", "phone", "description", "price"],
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
                {
                    model: db.Account,
                    attributes: ["email"],
                    include: [
                        {
                            model: db.Role,
                            attributes: ["roleName"],
                        },
                    ],
                },
            ],
            // raw: true,
            // nest: true,
        });
        user = user.get({ plain: true });

        if (user.image) {
            user.image = Buffer.from(user.image, "binary").toString("base64");
        }
        // const formattedAmount = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        //     user?.price
        // );
        // user.price = user?.price ? formattedAmount : null;

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
            DT: {
                email: user.Account.email,
                role: user.Account.Role.roleName,
                user: user,
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
        const binaryData = Buffer.from(rawData.image, "base64");
        let data = await db.MedicalStaff.update(
            {
                fullName: rawData.fullName,
                image: binaryData,
                gender: rawData.gender,
                phone: rawData.phone,
                description: rawData.description,
                price: rawData.price,
                positionId: rawData.positionId,
            },
            {
                where: { id: rawData.id },
            }
        );
        return {
            EC: 0,
            EM: "User updated successfully",
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

const deleteDoctorSpecialtyById = async (id) => {
    try {
        let data = await db.DoctorSpecialty.destroy({
            where: {
                doctorId: id,
            },
        });
        return {
            EC: 0,
            EM: "Deleted doctor specialty",
            DT: "",
        };
    } catch (err) {
        console.log(err);
        return {
            EC: -1,
            EM: "Somthing wrongs in service... ",
            DT: "",
        };
    }
};
const ListOfFamousDoctors = async () => {
    try {
        const results = await db.MedicalStaff.findAll({
            attributes: ["id", "fullName", "image", "gender", "phone", "description", "price"],
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
        let data = results && results.length > 0 ? results.map((result) => result.get({ plain: true })) : [];
        if (!data || data.length === 0) {
            return { EC: 0, EM: "No doctor found", DT: [] };
        }

        const filteredList = data.filter((item) => {
            const roleName = item?.Account?.Role?.roleName;
            if (roleName === "Nhân viên" || roleName === "Quản trị viên") {
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
        const doctorsWithRecords = await Promise.all(
            filteredList.map(async (doctor) => {
                const medicalRecordCount = await db.MedicalRecord.count({
                    where: [{ doctorId: doctor.id }, { statusId: 7 }],
                });
                return {
                    ...doctor,
                    MedicalRecords: medicalRecordCount,
                };
            })
        );
        doctorsWithRecords.sort((a, b) => b.MedicalRecords - a.MedicalRecords);

        return { EC: 0, EM: "Get list of famous doctors", DT: doctorsWithRecords };
    } catch (err) {
        console.error(err);
        return { EC: -1, EM: "Something went wrong in service...", DT: "" };
    }
};
const getAllDoctorfromSpecialtyById = async (id) => {
    try {
        let result = await db.Specialty.findOne({
            where: { id: id },
            attributes: ["id", "specialtyName", "description", "image"],
            include: [
                {
                    model: db.MedicalStaff,
                    attributes: ["id", "fullName", "image", "gender", "phone", "description", "price"],
                    through: { attributes: [] },
                    include: [
                        {
                            model: db.Specialty,
                            attributes: ["id", "specialtyName", "description"],
                            through: { attributes: [] },
                        },
                        {
                            model: db.Position,
                            attributes: ["id", "positionName"],
                        },
                    ],
                },
            ],
        });

        if (result.image) {
            result.image = Buffer.from(result.image, "binary").toString("base64");
        }

        result = result.get({ plain: true });

        if (result.MedicalStaffs && result.MedicalStaffs.length > 0) {
            result.MedicalStaffs.forEach((item) => {
                if (item.image) {
                    item.image = Buffer.from(item.image, "binary").toString("base64");
                }
            });
        }
        return {
            EC: 0,
            EM: "Get All doctor from specialty",
            DT: result,
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

const createNewMedication = async (rawData) => {
    try {
        let data = await db.Medication.create({
            medicationName: rawData.medicationName,
            price: rawData.price,
            description: rawData.description,
        });
        return {
            EC: 0,
            EM: "Medication created successfully",
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
const putMedicationById = async (rawData) => {
    try {
        await db.Medication.update(
            {
                medicationName: rawData.medicationName,
                price: rawData.price,
                description: rawData.description,
            },
            {
                where: { id: rawData.id },
            }
        );
        return {
            EC: 0,
            EM: "Medication updated successfully",
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
const getMedication = async () => {
    try {
        let results = await db.Medication.findAll({ attributes: ["id", "medicationName", "price", "description"] });
        let data = results && results.length > 0 ? results.map((result) => result.get({ plain: true })) : [];
        return {
            EC: 0,
            EM: "Get the medication list",
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
const getAllScheduleByDoctor = async (specialty) => {
    try {
        // Lấy dữ liệu từ cơ sở dữ liệu
        let data = await db.Schedule.findAll({
            attributes: ["id", "date", "doctorId", "timeId"],
            include: [
                {
                    model: db.Appointment,
                    attributes: ["id"],
                },
                {
                    model: db.MedicalStaff,
                    attributes: ["id", "fullName"],
                    include: [
                        {
                            model: db.Specialty,
                            attributes: ["id", "specialtyName"],
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
            order: [["date", "ASC"]],
        });

        // Kiểm tra nếu data không có giá trị thì trả về mảng rỗng
        if (!data || data.length === 0) {
            return {
                EC: 0,
                EM: "No schedules found",
                DT: [],
            };
        }
        let schedules = data && data.length > 0 ? data.map((result) => result.get({ plain: true })) : [];
        const filteredSchedules = schedules.filter((schedule) =>
            schedule.MedicalStaff.Specialties.some((specialtyItem) => specialtyItem.specialtyName === specialty)
        );
        // Lấy tất cả các timeId cần thiết trong một lần truy vấn
        const timeIds = [...new Set(filteredSchedules.map((schedule) => schedule.timeId))];
        const times = await db.PeriodOfTime.findAll({
            where: { id: timeIds },
            attributes: ["id", "time"],
            raw: true,
        });

        // Tạo một map từ timeId đến time để dễ dàng tra cứu
        const timeMap = times.reduce((acc, time) => {
            acc[time.id] = time.time;
            return acc;
        }, {});

        // Nhóm các đối tượng theo ngày và thay thế timeId bằng thời gian tương ứng
        const groupedData = filteredSchedules.reduce((acc, schedule) => {
            const date = schedule.date.toISOString().split("T")[0]; // Lấy ngày (không lấy giờ)
            if (!acc[date]) {
                acc[date] = [];
            }
            schedule.timeId = { time: timeMap[schedule.timeId] };
            schedule.date = schedule.date.toISOString().split("T")[0];
            acc[date].push(schedule);
            return acc;
        }, {});

        // Chuyển đổi định dạng để trả về
        const result = Object.keys(groupedData).map((date) => ({
            date,
            schedules: groupedData[date],
        }));

        // Sắp xếp thời gian của lịch trình theo thứ tự tăng dần
        result.forEach((item) => {
            item.schedules.sort((a, b) => {
                // Trích xuất thời gian bắt đầu từ chuỗi thời gian
                const timeA = a.timeId.time.split(" - ")[0];
                const timeB = b.timeId.time.split(" - ")[0];

                // Chuyển đổi thời gian sang dạng số để so sánh
                const [hoursA, minutesA] = timeA.split(":").map(Number);
                const [hoursB, minutesB] = timeB.split(":").map(Number);

                return hoursA - hoursB || minutesA - minutesB;
            });
        });
        return {
            EC: 0,
            EM: "Get the schedule list",
            DT: result,
        };
    } catch (err) {
        console.log(err);
        return {
            EC: -1,
            EM: "Something went wrong in service...",
            DT: "",
        };
    }
};
module.exports = {
    registerAccount,
    loginWithLocal,
    loginWithGoogle,
    createNewUser,
    getTime,
    getPosition,
    createNewSpecialty,
    putSpecialtyById,
    getSpecialty,
    getOneSpecialty,
    getMedicalStaff,
    ListOfFamousDoctors,
    getMedicalStaffById,
    putMedicalStaffById,
    deleteDoctorSpecialtyById,
    getAllDoctorfromSpecialtyById,
    getMedication,
    createNewMedication,
    putMedicationById,
    getAllScheduleByDoctor,
};

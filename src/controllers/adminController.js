const {
    registerAccount,
    loginWithLocal,
    createNewUser,
    getTime,
    getSpecialty,
    getMedicalStaff,
    getMedicalStaffById,
    putMedicalStaffById,
    deleteDoctorSpecialtyById,
    getPosition,
    putSpecialtyById,
    createNewSpecialty,
    listOfFamousDoctors,
    getAllDoctorfromSpecialtyById,
    createNewMedication,
    putMedicationById,
    getMedication,
} = require("../services/adminService");
const { createDoctorSpecialty } = require("../services/doctorService");
require("dotenv").config();
const register = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.fullName || !req.body.roleId || !req.body.accountType) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        if (req.body.password.length < 6) {
            return res.status(200).json({
                EC: 1,
                EM: "Your password must have at least 6 characters",
                DT: "",
            });
        }
        let data = await registerAccount(req.body);
        if (data.EC !== 0) {
            return res.status(200).json({
                EC: data.EC,
                EM: data.EM,
                DT: "",
            });
        }
        let accountId = data.DT && data.DT.toString();

        if (accountId) {
            let data1 = await createNewUser(req.body.fullName, accountId, req.body.accountType, req.body.phone);
            return res.status(200).json({
                EC: data1.EC,
                EM: data1.EM,
                DT: "",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};

const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data = await loginWithLocal(req.body);
        // set cookie
        if (data && data.DT && data.DT.access_token && data.DT.refresh_token) {
            res.cookie("access_token", data.DT.access_token, {
                httpOnly: true,
                maxAge: +process.env.MAX_AGE_ACCESS_TOKEN,
            });
            res.cookie("refresh_token", data.DT.refresh_token, {
                httpOnly: true,
                maxAge: +process.env.MAX_AGE_REFRESH_TOKEN,
            });
        }

        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const logout = async (req, res) => {
    try {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.clearCookie("id");
        return res.status(200).json({
            EC: 0,
            EM: "Đăng xuất thành công.",
            DT: "",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllMedicalStaff = async (req, res) => {
    try {
        if (!req.query.medicalstaff) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data = await getMedicalStaff(req.query.medicalstaff, req.query.search);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllTime = async (req, res) => {
    try {
        let data = await getTime();
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllPosition = async (req, res) => {
    try {
        let data = await getPosition();
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const postSpecialty = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data = await createNewSpecialty(req.body);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllSpecialty = async (req, res) => {
    try {
        let page = req.query.page;
        let limit = req.query.limit;
        let data = await getSpecialty(+page, +limit);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const putOneSpecialty = async (req, res) => {
    try {
        // console.log(req.body);
        if (!req.body.id) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required params",
                DT: "",
            });
        }
        let data = await putSpecialtyById(req.body);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getOneMedicalStaff = async (req, res) => {
    try {
        let data = await getMedicalStaffById(req.query.id);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const putOneMedicalStaff = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                EC: 1,
                EM: "missing required params",
                DT: "",
            });
        }

        if (req.body?.specialty?.length > 0) {
            await createDoctorSpecialty(req.body.specialty, req.body.id);
        }
        let data = await putMedicalStaffById(req.body);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getListOfFamousDoctors = async (req, res) => {
    try {
        let page = req.query.page;
        let limit = req.query.limit;
        let data = await listOfFamousDoctors(+page, +limit);

        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllDoctorfromSpecialty = async (req, res) => {
    try {
        let data = await getAllDoctorfromSpecialtyById(req.query.id);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};

const postMedication = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data = await createNewMedication(req.body);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};

const putMedication = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                EC: 1,
                EM: "missing required params",
                DT: "",
            });
        }
        let data = await putMedicationById(req.body);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllMedication = async (req, res) => {
    try {
        let data = await getMedication();
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getAllMedicalStaff,
    getAllTime,
    getAllPosition,
    postSpecialty,
    getAllSpecialty,
    putOneSpecialty,
    getOneMedicalStaff,
    putOneMedicalStaff,
    getListOfFamousDoctors,
    getAllDoctorfromSpecialty,
    getAllMedication,
    postMedication,
    putMedication,
};

const {
    registerAccount,
    loginAccount,
    createNewUser,
    getTime,
    getMedicalStaff,
    getMedicalStaffById,
    putMedicalStaffById,
    deleteMedicalStaffById,
    deleteDoctorSpecialtyById,
} = require("../services/adminService");
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
            let data1 = await createNewUser(req.body.fullName, accountId, req.body.accountType);
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
        let data = await loginAccount(req.body);
        // set cookie
        if (data && data.DT && data.DT.access_token) {
            res.cookie("jwt", data.DT.access_token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        }

        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({
            EC: 0,
            EM: "Logout succeed",
            DT: req.body,
        });
    } catch (err) {
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getAllMedicalStaff = async (req, res) => {
    try {
        if (!req.body.medicalStaff) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data = await getMedicalStaff(req.body.medicalStaff);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
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
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const getOneMedicalStaff = async (req, res) => {
    try {
        let data = await getMedicalStaffById(req.params.id);
        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT,
        });
    } catch (err) {
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const putOneMedicalStaff = async (req, res) => {
    try {
        if (!req.body.id || !req.body.username) {
            return res.status(200).json({
                EC: 1,
                EM: "missing required params",
                DT: "",
            });
        } else {
            let data = await putMedicalStaffById(req.body);
            return res.status(200).json({
                EC: data.EC,
                EM: data.EM,
                DT: data.DT,
            });
        }
    } catch (err) {
        res.status(500).json({
            EC: -1,
            EM: "error from server",
            DT: "",
        });
    }
};
const deleteOneMedicalStaff = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(200).json({
                EC: 1,
                EM: "missing required params",
                DT: "",
            });
        } else {
            // let data = await deleteDoctorSpecialtyById(req.params.id);
            // let data1 = await deleteCardByStudySetId(req.params.id);
            // if (data1 && data1.EC === 0) {
            //     let data = await deleteStudySetById(req.params.id);
            //     return res.status(200).json({
            //         EC: data.EC,
            //         EM: data.EM,
            //         DT: data.DT,
            //     });
            // }
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
module.exports = {
    register,
    login,
    logout,
    getAllMedicalStaff,
    getAllTime,
    getOneMedicalStaff,
    putOneMedicalStaff,
    deleteOneMedicalStaff,
};

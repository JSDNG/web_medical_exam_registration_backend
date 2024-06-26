const { getAllSchedule, createSchedule, deleteSchedule } = require("../services/doctorService");

const postSchedule = async (req, res) => {
    try {
        if (!req.body.create) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data1 = await deleteSchedule(req.body.delete);
        let data = await createSchedule(req.body.create);
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
const getSchedule = async (req, res) => {
    try {
        let data = await getAllSchedule();
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
module.exports = {
    postSchedule,
    getSchedule,
};

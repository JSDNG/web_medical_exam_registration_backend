const { getAllSchedule, createSchedule, deleteSchedule, getAllTime } = require("../services/doctorService");

const postSchedule = async (req, res) => {
    try {
        if (!req.body.create && !req.body.delete) {
            return res.status(200).json({
                EC: 1,
                EM: "Missing required parameters",
                DT: "",
            });
        }
        let data;
        if(req.body.create && req.body.create.length > 0){
            data = await createSchedule(req.body.create);
        }
        if(req.body.delete && req.body.delete.length > 0){
            data = await deleteSchedule(req.body.delete);
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
const getSchedule = async (req, res) => {
    try {

        let data = await getAllSchedule(req.params.id);
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
const getTime = async (req, res) => {
    try {
        let data = await getAllTime();
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
    getTime,
};

const db = require("../models");
const _ = require("lodash");
const { reduce } = require("lodash");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const prescription = require("../models/prescription");
const { sendEmailInvoice } = require("./emailService");
const checkUserId = async (id) => {
    let userId = await db.MedicalStaff.findOne({
        where: { id: id },
    });
    if (userId) {
        return true;
    }
    return false;
};
const createSchedule = async (rawData) => {
    try {
        // Lấy thông tin lịch hiện tại từ cơ sở dữ liệu
        let dataOld = await db.Schedule.findAll({
            where: { doctorId: rawData[0].doctorId, date: rawData[0].date },
            attributes: ["date", "doctorId", "timeId"],
            raw: true,
        });

        // Chuyển đổi date của các lịch hiện tại sang timestamp
        const convertDateToTimestamp = (item) => {
            item.date = new Date(item.date).getTime();
            return item;
        };

        if (dataOld && dataOld.length > 0) {
            dataOld = dataOld.map(convertDateToTimestamp);
        }

        // So sánh và tạo danh sách các lịch cần tạo mới
        const toCreate = _.differenceWith(rawData, dataOld, (a, b) => {
            return a.timeId === b.timeId && new Date(a.date).getTime() === b.date;
        });

        // Tạo mới các lịch cần tạo
        if (toCreate.length > 0) {
            await db.Schedule.bulkCreate(toCreate);
        }
        return {
            EC: 0,
            EM: "Schedule created successfully",
            DT: "",
        };
    } catch (err) {
        console.error(err);
        return {
            EC: -1,
            EM: "Something wrongs in service...",
            DT: "",
        };
    }
};
const getAllSchedule = async (id) => {
    try {
        const whereCondition = id ? { doctorId: id } : {};
        // Lấy dữ liệu từ cơ sở dữ liệu
        let data = await db.Schedule.findAll({
            where: whereCondition,
            attributes: ["id", "date", "doctorId", "timeId"],
            include: [
                {
                    model: db.Appointment,
                    attributes: ["id"],
                },
            ],

            raw: true,
            nest: true,
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

        // Lấy tất cả các timeId cần thiết trong một lần truy vấn
        const timeIds = [...new Set(data.map((schedule) => schedule.timeId))];
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
        const groupedData = data.reduce((acc, schedule) => {
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
const deleteSchedule = async (rawData) => {
    try {
        console.log(rawData);
        if (!rawData || rawData.length === 0) {
            return {
                EC: 1,
                EM: "No schedules to delete",
                DT: "",
            };
        }
        await db.Schedule.destroy({
            where: {
                id: {
                    [Op.in]: rawData,
                },
            },
        });

        return {
            EC: 0,
            EM: "Deleted",
            DT: "",
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
const getAllAppointmentfromOneDoctor = async (doctorId, statusId) => {
    try {
        // Lấy dữ liệu từ cơ sở dữ liệu
        let data = await db.Appointment.findAll({
            attributes: ["id", "appointmentNumber", "staffId", "updatedAt"],
            include: [
                {
                    model: db.AllStatus,
                    attributes: ["id", "statusName"],
                },
                {
                    model: db.Schedule,
                    attributes: ["id", "date"],
                    include: [
                        {
                            model: db.MedicalStaff,
                            attributes: ["id", "price"],
                        },
                        {
                            model: db.PeriodOfTime,
                            attributes: ["id", "time"],
                        },
                    ],
                },
                {
                    model: db.MedicalRecord,
                    attributes: ["id", "medicalHistory", "reason", "diagnosis"],
                    include: [
                        {
                            model: db.Relative,
                            attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "email", "address"],
                        },
                        {
                            model: db.Patient,
                            attributes: ["id", "fullName", "dateOfBirth", "gender", "phone", "address"],
                            include: [
                                {
                                    model: db.Account,
                                    attributes: ["email"],
                                },
                            ],
                        },
                        {
                            model: db.AllStatus,
                            attributes: ["id", "statusName"],
                        },
                        {
                            model: db.Specialty,
                            attributes: ["id", "specialtyName"],
                        },
                    ],
                },
            ],
            raw: true,
            nest: true,
        });
        // Lọc theo id của bác sĩ
        let result = data.filter(
            (item) => item.Schedule.MedicalStaff.id === +doctorId && item.AllStatus.id === +statusId
        );

        // Kiểm tra nếu data không có giá trị thì trả về mảng rỗng
        if (!data || data.length === 0 || result.length === 0) {
            return {
                EC: 0,
                EM: "No Appointments found",
                DT: [],
            };
        }
        if (+statusId === 3) {
            let results = result.map((item) => {
                let patientInfo =
                    item.MedicalRecord.Relative.id !== null ? item.MedicalRecord.Relative : item.MedicalRecord.Patient;

                let items = {
                    id: item.id,
                    appointmentNumber: item.appointmentNumber,
                    updatedAt: item.updatedAt,
                    statusAM: item.AllStatus.statusName,
                    time: item.Schedule.PeriodOfTime.time,
                    date: item.Schedule.date.toISOString().split("T")[0],
                    MedicalRecord: {
                        id: item.MedicalRecord.id,
                        medicalHistory: item.MedicalRecord.medicalHistory,
                        reason: item.MedicalRecord.reason,
                        specialtyMR: item.MedicalRecord.Specialty.specialtyName,
                    },
                    Patient: {
                        id: patientInfo.id,
                        fullName: patientInfo.fullName,
                        dateOfBirth: patientInfo.dateOfBirth
                            ? patientInfo.dateOfBirth.toISOString().split("T")[0]
                            : null,
                        gender: patientInfo.gender,
                        phone: patientInfo.phone,
                        email: patientInfo.email || patientInfo.Account?.email,
                        address: patientInfo.address,
                    },
                };

                return items;
            });

            results.sort((a, b) => b.updatedAt - a.updatedAt);
            return {
                EC: 0,
                EM: "Get the Appointment list",
                DT: results,
            };
        }
        // Sắp xếp theo date và time
        const sortedData = result.sort((a, b) => {
            // So sánh theo date
            const dateA = new Date(a.Schedule.date);
            const dateB = new Date(b.Schedule.date);
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;

            // Nếu date giống nhau, so sánh theo time
            const timeA = a.Schedule.PeriodOfTime.time.split(" - ")[0];
            const timeB = b.Schedule.PeriodOfTime.time.split(" - ")[0];
            return timeA.localeCompare(timeB);
        });

        // Nhóm các đối tượng theo date và định dạng lại theo yêu cầu
        const groupedData = sortedData.reduce((acc, currentItem) => {
            const date = currentItem.Schedule.date.toISOString().split("T")[0]; // Lấy phần ngày
            if (!acc[date]) {
                acc[date] = [{ date: date, data: [] }];
            }
            acc[date][0].data.push(currentItem);
            return acc;
        }, {});
        // Biến đổi DT thành mảng
        const DTArray = Object.values(groupedData).flat();

        let results = DTArray.map((item) => {
            return {
                date: item.date,
                data: item.data.map((item) => {
                    let patientInfo =
                        item.MedicalRecord.Relative.id !== null
                            ? item.MedicalRecord.Relative
                            : item.MedicalRecord.Patient;
                    let items = {
                        id: item.id,
                        appointmentNumber: item.appointmentNumber,
                        statusAp: item.AllStatus.statusName,
                        price: item.Schedule.MedicalStaff.price,
                        time: item.Schedule.PeriodOfTime.time,
                        MedicalRecord: {
                            id: item.MedicalRecord.id,
                            medicalHistory: item.MedicalRecord.medicalHistory,
                            reason: item.MedicalRecord.reason,
                            diagnosis: item.MedicalRecord.diagnosis,
                            statusMR: item.MedicalRecord.AllStatus.statusName,
                            specialtyMR: item.MedicalRecord.Specialty.specialtyName,
                        },
                        Patient: {
                            id: patientInfo.id,
                            fullName: patientInfo.fullName,
                            dateOfBirth: patientInfo.dateOfBirth
                                ? patientInfo.dateOfBirth.toISOString().split("T")[0]
                                : null,
                            gender: patientInfo.gender,
                            phone: patientInfo.phone,
                            email: patientInfo.email || patientInfo.Account?.email,
                            address: patientInfo.address,
                        },
                    };
                    return items;
                }),
            };
        });
        return {
            EC: 0,
            EM: "Get the Appointment list",
            DT: results,
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
const createDoctorSpecialty = async (rawData, id) => {
    try {
        // Lấy tất cả specialtyId hiện tại của doctorId từ cơ sở dữ liệu
        const existingSpecialties = await db.DoctorSpecialty.findAll({
            where: {
                doctorId: id,
                specialtyId: rawData,
            },
            attributes: ["specialtyId"],
        });

        // Tạo một tập hợp chứa những specialtyId đã tồn tại
        const existingSpecialtyIds = new Set(existingSpecialties.map((specialty) => specialty.specialtyId));

        // Lọc ra những specialtyId chưa có trong cơ sở dữ liệu
        const newSpecialties = rawData.filter((specialtyId) => !existingSpecialtyIds.has(specialtyId));

        // Tạo đối tượng mới chỉ với những specialtyId chưa tồn tại
        const result = newSpecialties.map((specialtyId) => ({
            doctorId: id,
            specialtyId: specialtyId,
        }));

        // Thực hiện bulkCreate nếu có specialtyId mới
        if (result.length > 0) {
            await db.DoctorSpecialty.bulkCreate(result);
        }

        return {
            EC: 0,
            EM: "Specialties created successfully",
            DT: "",
        };
    } catch (err) {
        console.error(err);
        return {
            EC: -1,
            EM: "Something went wrong in the service...",
            DT: "",
        };
    }
};

const createPrescription = async (rawData) => {
    try {
        let result = await db.Prescription.create({
            doctorId: rawData.doctorId,
            recordId: rawData.recordId,
        });
        rawData.prescriptionDetail = rawData.prescriptionDetail.map((item) => ({
            ...item,
            prescriptionId: result.id,
        }));
        await db.PrescriptionDetail.bulkCreate(rawData.prescriptionDetail);
        const [medicalRecord, prescription] = await Promise.all([
            db.MedicalRecord.findOne({
                where: { id: rawData.recordId },
                attributes: ["id", "diagnosis"],
                include: [
                    {
                        model: db.Specialty,
                        attributes: ["id", "specialtyName"],
                    },
                    {
                        model: db.MedicalStaff,
                        attributes: ["id", "fullName", "price"],
                    },
                ],
            }),
            db.Prescription.findOne({
                where: { id: result.id },
                attributes: ["id"],
                include: [
                    {
                        model: db.Medication,
                        attributes: ["id", "medicationName", "description", "price"],
                        through: { attributes: ["instruction", "quantity"] },
                    },
                ],
            }),
        ]);

        if (!medicalRecord || !prescription) {
            throw new Error("Medical record or prescription not found");
        }

        const medications = prescription.Medications.map((item) => ({
            medicationName: item.medicationName,
            price: item.price,
            instruction: item.PrescriptionDetail.instruction,
            quantity: item.PrescriptionDetail.quantity,
        }));

        const total =
            parseFloat(medicalRecord.MedicalStaff.price.replace(".", ""), 10) +
            medications.reduce((acc, item) => acc + parseInt(item.price.replace(".", ""), 10) * item.quantity, 0);
        console.log(total);
        const result1 = {
            medicalRecord: {
                diagnosis: medicalRecord.diagnosis,
                specialtyMR: medicalRecord.Specialty.specialtyName,
                doctor: medicalRecord.MedicalStaff.fullName,
            },
            medications,
            total: total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        };
        return {
            EC: 0,
            EM: "Prescription created successfully",
            DT: result1,
        };
    } catch (err) {
        console.error(err);
        return {
            EC: -1,
            EM: "Something wrongs in service...",
            DT: "",
        };
    }
};

const createInvoice = async (rawData) => {
    try {
        const binaryData = Buffer.from(rawData.file, "base64");
        let data = await db.Invoice.create({
            file: binaryData,
            doctorId: rawData.doctorId,
            recordId: rawData.recordId,
        });
        await sendEmailInvoice(rawData);
        return {
            EC: 0,
            EM: "Invoice created successfully",
            DT: "data",
        };
    } catch (err) {
        console.error(err);
        return {
            EC: -1,
            EM: "Something wrongs in service...",
            DT: "",
        };
    }
};
const getAllInvoiceByDoctorId = async (id) => {
    try {
        // Lấy dữ liệu từ cơ sở dữ liệu
        let data = await db.Invoice.findAll({
            where: { doctorId: id },
            attributes: ["id", "recordId"],
            raw: true,
            nest: true,
        });
        if (!data || data.length === 0) {
            return {
                EC: 0,
                EM: "No invoice found",
                DT: [],
            };
        }
        return {
            EC: 0,
            EM: "Get the Invoice list",
            DT: data,
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
const putMedicalRecordById = async (rawData) => {
    try {
        console.log(rawData);
        await db.MedicalRecord.update(
            {
                medicalHistory: rawData.medicalHistory,
                reason: rawData.reason,
                diagnosis: rawData.diagnosis,
                statusId: rawData.statusId,
            },
            {
                where: { id: rawData.id },
            }
        );
        return {
            EC: 0,
            EM: "Medical Record updated successfully",
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
    createSchedule,
    getAllSchedule,
    deleteSchedule,
    getAllAppointmentfromOneDoctor,
    createDoctorSpecialty,
    createPrescription,
    createInvoice,
    getAllInvoiceByDoctorId,
    putMedicalRecordById,
};

require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmailAppointment = async (data) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });
        let message = {
            from: '"Bookingcare 👻" <tranducquynh00000@gmail.com>',
            to: data.Patient.email,
            subject: "Thông tin đặt lịch khám bệnh",
            html: `
            <h3>Xin chào ${data.Patient.fullName}</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Bookingcare.</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Khoa: ${data.MedicalRecord.specialtyMR}</b></div>
            <div><b>Số thứ tự khám: ${data.appointmentNumber}, Thời gian: ${data.time}, ${data.date}</b></div>
            <p>Thông tin bác sĩ:</p>
            <div><b>Bác sĩ: ${data.MedicalStaff.fullName}, Số điện thoại: ${data.MedicalStaff.phone}, Giá khám: ${data.MedicalStaff.price} đ</b></div>
            <div><b>Địa chỉ phòng khám: 97 Man Thiện, phường Hiệp Phú, TP Thủ Đức</b></div>
            <p>Vui lòng bệnh nhân đến khám đúng giờ, Xin chân thành cảm ơn!</p>
            `,
        };
        const info = await transporter.sendMail(message);
        return info;
    } catch (err) {
        console.log(err);
        return {
            EC: -1,
            EM: "Something wrongs in service...",
            DT: "",
        };
    }
};
const sendEmailInvoice = async (data) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });
        let message = {
            from: '"Bookingcare 👻" <tranducquynh00000@gmail.com>',
            to: data.email,
            subject: "Kết quả khám bệnh",
            html: `
            <h3>Xin chào ${data.patientName}</h3>
            <p>Bạn nhận được email này vì đã khám bệnh tại Bookingcare.</p>
            <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>
            <p>Xin chân thành cảm ơn!</p>
            `,
            attachments: [
                {
                    path: data.file,
                },
            ],
        };
        const info = await transporter.sendMail(message);
        return info;
    } catch (err) {
        console.log(err);
        return {
            EC: -1,
            EM: "Something wrongs in service...",
            DT: "",
        };
    }
};
module.exports = {
    sendEmailAppointment,
    sendEmailInvoice,
};

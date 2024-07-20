"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // await queryInterface.bulkInsert("Role", [
        //     {
        //         roleName: "Quản trị viên",
        //     },
        //     {
        //         roleName: "Bác sĩ",
        //     },
        //     {
        //         roleName: "Nhân viên",
        //     },
        //     {
        //         roleName: "Bệnh nhân",
        //     },
        // ]);
        // await queryInterface.bulkInsert("Position", [
        //     {
        //         positionName: "Thạc sĩ",
        //     },
        //     {
        //         positionName: "Tiến sĩ",
        //     },
        //     {
        //         positionName: "Phó giáo sư",
        //     },
        //     {
        //         positionName: "Giáo sư",
        //     },
        // ]);
        // await queryInterface.bulkInsert("Specialty", [
        //     {
        //         specialtyName: "Thần kinh",
        //         description: "DataTypes.STRING",
        //         image: "DataTypes.STRING",
        //     },
        //     {
        //         specialtyName: "Cơ xương khớp",
        //         description: "DataTypes.STRING",
        //         image: "DataTypes.STRING",
        //     },
        //     {
        //         specialtyName: "Tiêu hóa",
        //         description: "DataTypes.STRING",
        //         image: "DataTypes.STRING",
        //     },
        //     {
        //         specialtyName: "Tim mạch",
        //         description: "DataTypes.STRING",
        //         image: "DataTypes.STRING",
        //     },
        // ]);
        // await queryInterface.bulkInsert("PeriodOfTime", [
        //     {
        //         time: "08:00 - 08:30",
        //     },
        //     {
        //         time: "08:30 - 09:00",
        //     },
        //     {
        //         time: "09:00 - 09:30",
        //     },
        //     {
        //         time: "09:30 - 10:00",
        //     },
        //     {
        //         time: "10:00 - 10:30",
        //     },
        //     {
        //         time: "10:30 - 11:00",
        //     },
        //     {
        //         time: "13:00 - 13:30",
        //     },
        //     {
        //         time: "13:30 - 14:00",
        //     },
        //     {
        //         time: "14:00 - 14:30",
        //     },
        //     {
        //         time: "14:30 - 15:00",
        //     },
        //     {
        //         time: "23:00 - 23:30",
        //     },
        //     {
        //         time: "23:30 - 24:00",
        //     },
        //     {
        //         time: "24:00 - 01:30",
        //     },
        // ]);
        // await queryInterface.bulkInsert("AllStatus", [
        //     {
        //         statusName: "Chờ xác nhận",
        //     },
        //     {
        //         statusName: "Đã xác nhận",
        //     },
        //     {
        //         statusName: "Hoàn thành",
        //     },
        //     {
        //         statusName: "Hủy bỏ",
        //     },
        //     {
        //         statusName: "Không đến",
        //     },
        //     {
        //         statusName: "Tạo mới",
        //     },
        //     {
        //         statusName: "Đã khám",
        //     },
        //     {
        //         statusName: "Tái khám",
        //     },
        // ]);
        // await queryInterface.bulkInsert("Medication", [
        //     {
        //         medicationName: "Thuốc giảm đau và hạ sốt(Paracetamol)",
        //         description: "Giảm đau và hạ sốt, thường được sử dụng cho các cơn đau nhẹ và trung bình.",
        //         price: "50.000",
        //     },
        //     {
        //         medicationName: "Thuốc kháng sinh(Amoxicillin)",
        //         description:
        //             "Kháng sinh thuộc nhóm penicillin, thường được sử dụng để điều trị nhiễm trùng do vi khuẩn như viêm phổi, viêm tai giữa, và viêm họng.",
        //         price: "40.000",
        //     },
        //     {
        //         medicationName: "Thuốc chống viêm(Prednisone)",
        //         description:
        //             "Thuốc corticosteroid được sử dụng để giảm viêm và ức chế hệ miễn dịch, thường được sử dụng trong các bệnh như viêm khớp, lupus, và bệnh phổi.",
        //         price: "60.000",
        //     },
        //     {
        //         medicationName: "Thuốc hạ huyết áp(Amlodipine)",
        //         description: "Thuốc chẹn kênh canxi được sử dụng để điều trị cao huyết áp và đau thắt ngực.",
        //         price: "70.000",
        //     },
        //     {
        //         medicationName: "Thuốc điều trị tiểu đường(Metformin)",
        //         description:
        //             "Thuốc uống được sử dụng để kiểm soát lượng đường trong máu ở những người bị bệnh tiểu đường tuýp 2.",
        //         price: "80.000",
        //     },
        // ]);
        // await queryInterface.bulkInsert("DoctorSpecialty", [
        //     {
        //         doctorId: 2,
        //         specialtyId: 1,
        //     },
        //     {
        //         doctorId: 4,
        //         specialtyId: 1,
        //     },
        // ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};

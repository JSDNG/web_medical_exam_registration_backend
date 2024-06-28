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
        //         time: "15:00 - 15:30",
        //     },
        //     {
        //         time: "15:30 - 16:00",
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
        //         statusName: "Khởi tạo",
        //     },
        //     {
        //         statusName: "Đã khám",
        //     },
        //     {
        //         statusName: "Tái khám",
        //     },
        // ]);
        await queryInterface.bulkInsert("Account", [
            {
                email: "doctor3@gmail.com",
                password: "$2a$10$FwzpIIPd8qykQkXD3R4nn.d2s6BEQaPFR6GOf3ZoaVIRWw3vRCU/O",
                accountType: "MedicalStaff",
                roleId: 2,
            },
        ]);
        await queryInterface.bulkInsert("MedicalStaff", [
            {
                fullName: "Doctor3",
                image: "DataTypes.STRING",
                dateOfBirth: new Date("2002-01-17"),
                gender: "Nam",
                phone: "123456789",
                description: "DataTypes.STRING",
                address: "DataTypes.STRING",
                dateCreated: new Date(),
                accountId: 4,
                positionId: 4,
            },
        ]);
        await queryInterface.bulkInsert("DoctorSpecialty", [
            {
                doctorId: 4,
                specialtyId: 1,
            },
            {
                doctorId: 4,
                specialtyId: 2,
            },
        ]);
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

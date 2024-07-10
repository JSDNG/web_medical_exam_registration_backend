"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("Role", [
            {
                roleName: "Quản trị viên",
            },
            {
                roleName: "Bác sĩ",
            },
            {
                roleName: "Nhân viên",
            },
            {
                roleName: "Bệnh nhân",
            },
        ]);
        await queryInterface.bulkInsert("Position", [
            {
                positionName: "Thạc sĩ",
            },
            {
                positionName: "Tiến sĩ",
            },
            {
                positionName: "Phó giáo sư",
            },
            {
                positionName: "Giáo sư",
            },
        ]);
        await queryInterface.bulkInsert("Specialty", [
            {
                specialtyName: "Thần kinh",
                description: "",
                image: "",
            },
            {
                specialtyName: "Cơ xương khớp",
                description: "DataTypes.STRING",
                image: "DataTypes.STRING",
            },
            {
                specialtyName: "Tiêu hóa",
                description: "DataTypes.STRING",
                image: "DataTypes.STRING",
            },
            {
                specialtyName: "Tim mạch",
                description: "DataTypes.STRING",
                image: "DataTypes.STRING",
            },
        ]);
        await queryInterface.bulkInsert("PeriodOfTime", [
            {
                time: "08:00 - 08:30",
            },
            {
                time: "08:30 - 09:00",
            },
            {
                time: "09:00 - 09:30",
            },
            {
                time: "09:30 - 10:00",
            },
            {
                time: "10:00 - 10:30",
            },
            {
                time: "10:30 - 11:00",
            },
            {
                time: "13:00 - 13:30",
            },
            {
                time: "13:30 - 14:00",
            },
            {
                time: "14:00 - 14:30",
            },
            {
                time: "14:30 - 15:00",
            },
            {
                time: "15:00 - 15:30",
            },
            {
                time: "15:30 - 16:00",
            },
        ]);
        await queryInterface.bulkInsert("AllStatus", [
            {
                statusName: "Chờ xác nhận",
            },
            {
                statusName: "Đã xác nhận",
            },
            {
                statusName: "Hoàn thành",
            },
            {
                statusName: "Hủy bỏ",
            },
            {
                statusName: "Không đến",
            },
            {
                statusName: "Khởi tạo",
            },
            {
                statusName: "Đã khám",
            },
            {
                statusName: "Tái khám",
            },
        ]);
        await queryInterface.bulkInsert("Account", [
            {
                email: "admin@gmail.com",
                password: "123456",
                roleId: 1,
            },
            {
                email: "doctor1@gmail.com",
                password: "123456",
                roleId: 2,
            },
            {
                email: "doctor2@gmail.com",
                password: "123456",
                roleId: 2,
            },
            {
                email: "staff1@gmail.com",
                password: "123456",
                roleId: 3,
            },
            {
                email: "patient1@gmail.com",
                password: "123456",
                roleId: 4,
            },
        ]);
        await queryInterface.bulkInsert("MedicalStaff", [
            {
                fullName: "Doctor1",
                image: "DataTypes.STRING",
                dateOfBirth: new Date("2002-01-17"),
                gender: "Nam",
                phone: "123456789",
                description: "DataTypes.STRING",
                address: "DataTypes.STRING",
                dateCreated: new Date(),
                accountId: 2,
                positionId: 4,
            },
            {
                fullName: "Doctor2",
                image: "DataTypes.STRING",
                dateOfBirth: new Date("2000-01-17"),
                gender: "Nữ",
                phone: "12339860",
                description: "DataTypes.STRING",
                address: "DataTypes.STRING",
                dateCreated: new Date(),
                accountId: 5,
                positionId: 3,
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

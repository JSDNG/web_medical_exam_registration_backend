"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // await queryInterface.bulkInsert(
        //     "Account",
        //     [
        //         {
        //             email: "email@gmail.com",
        //             password: "123456",
        //         },
        //         {
        //             email: "email1@gmail.com",
        //             password: "123456",
        //         },
        //     ],
        //     {}
        // );
        await queryInterface.bulkInsert("Doctor", [
            {
                firstName: "Trần Đức",
                lastName: "Quỳnh",
                image: "abc",
                dateOfBirth: new Date("2002-01-17"),
                gender: "Nam",
                phone: "123456789",
                address: "Thủ Đức",
                dateCreated: new Date(),
                specialty: "Chỉnh hình",
                groupName: "Doctor",
                accountId: 1,
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

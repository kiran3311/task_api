'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add new CLOB column
    await queryInterface.addColumn('TASKS', 'REMARKFORINNERHTML_TEMP', {
      type: Sequelize.TEXT('long'), // 'long' is equivalent to CLOB
      allowNull: true,
    });

    // 2. Copy data from VARCHAR2 to CLOB
    await queryInterface.sequelize.query(`
      UPDATE TASKS 
      SET REMARKFORINNERHTML_TEMP = "REMARKFORINNERHTML"
    `);

    // 3. Drop old VARCHAR2 column
    await queryInterface.removeColumn('TASKS', 'REMARKFORINNERHTML');

    // 4. Rename the new CLOB column to match the original name
    await queryInterface.renameColumn('TASKS', 'REMARKFORINNERHTML_TEMP', 'REMARKFORINNERHTML');
  },

  async down(queryInterface, Sequelize) {
    // Down migration might involve similar steps, 
    // like creating a temporary VARCHAR2 column, copying data, dropping CLOB column, and renaming the VARCHAR2 column.
    // However, down migration can be more complex due to data loss risks.
    return;
  }

};

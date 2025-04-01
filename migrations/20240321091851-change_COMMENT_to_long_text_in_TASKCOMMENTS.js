'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add new CLOB column
    await queryInterface.addColumn('TASKCOMMENTS', 'COMMENT_TEMP', {
      type: Sequelize.TEXT('long'), // 'long' is equivalent to CLOB
      allowNull: true,
    });

    // 2. Copy data from VARCHAR2 to CLOB
    await queryInterface.sequelize.query(`
      UPDATE TASKCOMMENTS 
      SET COMMENT_TEMP = "COMMENT"
    `);

    // 3. Drop old VARCHAR2 column
    await queryInterface.removeColumn('TASKCOMMENTS', 'COMMENT');

    // 4. Rename the new CLOB column to match the original name
    await queryInterface.renameColumn('TASKCOMMENTS', 'COMMENT_TEMP', 'COMMENT');
  },

  async down(queryInterface, Sequelize) {
    // Down migration might involve similar steps, 
    // like creating a temporary VARCHAR2 column, copying data, dropping CLOB column, and renaming the VARCHAR2 column.
    // However, down migration can be more complex due to data loss risks.
    return;
  }

};

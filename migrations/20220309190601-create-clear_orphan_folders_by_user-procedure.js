module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(
      `
      CREATE OR REPLACE PROCEDURE clear_orphan_folders_by_user(userid int)
      LANGUAGE 'plpgsql'
      AS $$
      BEGIN
        delete from folders where parent_id is not null and parent_id not in (select id from folders where user_id = userid) and user_id = userid;
        select count(*) as total_left from folders where parent_id is not null and parent_id not in (select id from folders where user_id = userid) and user_id = userid;
      END;$$
      `,
    );
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'drop procedure xCloud.clear_orphan_folders_by_user;',
    );
  },
};

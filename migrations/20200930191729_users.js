
exports.up = async function(knex) {
  await knex.schema.createTable('users',tbl=>{
      tbl.increments();
      tbl.text('userName').notNull();
      tbl.text('passWord').notNull()
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('users')
};

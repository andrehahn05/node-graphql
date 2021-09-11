exports.up = function(knex, Promise) {
  return knex.schema.createTable('profiles', table => {
      table.increments('id').primary()
      table.string('name').notNull().unique()
      table.string('rotulo').notNull()
  }).then(function () {
      return knex('profiles').insert([
          { name: 'comum', rotulo: 'Comum' },
          { name: 'admin', rotulo: 'Administrador' }
      ])
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('profiles')
};

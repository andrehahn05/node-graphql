const db = require('../../database/db')
module.exports = {

    getProfile(parent, args, ctx) {
      ctx && ctx.validateAdmin()
      return db("profiles");
    },

    getFilterProfile(_, { filter },ctx) {
      ctx && ctx.validateAdmin()
      if (!filter) return null;
        const { id, name } = filter;
      if (id) 
        return db("profiles").where({ id }).first();
      if (name) 
        return db("profiles").where({ name }).first();
      else 
        return null;
    },
}
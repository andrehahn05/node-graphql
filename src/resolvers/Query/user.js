const db = require("../../database/db");
const bcrypt = require("bcryptjs");
const { getUserLogged } = require("../Auth/user");

module.exports = {
  async login(_, { data }) {
    const user = await db("users")
                .where({ email: data.email })
                .first();
    if(!user) throw new Error("invalid username/password"); 
    
    const isMacht = await bcrypt.compare(data.password,user.password);

    if(!isMacht) throw new Error("invalid username/password");
    
    return getUserLogged(user)
  },

  getUser(parent, args, ctx) {
    ctx && ctx.validateAdmin()
    return db("users");
  },

  getFilterUser(_, { filter },ctx) {
    ctx && ctx.validateUserFilter(filter)
    if (!filter) return null;
    const { id, email } = filter;

    if (id) 
      return db("users").where({ id }).first();
    if (email) 
      return db("users").where({ email }).first();
    else 
      return null;
  },
};



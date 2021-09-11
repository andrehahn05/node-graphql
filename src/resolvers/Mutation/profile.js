const db = require("../../database/db");
const { getFilterProfile: profile } = require("../Query/profile");

module.exports = {
  async addProfile(_, { data }, ctx) {
    ctx && ctx.validateAdmin();
    try {

      return await (await db("profiles").insert(data).returning("*"))[0];

    } catch (error) {
      throw new Error(error.sqlMessage);
    }
  },

  async updateProfile(_, { filter, data }, ctx) {
    ctx && ctx.validateAdmin();
    
    try {
      const { id } = filter;
      return await (await db("profiles").where({ id }).update(data).returning("*"))[0];

    } catch (error) {
      throw new Error(error.sqlMessage);
    }
    
  },

  async deleteProfile(_, { filter }, ctx) {
    ctx && ctx.validateAdmin();
    
    try {
    const { id } = filter;

    const delProlile = await profile(_, { filter });

    if (delProlile) await db("profiles").where({ id }).delete();

    return delProlile;
    
      
    } catch (error) {
      throw new Error(error.sqlMessage);
    }
  },
};

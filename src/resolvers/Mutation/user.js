const db = require("../../database/db");
const bcrypt = require("bcryptjs");
const { getFilterProfile: getProfile } = require("../Query/profile");
const { getFilterUser: getUser } = require("../Query/user");

const mutations = {
  async registerUser(_, { data }) {
    return mutations.storeUser(_, {
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  },

  async storeUser(_, { data }, ctx) {
    ctx && ctx.validateAdmin();
    try {
      const idsProfiles = [];

      if (!data.profiles || !data.profiles.length) {
        data.profiles = [
          {
            name: "comum",
          },
        ];
      }

      for (let filter of data.profiles) {
        const profile = await getProfile(_, {
          filter,
        });

        if (profile) idsProfiles.push(profile.id);
      }

      data.password = bcrypt.hashSync(data.password, 10);

      delete data.profiles;

      const [id] = await db("users").insert(data).returning("id");

      for (let profile_id of idsProfiles) {
        await db("users_profiles").insert({ profile_id, user_id: id });
      }

      return db("users").where({ id }).first();

    } catch (error) {
      throw new Error(e.sqlMessage);
    }
  },

  async updateUser(_, { filter, data }, ctx) {
    ctx && ctx.validateUserFilter(filter);
    try {
      const user = await getUser(_, { filter });

      if (user) {
        const { id } = user;

        if (ctx.admin && data.profiles) {
          await db("users_profiles").where({ user_id: id }).delete();

          for (let filter of data.profiles) {
            const profile = await getProfile(_, {
              filter,
            });

            if (profile) {
              await db("users_profiles").insert({
                profile_id: profile.id,
                user_id: id,
              });
            }
          }
        }

        if (data.password) data.password = bcrypt.hashSync(data.password, 10);

        delete data.profiles;
        await db("users").where({ id }).update(data);
      }

      return !user ? null : { ...user, ...data };
      
    } catch (error) {
      throw new Error(error);
    }
  },

  async deleteUser(_, args, ctx) {
    ctx && ctx.validateAdmin();
    try {
      const user = await getUser(_, args);

      if (user) {
        const { id } = user;
        await db("users_profiles").where({ user_id: id }).delete();
        await db("users").where({ id }).delete();
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = mutations;

const db = require("../database/db");
const { getUserLogged } = require("../resolvers/Auth/user");

const sql = `
    select
        u.*
    from
        users u,
        users_profiles up,
        profiles p
    where
        up.user_id = u.id and
        up.profile_id = p.id and
        u.active = true and
        p.name = :nameProfile
    limit 1
`;

const getUserL = async (nameProfile) => {
  const res = await db.raw(sql, { nameProfile });

  return res ? res.rows[0] : null;
};

module.exports = async (req) => {
  const user = await getUserL("admin");
  if (user) {
    
    const { token } = await getUserLogged(user);

    req.headers = {
      authorization: `Bearer ${token}`,
    };
  }
};

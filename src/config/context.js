const jwt = require("jsonwebtoken");
module.exports = async ({ req }) => {
  await require("./simulateUser")(req); //desenvolvimento

  const auth = req.headers.authorization;
  
  const token = auth && auth.substring(7);

  let user = null;
  let admin = false;

  if (token) {
    const authSecret = process.env.AUTH_SECRET;
    try {

      let decoded = jwt.verify(token, authSecret);
      user = decoded;

    } catch (error) {

      throw new Error("Token invalid");
    }
  }

  if (user && user.profiles) {
    admin = user.profiles.includes("admin");
  }

  const err = new Error("Access denied");
  
  return {
    user,
    admin,
    validateUser() {
      if (!user) throw err;
    },
    validateAdmin() {
      if (!admin) throw err;
    },
    validateUserFilter(filter) {
      if (admin) return;

      if (!user || !filter) throw err;

      const { id, email } = filter;
      if (!id && !email) throw err;
      if (id && id !== user.id) throw err;
      if (email && email !== user.email) throw err;
    },
  };
};

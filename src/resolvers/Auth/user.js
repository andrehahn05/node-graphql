// const db = require('../../database/db')
const jwt = require("jsonwebtoken");
const { profiles: getProfiles } = require("../../Type/User");

module.exports = {
  async getUserLogged(user) {
    const profiles = await getProfiles(user);

    const [name] = profiles.map((e) => e.name);

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      profiles: [name]
    };

    const authSecret = process.env.AUTH_SECRET;
    const token = jwt.sign(payload, authSecret, {
      expiresIn: process.env.EXPIRESIN,
      // expiresIn:8640
    });

    return { ...payload, token };
  },
};

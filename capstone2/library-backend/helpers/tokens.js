const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.role !== undefined,
      "createToken passed user without role property");

  let payload = {
    id: user.id,
    role: user.role || 'user',
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };

require("dotenv").config();

module.exports = {
  BACKEND_PORT: process.env.BACKEND_PORT,
  secret: "ssoKoder-secret-key"
};

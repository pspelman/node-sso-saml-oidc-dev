require("dotenv").config();

module.exports = {
  BACKEND_PORT: process.env.BACKEND_PORT || 8080,
  secret: "ssoda-secret-key"
};

require("dotenv").config();

module.exports = {
  IDENTITY_PROVIDER_PORT: process.env.IDENTITY_PROVIDER_PORT || 8080,
  secret: "ssoda-secret-key"
};

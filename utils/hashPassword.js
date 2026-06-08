const bcrypt = require('bcryptjs');

const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, 10);
};

module.exports = hashPassword;
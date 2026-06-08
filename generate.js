const bcrypt = require('bcryptjs');

const passwords = ['adam123', 'denis123', 'richard123', 'mbwana123'];

passwords.forEach(async (p) => {
  const hash = await bcrypt.hash(p, 10);
  console.log(`${p} → ${hash}`);
});
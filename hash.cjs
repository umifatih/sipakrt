// hash.cjs
const bcrypt = require('bcryptjs');

async function main() {
  const password = 'passwordmu'; // ganti dengan password yang kamu mau
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash    :', hash);
}

main();

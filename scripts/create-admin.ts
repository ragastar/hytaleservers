import bcrypt from 'bcryptjs';

const EMAIL = 'shuffle.org@bk.ru';
const PASSWORD = '06Apagih06-';

async function createAdmin() {
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  
  console.log('=== Создание админа ===\n');
  console.log('Email:', EMAIL);
  console.log('Password:', PASSWORD);
  console.log('Hashed Password:', hashedPassword);
  
  console.log('\n=== SQL для вставки ===');
  console.log(`
INSERT INTO admin_users (email, password_hash)
VALUES ('${EMAIL}', '${hashedPassword}')
ON CONFLICT (email) DO NOTHING;
  `);
}

createAdmin().catch(console.error);

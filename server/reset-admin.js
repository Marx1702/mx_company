const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function resetAdmin() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Delete existing admin and create new one
    await pool.query('DELETE FROM admins WHERE username = ?', ['admin']);
    await pool.query('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hashedPassword]);

    console.log('✅ Admin user created/reset successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdmin();

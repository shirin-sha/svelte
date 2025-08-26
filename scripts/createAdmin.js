const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    const email = process.argv[2];
    const password = process.argv[3];
    if (!email || !password) {
      console.error('❌ Usage: node scripts/createAdmin.js <email> <password>');
      process.exit(1);
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('❌ Admin user with this email already exists');
      process.exit(1);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log('🔑 You can now login at /admin/login');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin(); 
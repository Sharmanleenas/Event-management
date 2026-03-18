require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');

async function run() {
  const logFile = 'create_admin.log';
  const log = (msg) => {
    fs.appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`);
    console.log(msg);
  };
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log('Connected to DB...');
    
    // Check for both lowercase and exact case
    const email = 'admin@college.edu';
    let found = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    
    if (found) {
      log(`Found admin user (id: ${found._id}, role: ${found.role}), resetting password...`);
      const hashedPassword = await bcrypt.hash('admin123', 10);
      found.password = hashedPassword;
      found.role = 'ADMIN';
      found.email = email.toLowerCase(); // Standardize to lowercase
      await found.save();
      log(`Admin password reset to admin123 and email standardized to lowercase.`);
    } else {
      log('Admin user not found, creating...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'ADMIN',
        department: 'ALL'
      });
      log('Created admin user: admin@college.edu / admin123');
    }
  } catch (err) {
    log(`Error during admin creation: ${err.message}`);
  } finally {
    await mongoose.connection.close();
  }
}

run();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();
        const adminExists = await User.findOne({ email: 'admin@local.com' });
        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: 'admin@local.com',
                password: 'admin',
                role: 'Admin'
            });
            console.log('Seed Success: admin user created (admin@local.com / admin)');
        } else {
            console.log('Admin already exists: admin@local.com / admin');
        }
        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedAdmin();

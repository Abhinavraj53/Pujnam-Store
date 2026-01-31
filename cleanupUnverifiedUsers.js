const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const PendingRegistration = require('./models/PendingRegistration');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pujnam-store', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
    cleanupUnverifiedUsers();
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

async function cleanupUnverifiedUsers() {
    try {
        console.log('\n🔍 Searching for unverified users...\n');
        
        // Find all unverified users (excluding admins)
        const unverifiedUsers = await User.find({ 
            emailVerified: false,
            role: { $ne: 'admin' }
        });

        if (unverifiedUsers.length === 0) {
            console.log('✅ No unverified users found. Database is clean!');
            process.exit(0);
        }

        console.log(`⚠️  Found ${unverifiedUsers.length} unverified user(s):\n`);
        
        unverifiedUsers.forEach((user, index) => {
            console.log(`${index + 1}. Email: ${user.email}`);
            console.log(`   Name: ${user.name || 'N/A'}`);
            console.log(`   Created: ${user.createdAt}`);
            console.log('');
        });

        // Delete all unverified users
        const deleteResult = await User.deleteMany({ 
            emailVerified: false,
            role: { $ne: 'admin' }
        });

        console.log(`\n✅ Deleted ${deleteResult.deletedCount} unverified user(s)`);
        console.log('\n📝 Note: These users will need to register again and verify their email.');
        console.log('   Their accounts will only be created after OTP verification.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error cleaning up unverified users:', error);
        process.exit(1);
    }
}

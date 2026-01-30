const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pujnamstore_db_user:1LdZi3kdzQbuR70g@cluster0.l1hh67m.mongodb.net/pujnam_store?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Product names to mark as bestsellers (exactly 8 products)
const bestsellerProductNames = [
  'Gulab Jal 100 ml',
  'Shankh - Laxmi Shankh',
  'Bhimseni Kapur',
  'Ashtagandha Tika (Pack of 5)',
  'Rudraksha Mala',
  'A2 Pure Gir Cow Ghee',
  'Natural Forest Honey',
  'Laxmi Pooja Kit'
];

async function updateBestsellers() {
  try {
    console.log('🔄 Updating products to mark as bestsellers...');
    
    // First, set all products to not bestseller
    await Product.updateMany({}, { $set: { isBestseller: false } });
    console.log('✅ Reset all products to non-bestseller');
    
    // Mark specific products as bestsellers
    const result = await Product.updateMany(
      { name: { $in: bestsellerProductNames } },
      { $set: { isBestseller: true } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} products as bestsellers`);
    
    // Show which products are now bestsellers
    const bestsellers = await Product.find({ isBestseller: true }).select('name price');
    console.log('\n📦 Products marked as Best Sellers:');
    bestsellers.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ₹${product.price}`);
    });
    
    console.log('\n🎉 Best sellers updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating bestsellers:', error);
    process.exit(1);
  }
}

updateBestsellers();

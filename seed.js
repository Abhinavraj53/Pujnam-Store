const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Festival = require('./models/Festival');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pujnamstore_db_user:1LdZi3kdzQbuR70g@cluster0.l1hh67m.mongodb.net/pujnam_store?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Demo Categories - Matching the design
const categories = [
  // Circular preview categories (first 6)
  {
    name: 'PUJA KITS',
    slug: 'puja-kits',
    description: 'Complete puja kits for all occasions',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=400&auto=format&fit=crop',
    isActive: true
  },
  {
    name: 'PUJA JAL',
    slug: 'puja-jal',
    description: 'Sacred water for rituals and purification',
    image: 'https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?q=80&w=400&auto=format&fit=crop',
    isActive: true
  },
  {
    name: 'ASHTAGANDHA',
    slug: 'ashtagandha',
    description: 'Sacred eight-ingredient tilak and fragrances',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=400&auto=format&fit=crop',
    isActive: true
  },
  {
    name: 'YANTRIK',
    slug: 'yantrik',
    description: 'Sacred yantras and spiritual symbols',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=400&auto=format&fit=crop',
    isActive: true
  },
  {
    name: 'SHANKH',
    slug: 'shankh',
    description: 'Sacred conch shells for puja rituals',
    image: 'https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?q=80&w=400&auto=format&fit=crop',
    isActive: true
  },
  {
    name: 'ITRA',
    slug: 'itra',
    description: 'Traditional Indian perfumes and fragrances',
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=400&auto=format&fit=crop',
    isActive: true
  },
  // Arched display categories (main 4)
  {
    name: 'AACHMAN',
    slug: 'aachman',
    description: 'Sacred water and ritual items for purification',
    image: 'https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?q=80&w=400&auto=format&fit=crop',
    isActive: true
  },
  {
    name: 'DHOOPAM',
    slug: 'dhoopam',
    description: 'Incense, dhoop cones, and aromatic offerings',
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=400&auto=format&fit=crop',
    isActive: true
  },
  {
    name: 'SHRINGAR',
    slug: 'shringar',
    description: 'Sacred adornments, tilak, and divine fragrances',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=400&auto=format&fit=crop',
    isActive: true
  },
  {
    name: 'PRASAD',
    slug: 'prasad',
    description: 'Pure ghee, honey, saffron, and blessed offerings',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=400&auto=format&fit=crop',
    isActive: true
  }
];

// Demo Products - will be assigned categories after creation
const productData = [
  // AACHMAN Products
  {
    name: 'Gulab Jal 100 ml',
    description: 'Pure rose water for puja rituals and aachman. Made from fresh rose petals, this sacred water brings purity and divine fragrance to your prayers.',
    price: 269,
    originalPrice: 299,
    images: [
      'https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 50,
    featured: true,
    isActive: true,
    specifications: { weight: '100ml', fragrance: 'Rose', deity: 'All Deities' }
  },
  {
    name: 'Chandan Jal 100 ml',
    description: 'Sacred sandalwood water for purification and blessings. Pure and natural chandan jal for daily puja rituals.',
    price: 224,
    originalPrice: 249,
    images: [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 75,
    featured: false,
    isActive: true,
    specifications: { weight: '100ml', fragrance: 'Sandalwood', deity: 'Shiva, Vishnu' }
  },
  {
    name: 'Shankh - Laxmi Shankh',
    description: 'Beautiful and auspicious Laxmi Shankh for puja rituals. This sacred conch shell brings prosperity and divine blessings.',
    price: 899,
    originalPrice: 1199,
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 25,
    featured: true,
    isActive: true,
    specifications: { weight: 'Medium', deity: 'Laxmi', material: 'Natural Conch' }
  },

  // DHOOPAM Products
  {
    name: 'Bhimseni Kapur',
    description: 'Pure camphor for aarti and havan. High-quality bhimseni kapur that burns smoothly with divine fragrance.',
    price: 229,
    originalPrice: 299,
    images: [
      'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 100,
    featured: true,
    isActive: true,
    specifications: { weight: '50g', type: 'Natural Camphor', deity: 'All Deities' }
  },
  {
    name: 'Natural Dhoop Cones 50 pcs',
    description: 'Bambooless incense cones with natural fragrances. Perfect for daily puja and meditation.',
    price: 199,
    originalPrice: 249,
    images: [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 80,
    featured: false,
    isActive: true,
    specifications: { quantity: '50 pcs', fragrance: 'Natural', deity: 'All Deities' }
  },
  {
    name: 'Zodiac Dhoop Cones - Libra 50 pcs',
    description: 'Special zodiac-based dhoop cones for Libra. Vanilla scented natural incense cones.',
    price: 149,
    originalPrice: 199,
    images: [
      'https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 60,
    featured: false,
    isActive: true,
    specifications: { quantity: '50 pcs', fragrance: 'Vanilla', zodiac: 'Libra' }
  },

  // SHRINGAR Products
  {
    name: 'Ashtagandha Tika (Pack of 5)',
    description: 'Sacred tilak powder made from eight natural ingredients. Perfect for daily worship and special occasions.',
    price: 404,
    originalPrice: 449,
    images: [
      'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 45,
    featured: true,
    isActive: true,
    specifications: { quantity: '5 packs', deity: 'All Deities', type: 'Tilak Powder' }
  },
  {
    name: 'Pujashree Ashtagandha Maa Shakti',
    description: 'Sacred fragrance of strength, grace & divine protection. Made with pure natural ingredients.',
    price: 178,
    originalPrice: 198,
    images: [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 70,
    featured: false,
    isActive: true,
    specifications: { weight: '25g', deity: 'Maa Shakti', fragrance: 'Ashtagandha' }
  },
  {
    name: 'Rudraksha Mala',
    description: 'Authentic Rudraksha beads mala for meditation and prayers. Natural and blessed.',
    price: 1299,
    originalPrice: 1599,
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 30,
    featured: true,
    isActive: true,
    specifications: { beads: '108', deity: 'Shiva', material: 'Natural Rudraksha' }
  },

  // PRASAD Products
  {
    name: 'A2 Pure Gir Cow Ghee',
    description: 'Sacred Desi Ghee for Divine Rituals, Health & Holistic Wellbeing. Pure A2 ghee from Gir cows.',
    price: 399,
    originalPrice: 499,
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 40,
    featured: true,
    isActive: true,
    specifications: { weight: '500g', type: 'A2 Ghee', deity: 'All Deities' }
  },
  {
    name: 'Natural Forest Honey',
    description: 'Pure Honey for Sacred Offerings, Immunity & Healthy Living. 100% natural and unprocessed.',
    price: 224,
    originalPrice: 249,
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 55,
    featured: true,
    isActive: true,
    specifications: { weight: '500g', type: 'Forest Honey', purity: '100% Natural' }
  },
  {
    name: 'Persian Saffron - 1 Gm',
    description: 'Premium quality Persian saffron for puja and culinary use. Authentic and pure.',
    price: 539,
    originalPrice: 599,
    images: [
      'https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 20,
    featured: false,
    isActive: true,
    specifications: { weight: '1g', origin: 'Persia', grade: 'Premium' }
  },

  // Puja Special Products
  {
    name: 'Laxmi Pooja Kit',
    description: 'Complete puja kit for Laxmi Puja. Includes all essential items for invoking prosperity, purity & divine grace.',
    price: 3149,
    originalPrice: 3499,
    images: [
      'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 15,
    featured: true,
    isActive: true,
    specifications: { items: 'Complete Kit', deity: 'Laxmi', occasion: 'Laxmi Puja' }
  },
  {
    name: 'Hanumanji Pooja Kit',
    description: 'Complete puja kit for Hanumanji. Invoke strength, protection & spiritual power with this blessed kit.',
    price: 224,
    originalPrice: 249,
    images: [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 35,
    featured: true,
    isActive: true,
    specifications: { items: 'Complete Kit', deity: 'Hanuman', occasion: 'Hanuman Puja' }
  },
  {
    name: 'Shanidev Ji Puja Kit',
    description: 'Complete puja kit for Shanidev. All essential items for Shani puja rituals.',
    price: 269,
    originalPrice: 299,
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 28,
    featured: false,
    isActive: true,
    specifications: { items: 'Complete Kit', deity: 'Shani', occasion: 'Shani Puja' }
  },
  // Additional PUJA JAL Products
  {
    name: 'Tulsi Jal 100 ml',
    description: 'Sacred Tulsi water for purification and spiritual cleansing. Made from fresh Tulsi leaves.',
    price: 199,
    originalPrice: 249,
    images: ['https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?q=80&w=600&auto=format&fit=crop'],
    stock: 60,
    featured: false,
    isActive: true,
    specifications: { weight: '100ml', fragrance: 'Tulsi', deity: 'Vishnu' }
  },
  {
    name: 'Ganga Jal 250 ml',
    description: 'Sacred Ganga water collected from holy Ganges. Pure and blessed water for all rituals.',
    price: 349,
    originalPrice: 399,
    images: ['https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?q=80&w=600&auto=format&fit=crop'],
    stock: 40,
    featured: true,
    isActive: true,
    specifications: { weight: '250ml', source: 'Ganges', deity: 'All Deities' }
  },
  // Additional SHANKH Products
  {
    name: 'Vishnu Shankh',
    description: 'Sacred Vishnu Shankh for daily puja. Brings peace, prosperity and divine protection.',
    price: 1299,
    originalPrice: 1599,
    images: ['https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'],
    stock: 20,
    featured: true,
    isActive: true,
    specifications: { weight: 'Large', deity: 'Vishnu', material: 'Natural Conch' }
  },
  {
    name: 'Shankh Set of 2',
    description: 'Beautiful pair of conch shells for puja rituals. Perfect for home temple.',
    price: 599,
    originalPrice: 799,
    images: ['https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?q=80&w=600&auto=format&fit=crop'],
    stock: 35,
    featured: false,
    isActive: true,
    specifications: { quantity: '2 pcs', deity: 'All Deities', material: 'Natural Conch' }
  },
  // Additional DHOOPAM Products
  {
    name: 'Sandalwood Dhoop Sticks 50 pcs',
    description: 'Premium sandalwood dhoop sticks. Long-lasting fragrance for daily puja.',
    price: 249,
    originalPrice: 299,
    images: ['https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=600&auto=format&fit=crop'],
    stock: 90,
    featured: true,
    isActive: true,
    specifications: { quantity: '50 pcs', fragrance: 'Sandalwood', deity: 'All Deities' }
  },
  {
    name: 'Rose Dhoop Cones 40 pcs',
    description: 'Fragrant rose-scented dhoop cones. Natural and chemical-free.',
    price: 179,
    originalPrice: 229,
    images: ['https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=600&auto=format&fit=crop'],
    stock: 70,
    featured: false,
    isActive: true,
    specifications: { quantity: '40 pcs', fragrance: 'Rose', deity: 'All Deities' }
  },
  {
    name: 'Havan Samagri 500g',
    description: 'Complete havan samagri mix for fire rituals. Pure and traditional ingredients.',
    price: 299,
    originalPrice: 349,
    images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop'],
    stock: 50,
    featured: true,
    isActive: true,
    specifications: { weight: '500g', type: 'Havan Mix', deity: 'All Deities' }
  },
  // Additional ASHTAGANDHA Products
  {
    name: 'Ashtagandha Tilak Powder 100g',
    description: 'Premium quality Ashtagandha tilak powder. Made from eight sacred ingredients.',
    price: 449,
    originalPrice: 499,
    images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop'],
    stock: 55,
    featured: true,
    isActive: true,
    specifications: { weight: '100g', type: 'Tilak Powder', deity: 'All Deities' }
  },
  {
    name: 'Kumkum Powder 50g',
    description: 'Pure kumkum powder for tilak. Traditional red powder for worship.',
    price: 149,
    originalPrice: 199,
    images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop'],
    stock: 100,
    featured: false,
    isActive: true,
    specifications: { weight: '50g', type: 'Kumkum', deity: 'All Deities' }
  },
  // Additional SHRINGAR Products
  {
    name: 'Chandan Tilak Paste 25g',
    description: 'Pure sandalwood tilak paste. Cool and fragrant for daily worship.',
    price: 199,
    originalPrice: 249,
    images: ['https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=600&auto=format&fit=crop'],
    stock: 80,
    featured: true,
    isActive: true,
    specifications: { weight: '25g', type: 'Chandan Paste', deity: 'Vishnu, Shiva' }
  },
  {
    name: 'Sindoor 25g',
    description: 'Traditional sindoor for married women. Pure and safe for daily use.',
    price: 129,
    originalPrice: 179,
    images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop'],
    stock: 120,
    featured: false,
    isActive: true,
    specifications: { weight: '25g', type: 'Sindoor', deity: 'Laxmi, Parvati' }
  },
  {
    name: 'Mala Set - 3 Pcs',
    description: 'Set of three beautiful malas - Rudraksha, Tulsi, and Sandalwood.',
    price: 899,
    originalPrice: 1199,
    images: ['https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'],
    stock: 25,
    featured: true,
    isActive: true,
    specifications: { quantity: '3 pcs', type: 'Mala Set', deity: 'All Deities' }
  },
  // Additional PRASAD Products
  {
    name: 'Organic Jaggery 500g',
    description: 'Pure organic jaggery for prasad. Unrefined and natural sweetness.',
    price: 149,
    originalPrice: 199,
    images: ['https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'],
    stock: 65,
    featured: false,
    isActive: true,
    specifications: { weight: '500g', type: 'Jaggery', purity: 'Organic' }
  },
  {
    name: 'Dry Fruits Mix 250g',
    description: 'Premium dry fruits mix for prasad. Almonds, cashews, raisins and more.',
    price: 449,
    originalPrice: 549,
    images: ['https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'],
    stock: 45,
    featured: true,
    isActive: true,
    specifications: { weight: '250g', type: 'Dry Fruits', deity: 'All Deities' }
  },
  {
    name: 'Coconut - Premium 2 Pcs',
    description: 'Fresh premium coconuts for puja rituals. Sacred offering for all deities.',
    price: 99,
    originalPrice: 129,
    images: ['https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'],
    stock: 200,
    featured: false,
    isActive: true,
    specifications: { quantity: '2 pcs', type: 'Coconut', deity: 'All Deities' }
  },
  // Additional PUJA KITS Products
  {
    name: 'Ganesh Pooja Kit',
    description: 'Complete puja kit for Ganesh Chaturthi. All items needed for Ganesh puja.',
    price: 899,
    originalPrice: 1099,
    images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop'],
    stock: 30,
    featured: true,
    isActive: true,
    specifications: { items: 'Complete Kit', deity: 'Ganesh', occasion: 'Ganesh Chaturthi' }
  },
  {
    name: 'Diwali Pooja Kit',
    description: 'Special Diwali puja kit with all essentials. Celebrate the festival of lights.',
    price: 1249,
    originalPrice: 1499,
    images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop'],
    stock: 20,
    featured: true,
    isActive: true,
    specifications: { items: 'Complete Kit', deity: 'Laxmi', occasion: 'Diwali' }
  },
  {
    name: 'Navratri Pooja Kit',
    description: 'Complete Navratri puja kit. All items for nine days of worship.',
    price: 1799,
    originalPrice: 2199,
    images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=600&auto=format&fit=crop'],
    stock: 18,
    featured: true,
    isActive: true,
    specifications: { items: 'Complete Kit', deity: 'Durga', occasion: 'Navratri' }
  },
  // Additional YANTRIK Products
  {
    name: 'Shri Yantra - Copper',
    description: 'Sacred Shri Yantra in pure copper. Brings prosperity and abundance.',
    price: 2499,
    originalPrice: 2999,
    images: ['https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'],
    stock: 15,
    featured: true,
    isActive: true,
    specifications: { material: 'Copper', deity: 'Laxmi', size: 'Medium' }
  },
  {
    name: 'Shiv Yantra - Brass',
    description: 'Powerful Shiv Yantra in brass. For meditation and spiritual growth.',
    price: 1899,
    originalPrice: 2299,
    images: ['https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=600&auto=format&fit=crop'],
    stock: 22,
    featured: true,
    isActive: true,
    specifications: { material: 'Brass', deity: 'Shiva', size: 'Medium' }
  },
  // Additional ITRA Products
  {
    name: 'Rose Itra 10ml',
    description: 'Traditional rose itra perfume. Long-lasting fragrance for special occasions.',
    price: 299,
    originalPrice: 399,
    images: ['https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=600&auto=format&fit=crop'],
    stock: 40,
    featured: true,
    isActive: true,
    specifications: { weight: '10ml', fragrance: 'Rose', type: 'Itra' }
  },
  {
    name: 'Mogra Itra 10ml',
    description: 'Fragrant mogra (jasmine) itra. Traditional Indian perfume oil.',
    price: 349,
    originalPrice: 449,
    images: ['https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=600&auto=format&fit=crop'],
    stock: 35,
    featured: false,
    isActive: true,
    specifications: { weight: '10ml', fragrance: 'Mogra', type: 'Itra' }
  },
  {
    name: 'Sandalwood Itra 10ml',
    description: 'Pure sandalwood itra. Sacred fragrance for puja and daily use.',
    price: 399,
    originalPrice: 499,
    images: ['https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=600&auto=format&fit=crop'],
    stock: 30,
    featured: true,
    isActive: true,
    specifications: { weight: '10ml', fragrance: 'Sandalwood', type: 'Itra' }
  }
];

// Category mapping for products
const categoryMapping = {
  'Gulab Jal 100 ml': 'PUJA JAL',
  'Chandan Jal 100 ml': 'PUJA JAL',
  'Tulsi Jal 100 ml': 'PUJA JAL',
  'Ganga Jal 250 ml': 'PUJA JAL',
  'Shankh - Laxmi Shankh': 'SHANKH',
  'Vishnu Shankh': 'SHANKH',
  'Shankh Set of 2': 'SHANKH',
  'Bhimseni Kapur': 'DHOOPAM',
  'Natural Dhoop Cones 50 pcs': 'DHOOPAM',
  'Zodiac Dhoop Cones - Libra 50 pcs': 'DHOOPAM',
  'Sandalwood Dhoop Sticks 50 pcs': 'DHOOPAM',
  'Rose Dhoop Cones 40 pcs': 'DHOOPAM',
  'Havan Samagri 500g': 'DHOOPAM',
  'Ashtagandha Tika (Pack of 5)': 'ASHTAGANDHA',
  'Pujashree Ashtagandha Maa Shakti': 'ASHTAGANDHA',
  'Ashtagandha Tilak Powder 100g': 'ASHTAGANDHA',
  'Kumkum Powder 50g': 'ASHTAGANDHA',
  'Rudraksha Mala': 'SHRINGAR',
  'Chandan Tilak Paste 25g': 'SHRINGAR',
  'Sindoor 25g': 'SHRINGAR',
  'Mala Set - 3 Pcs': 'SHRINGAR',
  'A2 Pure Gir Cow Ghee': 'PRASAD',
  'Natural Forest Honey': 'PRASAD',
  'Persian Saffron - 1 Gm': 'PRASAD',
  'Organic Jaggery 500g': 'PRASAD',
  'Dry Fruits Mix 250g': 'PRASAD',
  'Coconut - Premium 2 Pcs': 'PRASAD',
  'Laxmi Pooja Kit': 'PUJA KITS',
  'Hanumanji Pooja Kit': 'PUJA KITS',
  'Shanidev Ji Puja Kit': 'PUJA KITS',
  'Ganesh Pooja Kit': 'PUJA KITS',
  'Diwali Pooja Kit': 'PUJA KITS',
  'Navratri Pooja Kit': 'PUJA KITS',
  'Shri Yantra - Copper': 'YANTRIK',
  'Shiv Yantra - Brass': 'YANTRIK',
  'Rose Itra 10ml': 'ITRA',
  'Mogra Itra 10ml': 'ITRA',
  'Sandalwood Itra 10ml': 'ITRA'
};

// Seed function
async function seedDatabase() {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create categories
    console.log('📁 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create category map for product assignment
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // List of products to mark as bestsellers (8 products)
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

    // Prepare products with categories and convert specifications
    const productsToInsert = productData.map(product => {
      const categoryName = categoryMapping[product.name];
      const productObj = {
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        category: categoryName && categoryMap[categoryName] ? categoryMap[categoryName] : createdCategories[0]._id,
        images: product.images,
        stock: product.stock,
        featured: product.featured,
        isBestseller: bestsellerProductNames.includes(product.name),
        isActive: product.isActive,
      };
      
      // Convert specifications object to Map
      if (product.specifications) {
        const specsMap = new Map();
        Object.entries(product.specifications).forEach(([key, value]) => {
          specsMap.set(key, String(value));
        });
        productObj.specifications = specsMap;
      }
      
      return productObj;
    });

    // Create products
    console.log('📦 Creating products...');
    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create festivals
    console.log('🎉 Creating festivals...');
    await Festival.deleteMany({});
    
    // Get some products for festivals
    const pujaKitProducts = createdProducts.filter(p => 
      p.name.toLowerCase().includes('puja') || 
      p.name.toLowerCase().includes('kit') ||
      p.name.toLowerCase().includes('combo')
    ).slice(0, 5).map(p => p._id);
    
    const incenseProducts = createdProducts.filter(p => 
      p.name.toLowerCase().includes('dhoop') || 
      p.name.toLowerCase().includes('incense') ||
      p.name.toLowerCase().includes('agarbatti')
    ).slice(0, 5).map(p => p._id);

    const festivals = [
      {
        name: 'Maha Shivratri',
        slug: 'maha-shivratri',
        description: 'Complete puja kits and sacred items for Maha Shivratri celebration',
        image: 'https://images.pexels.com/photos/11375757/pexels-photo-11375757.jpeg',
        products: pujaKitProducts.length > 0 ? pujaKitProducts : createdProducts.slice(0, 5).map(p => p._id),
        startDate: new Date('2026-02-26'),
        endDate: new Date('2026-02-27'),
        isActive: true,
        displayOrder: 1
      },
      {
        name: 'Saraswati Pooja',
        slug: 'saraswati-pooja',
        description: 'Blessing for knowledge and wisdom - Complete Saraswati Pooja essentials',
        image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg',
        products: incenseProducts.length > 0 ? incenseProducts : createdProducts.slice(5, 10).map(p => p._id),
        startDate: new Date('2026-01-26'),
        endDate: new Date('2026-01-27'),
        isActive: true,
        displayOrder: 2
      }
    ];

    const createdFestivals = await Festival.insertMany(festivals);
    console.log(`✅ Created ${createdFestivals.length} festivals`);

    // Create admin user (optional) - with email verified and no verification required
    const adminExists = await User.findOne({ email: 'admin@pujnamstore.com' });
    if (!adminExists) {
      const adminUser = new User({
        email: 'admin@pujnamstore.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        emailVerified: true, // Admin doesn't need email verification
        phone: '9999999999'
      });
      await adminUser.save();
      console.log('✅ Created admin user');
      console.log('   Email: admin@pujnamstore.com');
      console.log('   Password: admin123');
      console.log('   ⚠️  Admin account does NOT require email verification');
    } else {
      // Update existing admin to be verified
      await User.updateOne(
        { email: 'admin@pujnamstore.com' },
        { 
          emailVerified: true,
          emailVerificationCode: null,
          emailVerificationCodeExpiry: null
        }
      );
      console.log('ℹ️  Admin user already exists - updated to verified status');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log('\n🌐 You can now view the data in:');
    console.log('   - Admin Panel: http://localhost:5173 (click admin button)');
    console.log('   - Website: http://localhost:5173');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();

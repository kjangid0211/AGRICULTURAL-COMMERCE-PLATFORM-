const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');
const Order = require('../models/Order');
const CMS = require('../models/CMS');
const Settings = require('../models/Settings');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agri-commerce';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Enquiry.deleteMany();
    await Order.deleteMany();
    await CMS.deleteMany();
    await Settings.deleteMany();
    console.log('Cleared existing database collections.');

    // 1. Seed Admin User
    const adminUser = await User.create({
      name: 'Agri Admin',
      email: 'admin@agri.com',
      password: 'admin123', // Will be hashed automatically by user model pre-save hook
      role: 'admin',
    });
    console.log('Admin user seeded: admin@agri.com / admin123');

    // 2. Seed Categories
    const categoriesData = [
      {
        name: 'High-Yield Seeds',
        slug: 'seeds',
        image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300',
        status: 'active',
        displayOrder: 1,
      },
      {
        name: 'Grains & Pulses',
        slug: 'grains-pulses',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=300',
        status: 'active',
        displayOrder: 2,
      },
      {
        name: 'Organic Fertilizers',
        slug: 'fertilizers',
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=300',
        status: 'active',
        displayOrder: 3,
      },
      {
        name: 'Farming Tools',
        slug: 'tools',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=300',
        status: 'active',
        displayOrder: 4,
      },
    ];

    const seededCategories = await Category.insertMany(categoriesData);
    console.log('4 categories seeded.');

    // Helper map
    const catMap = {};
    seededCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    // 3. Seed Products (10 items)
    const productsData = [
      {
        name: 'Premium Hybrid Wheat Seeds',
        category: catMap['seeds'],
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400',
        price: 120,
        description: 'Premium quality high-yield hybrid wheat seeds. Recommended for sub-tropical climates. Disease resistant, offering up to 25% higher yield compared to local cultivars when grown with standard irrigation.',
        shortDescription: 'Certified high-yield hybrid wheat seeds, ideal for commercial growers.',
        specifications: [
          { label: 'Germination Rate', value: '95%' },
          { label: 'Purity Level', value: '99%' },
          { label: 'Bag Size', value: '25 Kg' },
          { label: 'Maturation Period', value: '110-120 days' }
        ],
        stock: 500,
        status: 'active',
        b2bVisibility: true,
        b2cVisibility: true,
        minOrderQty: 10,
      },
      {
        name: 'Organic Heritage Tomato Seeds',
        category: catMap['seeds'],
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400',
        price: 45,
        description: 'Non-GMO organic cherry tomato seeds. Perfect for retail potting and kitchen gardening. Yields juicy, sweet, dark-red round cherry tomatoes rich in nutrients.',
        shortDescription: 'Sweet and juicy organic tomato seeds for home or polyhouse gardens.',
        specifications: [
          { label: 'Germination Rate', value: '92%' },
          { label: 'Purity Level', value: '98%' },
          { label: 'Packet Weight', value: '10 grams (Approx. 250 seeds)' },
          { label: 'Farming Type', value: '100% Organic' }
        ],
        stock: 1200,
        status: 'active',
        b2bVisibility: true,
        b2cVisibility: true,
        minOrderQty: 5,
      },
      {
        name: 'Super Golden Sweet Corn Seeds',
        category: catMap['seeds'],
        image: 'https://images.unsplash.com/photo-1551754625-702377370d6a?auto=format&fit=crop&q=80&w=400',
        price: 80,
        description: 'Sweet corn F1 hybrid seeds. Highly resistant to leaf blight. Produces large, full cobs with sweet golden kernels that retain tenderness for days after harvest.',
        shortDescription: 'High maturation hybrid sweet corn seeds, sweet and tender yield.',
        specifications: [
          { label: 'Bag Size', value: '1 Kg' },
          { label: 'Seed Type', value: 'F1 Hybrid' },
          { label: 'Water Requirement', value: 'Moderate' }
        ],
        stock: 350,
        status: 'active',
        b2bVisibility: true,
        b2cVisibility: true,
        minOrderQty: 5,
      },
      {
        name: 'Premium Basmati Rice Grains',
        category: catMap['grains-pulses'],
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
        price: 150,
        description: 'Long-grain aged aromatic Basmati rice. Sourced from the Himalayan foothills. Aged for 12 months for non-sticky elongation and supreme aroma.',
        shortDescription: 'Aromatic aged long-grain basmati rice for everyday or wholesale export.',
        specifications: [
          { label: 'Grain Length', value: '8.2 mm' },
          { label: 'Aged Period', value: '12 Months' },
          { label: 'Moisture Content', value: 'Less than 12%' }
        ],
        stock: 2000,
        status: 'active',
        b2bVisibility: true,
        b2cVisibility: true,
        minOrderQty: 50,
      },
      {
        name: 'Organic Chickpeas (Kabuli Chana)',
        category: catMap['grains-pulses'],
        image: 'https://images.unsplash.com/photo-1547058886-af77993d452a?auto=format&fit=crop&q=80&w=400',
        price: 110,
        description: 'Premium bold grade chickpeas. Completely pesticide-free. Exceptionally high in protein, uniform round shape and creamy beige tone.',
        shortDescription: 'Pesticide-free organic chickpeas rich in fibers and proteins.',
        specifications: [
          { label: 'Grade', value: 'Bold / 12mm' },
          { label: 'Moisture', value: '9% Max' },
          { label: 'Organic Certified', value: 'Yes' }
        ],
        stock: 1500,
        status: 'active',
        b2bVisibility: true,
        b2cVisibility: true,
        minOrderQty: 40,
      },
      {
        name: 'De-oiled Mustard Meal Powder',
        category: catMap['grains-pulses'],
        image: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&q=80&w=400',
        price: 75,
        description: 'Rich in organic nitrogen and secondary nutrients. Safe to feed poultry or apply directly to soil beds to discourage nematodes.',
        shortDescription: 'Nutrient-rich mustard meal cake powder for feed or composting.',
        specifications: [
          { label: 'Protein Content', value: '36%' },
          { label: 'Fat Content', value: '1.5% Max' },
          { label: 'Packaging', value: '50 Kg HDPE Bags' }
        ],
        stock: 800,
        status: 'active',
        b2bVisibility: true,
        b2cVisibility: false, // B2B Only!
        minOrderQty: 20,
      },
      {
        name: 'Natural Organic Vermicompost Manure',
        category: catMap['fertilizers'],
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400',
        price: 240,
        description: 'Earthworm composted bio-organic fertilizer. Enhances soil aeration, water-holding capacity, and introduces beneficial microbial activity to boost plants.',
        shortDescription: '100% organic earthworm vermicompost for crop health.',
        specifications: [
          { label: 'Organic Carbon', value: '18%' },
          { label: 'Moisture Range', value: '15-25%' },
          { label: 'Pack Weight', value: '10 Kg' }
        ],
        stock: 900,
        status: 'active',
        b2bVisibility: true,
        b2cVisibility: true,
        minOrderQty: 5,
      },
      {
        name: 'Organic Cold-Pressed Neem Oil Spray',
        category: catMap['fertilizers'],
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=400',
        price: 180,
        description: 'Pure cold-pressed neem oil concentrate. Serves as an excellent organic pest repellent, fungicide, and leaf shine. Simply dilute in water with liquid soap.',
        shortDescription: 'All-natural organic neem oil for crop and foliage protection.',
        specifications: [
          { label: 'Concentration', value: '1500 PPM Azadirachtin' },
          { label: 'Extraction', value: 'Cold-Pressed' },
          { label: 'Bottle Size', value: '500 mL' }
        ],
        stock: 600,
        status: 'active',
        b2bVisibility: true,
        b2cVisibility: true,
        minOrderQty: 5,
      },
      {
        name: 'Heavy Duty Steel Hand Trowel',
        category: catMap['tools'],
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400',
        price: 320,
        description: 'Rust-resistant carbon steel garden trowel. Features an ergonomic contoured ash wood handle for comfortable grip during weeding and planting.',
        shortDescription: 'Resilient steel garden trowel with ergonomic wood handle.',
        specifications: [
          { label: 'Blade Material', value: 'Carbon Steel' },
          { label: 'Handle Material', value: 'Ash Wood' },
          { label: 'Overall Length', value: '12 inches' }
        ],
        stock: 150,
        status: 'active',
        b2bVisibility: true,
        b2cVisibility: true,
        minOrderQty: 2,
      },
      {
        name: 'Professional Bypass Pruning Shears',
        category: catMap['tools'],
        image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&q=80&w=400',
        price: 590,
        description: 'Hardened steel blades for neat tree branch pruning. Includes spring mechanism and security locking latch. Cut clean stems up to 20mm thick.',
        shortDescription: 'Sharpened spring-loaded branch and flower pruning shears.',
        specifications: [
          { label: 'Blade Coating', value: 'Anti-Rust Teflon' },
          { label: 'Cutting Capacity', value: '20 mm diameter' },
          { label: 'Locking Latch', value: 'Yes' }
        ],
        stock: 120,
        status: 'active',
        b2bVisibility: true,
        b2cVisibility: true,
        minOrderQty: 2,
      }
    ];

    const seededProducts = await Product.insertMany(productsData);
    console.log('10 products seeded.');

    // Helper map
    const prodMap = {};
    seededProducts.forEach((p) => {
      prodMap[p.name] = p._id;
    });

    // 4. Seed CMS Pages
    const cmsData = [
      {
        key: 'homepage',
        title: 'Dynamic Homepage Content',
        content: {
          heroTitle: 'Agricultural Commerce Sourced for Prosperity',
          heroSubtitle: 'Connecting local growers with wholesale buyers and retail gardeners. Order high-purity seeds, organic manure, and ergonomic field tools today.',
          heroBgImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
          whyChooseUs: [
            { title: 'Farmer First Pricing', desc: 'Direct trade from growers limits intermediary fees, keeping costs economical for both homeowners and co-ops.' },
            { title: 'Eco-Friendly Focus', desc: 'We prioritize bio-fertilizers and heirloom organic seeds that support biological diversity.' },
            { title: 'Secure Bulk Logistics', desc: 'All cargo is safely palletized and insured, ensuring on-schedule arrivals for wholesale buyers.' }
          ],
          featuredHeading: 'Featured Categories',
          promoBanner: {
            title: 'Procuring for Cooperative Farms?',
            description: 'Change store visibility to Wholesale Mode in the top header menu to request special bulk pricing or custom packaging options.',
            ctaText: 'View Wholesale Store'
          }
        }
      },
      {
        key: 'about_us',
        title: 'About Our Mission',
        content: `# Growing Together Since 2021

AgriCommerce is an integrated farming portal bringing modern agricultural logistics straight to your doorstep. We are dedicated to providing:

- **Premium Hybrid Seeds**: Tested and certified for high germination rates.
- **Pesticide-Free Grains**: Premium quality for retail consumption or raw milling.
- **Microbial Soil Amendments**: Earth-friendly options like Vermicompost.
- **Ergonomic Harvesting Tools**: Durable steel tools built to last.

Our hybrid storefront shifts between B2B and B2C seamlessly. Retail gardeners can fill cards and check out immediately, while wholesale companies and commercial farms can issue request sheets to obtain custom freight configurations.`
      },
      {
        key: 'privacy_policy',
        title: 'Privacy & Data Terms',
        content: `# Privacy Policy

Your trust is essential to us. Here is how we manage customer and business data:

1. **Information Collection**: We capture name, billing address, telephone number, and payment information during consumer purchases.
2. **Wholesale Verification**: Business enquiries request corporate titles, commercial licensing codes, and estimated order frequencies.
3. **Usage Guidelines**: User details are used for shipment validation, invoice printouts, and answering trade quote emails.
4. **Data Protection**: Database tables are stored securely, and credit details are never logged in plain text.`
      },
      {
        key: 'shipping_policy',
        title: 'Shipping & Terms',
        content: `# Shipping Policy

We ship agricultural supplies across regional and national borders under structured freight guidelines:

### B2C Retail Shipments
- **Processing Time**: Retail items are packed and shipped within 24 hours of payment.
- **Transit Duration**: Standard home shipping takes 3-5 business days.
- **Courier Tracking**: Tracking links are issued immediately via invoice emails.

### B2B Wholesale Cargo
- **Custom Logistics**: Freight is shipped via container or heavy trucks depending on order weight.
- **Quotation Terms**: Transit costs, custom duty clearance, and loading times are estimated dynamically when quotes are approved.`
      }
    ];

    await CMS.insertMany(cmsData);
    console.log('4 CMS configurations seeded.');

    // 5. Seed Settings
    await Settings.create({
      websiteName: 'GreenFields Co.',
      logoPlaceholder: '🌾 GreenFields',
      defaultMode: 'B2C',
      contactEmail: 'support@greenfieldsagri.com',
      contactPhone: '+1 (800) 555-AGRI',
      address: '77 Harvest Ridge Rd, Great Plains, KS 66044',
      socialLinks: {
        facebook: 'https://facebook.com/greenfieldsagri',
        twitter: 'https://twitter.com/greenfieldsagri',
        instagram: 'https://instagram.com/greenfieldsagri',
        linkedin: 'https://linkedin.com/company/greenfieldsagri'
      },
      themeDetails: {
        primaryColor: '#2b5c3d',
        secondaryColor: '#5c4033',
        backgroundColor: '#faf8f5'
      }
    });
    console.log('Global settings seeded.');

    // 6. Seed 3 Enquiries (B2B)
    const enquiriesData = [
      {
        enquiryType: 'bulk',
        product: prodMap['Premium Hybrid Wheat Seeds'],
        companyName: 'Midwest Agro Cooperative',
        contactPerson: 'Sarah Jenkins',
        email: 'sjenkins@midwestagro.com',
        phone: '+1 (316) 555-0149',
        quantity: 200,
        message: 'Looking to purchase 200 bags of 25 Kg hybrid wheat seeds for the upcoming season. Need quotation including container delivery to our grain elevators in Kansas.',
        status: 'new',
      },
      {
        enquiryType: 'product',
        product: prodMap['De-oiled Mustard Meal Powder'],
        companyName: 'BioFeed Manufacturing Ltd',
        contactPerson: 'David Vance',
        email: 'dvance@biofeed.com',
        phone: '+1 (515) 555-8833',
        quantity: 100,
        message: 'Requesting specification sheet and volume price breaks for 100 bags of Mustard Meal Powder. Please specify protein test percentages.',
        status: 'contacted',
      },
      {
        enquiryType: 'general',
        companyName: 'Green Valley Organic Farms',
        contactPerson: 'Robert Chen',
        email: 'info@greenvalleyfarms.org',
        phone: '+1 (605) 555-3211',
        message: 'Hello, do you supply bulk quantities of organic fertilizers to international ports in Canada? Interested in shipping costs and customs declarations assistance.',
        status: 'new',
      }
    ];

    await Enquiry.insertMany(enquiriesData);
    console.log('3 B2B enquiries seeded.');

    // 7. Seed 3 Orders (B2C)
    const ordersData = [
      {
        orderItems: [
          { product: prodMap['Organic Heritage Tomato Seeds'], quantity: 3, price: 45 },
          { product: prodMap['Heavy Duty Steel Hand Trowel'], quantity: 1, price: 320 }
        ],
        customerDetails: {
          name: 'Jane Doe',
          email: 'jane.doe@gmail.com',
          phone: '+1 (202) 555-0177',
          address: '412 Elm Street',
          city: 'Arlington',
          zipCode: '22201',
        },
        paymentMethod: 'COD',
        totalAmount: 455,
        status: 'pending',
      },
      {
        orderItems: [
          { product: prodMap['Professional Bypass Pruning Shears'], quantity: 1, price: 590 },
          { product: prodMap['Organic Cold-Pressed Neem Oil Spray'], quantity: 2, price: 180 }
        ],
        customerDetails: {
          name: 'Michael Miller',
          email: 'mmiller@yahoo.com',
          phone: '+1 (415) 555-9081',
          address: '89 Golden Gate Ave Apt 4B',
          city: 'San Francisco',
          zipCode: '94102',
        },
        paymentMethod: 'COD',
        totalAmount: 950,
        status: 'processing',
      },
      {
        orderItems: [
          { product: prodMap['Premium Basmati Rice Grains'], quantity: 5, price: 150 }
        ],
        customerDetails: {
          name: 'Emily Watson',
          email: 'emily.watson@live.com',
          phone: '+1 (708) 555-4512',
          address: '1504 Maple Avenue',
          city: 'Oak Park',
          zipCode: '60302',
        },
        paymentMethod: 'COD',
        totalAmount: 750,
        status: 'delivered',
      }
    ];

    await Order.insertMany(ordersData);
    console.log('3 B2C test orders seeded.');

    console.log('Database successfully populated with agricultural commerce seed data!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

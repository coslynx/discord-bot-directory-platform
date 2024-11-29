const mongoose = require('mongoose');
const Bot = require('../models/bot');
const User = require('../models/user');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Seed users (replace with your desired user data)
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
    await adminUser.save();


    // Seed bots (replace with your desired bot data)
    const bot1 = new Bot({
      name: 'Bot1',
      description: 'This is the first bot.',
      prefix: '!',
      githubUrl: 'https://github.com/example/bot1',
      owner: adminUser._id,
      status: 'approved',
    });
    await bot1.save();

    const bot2 = new Bot({
      name: 'Bot2',
      description: 'This is the second bot.',
      prefix: '/',
      websiteUrl: 'https://example.com/bot2',
      owner: adminUser._id,
      status: 'pending',
    });
    await bot2.save();

    console.log('Database seeded successfully!');
    process.exit(0); 
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); 
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
```
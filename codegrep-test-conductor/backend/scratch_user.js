const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb+srv://prince1245:BfB8pNRQUJf88m3@coding.ak1rpax.mongodb.net/?appName=coding')
  .then(async () => {
    const user = await User.findOne({ email: 'princeyadav3033@gmail.com' });
    if (user) {
        console.log('User found:');
        console.log('Email:', user.email);
        console.log('Password Hash:', user.password);
    } else {
        console.log('User not found.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

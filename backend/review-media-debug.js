require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Product = require('./src/models/Product');
const User = require('./src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'arpitpatwa51@gmail.com' });
    if (!user) {
      console.log('MISSING_USER');
      process.exit(1);
    }

    const product = await Product.findOne({
      isActive: true,
      reviews: { $not: { $elemMatch: { user: user._id } } },
    });

    if (!product) {
      console.log('NO_UNREVIEWED_PRODUCT');
      process.exit(0);
    }

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="#2563eb"/></svg>';
    const formData = new FormData();
    formData.append('rating', '5');
    formData.append('comment', 'Nice product with photo upload');
    formData.append('media', new Blob([svg], { type: 'image/svg+xml' }), 'review.svg');

    const response = await fetch(`http://localhost:5000/api/products/${product._id}/review`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const text = await response.text();
    console.log('STATUS', response.status);
    console.log(text);
  } catch (error) {
    console.error('ERR', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();

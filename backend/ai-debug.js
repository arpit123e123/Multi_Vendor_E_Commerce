require('dotenv').config({ path: '../.env' });
const { generateAIResponse } = require('./src/services/aiService');

(async () => {
  const products = [
    { _id: '1', name: 'Nike Air Max', description: 'Running shoes', brand: 'Nike', price: 2499, discountPrice: 1999, category: { name: 'Shoes' }, stock: 10, averageRating: 4.5, numReviews: 18 },
    { _id: '2', name: 'Adidas Ultraboost', description: 'Comfort sports shoes', brand: 'Adidas', price: 3200, discountPrice: 2799, category: { name: 'Shoes' }, stock: 5, averageRating: 4.6, numReviews: 24 },
    { _id: '3', name: 'Puma Running Tee', description: 'Sports t-shirt', brand: 'Puma', price: 1499, discountPrice: 1299, category: { name: 'Clothing' }, stock: 7, averageRating: 4.1, numReviews: 9 }
  ];

  const reply = await generateAIResponse('show me shoes under 2000', products);
  console.log('REPLY_OK');
  console.log(reply);
})().catch((error) => {
  console.log('REPLY_ERR');
  console.error(error.message || error);
  process.exit(1);
});

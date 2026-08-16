require('dotenv').config({ path: '../.env' });
const { generateAIResponse } = require('./src/services/aiService');

(async () => {
  const products = [
    { _id: '1', name: 'Nike Air Max', description: 'Running shoes', brand: 'Nike', price: 2499, discountPrice: 1999, category: { name: 'Shoes' }, stock: 10, averageRating: 4.5, numReviews: 18 },
    { _id: '2', name: 'Adidas Ultraboost', description: 'Comfort sports shoes', brand: 'Adidas', price: 3200, discountPrice: 2799, category: { name: 'Shoes' }, stock: 5, averageRating: 4.6, numReviews: 24 }
  ];

  const messages = ['hi', 'hello', 'show me shoes under 2000', 'what is this website about'];

  for (const message of messages) {
    const reply = await generateAIResponse(message, products);
    console.log('QUESTION:', message);
    console.log('ANSWER:', reply.slice(0, 250));
    console.log('---');
  }
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
const faker = require('faker');
const Post = require('./models/post');

async function seedPosts() {
  await Post.deleteMany({});
  for (const i of new Array(40)) {
    const post = {
      title: faker.lorem.word(),
      description: faker.lorem.text(),
      price: faker.commerce.price(),
      author: {
        _id: '5df8452df54e022b44d9fe2f',
        username: 'Homer'
      }
    };
    await Post.create(post);
  }
  console.log('40 new posts created');
}

module.exports = seedPosts;

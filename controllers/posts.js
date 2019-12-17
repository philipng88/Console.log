/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const cloudinary = require('cloudinary');
const Post = require('../models/post');

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
  async postIndex(req, res, next) {
    const posts = await Post.find({});
    res.render('posts/index', { posts, pageTitle: 'Posts' });
  },

  postNew(req, res, next) {
    res.render('posts/new', { pageTitle: 'Create New Post' });
  },

  async postCreate(req, res, next) {
    req.body.post.images = [];
    for (const file of req.files) {
      const image = await cloudinary.v2.uploader.upload(
        file.path,
        {
          folder: 'ConsoleLog/PostImages',
          width: 200,
          quality: 'auto:best'
        },
        (error, result) => console.log(result, error)
      );
      req.body.post.images.push({
        url: image.secure_url,
        public_id: image.public_id
      });
    }
    const mapboxResponse = await geocodingClient
      .forwardGeocode({
        query: req.body.post.location,
        limit: 1,
        countries: ['us']
      })
      .send();
    req.body.post.coordinates =
      mapboxResponse.body.features[0].geometry.coordinates;
    const post = await Post.create(req.body.post);
    req.session.success = 'Post created successfully!';
    res.redirect(`/posts/${post.id}`);
  },

  async postShow(req, res, next) {
    const post = await Post.findById(req.params.id).populate({
      path: 'reviews',
      options: { sort: { _id: -1 } },
      populate: {
        path: 'author',
        model: 'User'
      }
    });
    res.render('posts/show', { post, pageTitle: post.title });
  },

  async postEdit(req, res, next) {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post, pageTitle: 'Edit Post' });
  },

  async postUpdate(req, res, next) {
    const post = await Post.findById(req.params.id);

    if (req.body.deleteImages && req.body.deleteImages.length) {
      const deleteImages = req.body.deleteImages;
      for (const publicId of deleteImages) {
        await cloudinary.v2.uploader.destroy(publicId, (error, result) => {
          console.log(result, error);
        });
        for (const image of post.images) {
          if (image.public_id === publicId) {
            const index = post.images.indexOf(image);
            post.images.splice(index, 1);
          }
        }
      }
    }

    if (req.files) {
      for (const file of req.files) {
        const image = await cloudinary.v2.uploader.upload(
          file.path,
          {
            folder: 'ConsoleLog/PostImages',
            width: 200,
            quality: 'auto:best'
          },
          (error, result) => console.log(result, error)
        );
        post.images.push({
          url: image.secure_url,
          public_id: image.public_id
        });
      }
    }

    if (req.body.post.location !== post.location) {
      const mapboxResponse = await geocodingClient
        .forwardGeocode({
          query: req.body.post.location,
          limit: 1,
          countries: ['us']
        })
        .send();
      post.coordinates = mapboxResponse.body.features[0].geometry.coordinates;
      post.location = req.body.post.location;
    }

    post.title = req.body.post.title;
    post.description = req.body.post.description;
    post.price = req.body.post.price;
    post.save();

    res.redirect(`/posts/${post.id}`);
  },

  async postDelete(req, res, next) {
    const post = await Post.findById(req.params.id);
    for (const image of post.images) {
      await cloudinary.v2.uploader.destroy(image.public_id, (error, result) => {
        console.log(result, error);
      });
    }
    await post.remove();
    req.session.success = 'Post deleted';
    res.redirect('/posts');
  }
};

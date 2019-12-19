/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { cloudinary } = require('../cloudinary');
const Post = require('../models/post');

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

module.exports = {
  async postIndex(req, res, next) {
    const posts = await Post.paginate(
      {},
      {
        page: req.query.page || 1,
        limit: 10,
        sort: '-_id'
      }
    );
    posts.page = Number(posts.page);
    res.render('posts/index', {
      posts,
      mapBoxToken,
      pageTitle: 'Posts'
    });
  },

  postNew(req, res, next) {
    res.render('posts/new', { pageTitle: 'Create New Post' });
  },

  async postCreate(req, res, next) {
    req.body.post.images = [];
    for (const file of req.files) {
      req.body.post.images.push({
        url: file.secure_url,
        public_id: file.public_id
      });
    }
    const mapboxResponse = await geocodingClient
      .forwardGeocode({
        query: req.body.post.location,
        limit: 1,
        countries: ['us']
      })
      .send();
    req.body.post.geometry = mapboxResponse.body.features[0].geometry;
    const post = new Post(req.body.post);
    post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p>`;
    await post.save();
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
    const floorRating = post.calculateAvgRating();
    res.render('posts/show', {
      post,
      mapBoxToken,
      pageTitle: post.title,
      floorRating
    });
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
        post.images.push({
          url: file.secure_url,
          public_id: file.public_id
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
      post.geometry = mapboxResponse.body.features[0].geometry;
      post.location = req.body.post.location;
    }

    post.title = req.body.post.title;
    post.description = req.body.post.description;
    post.price = req.body.post.price;
    post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p>`;
    await post.save();
    req.session.success = 'Post updated';
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

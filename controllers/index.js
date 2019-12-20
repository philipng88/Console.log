/* eslint-disable camelcase */
const util = require('util');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');
const Post = require('../models/post');

const { cloudinary } = require('../cloudinary/profileImage');
const { deleteProfileImage } = require('../middleware');

const mapBoxToken = process.env.MAPBOX_TOKEN;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  async landingPage(req, res, next) {
    const posts = await Post.find({});
    res.render('index', {
      posts,
      title: 'Console.log',
      pageTitle: 'Home',
      mapBoxToken,
    });
  },

  getRegister(req, res, next) {
    res.render('auth/register', {
      title: 'Register',
      pageTitle: 'Register',
      username: '',
      email: '',
    });
  },

  async postRegister(req, res, next) {
    try {
      if (req.file) {
        const { secure_url, public_id } = req.file;
        req.body.image = { secure_url, public_id };
      }
      const user = await User.register(new User(req.body), req.body.password);
      req.login(user, err => {
        if (err) return next(err);
        req.session.success = `Welcome to Console.log, ${user.username}!`;
        res.redirect('/');
      });
    } catch (err) {
      deleteProfileImage(req);
      const { username, email } = req.body;
      let error = err.message;
      if (
        error.includes('duplicate') &&
        error.includes('index: email_1 dup key')
      ) {
        error = 'A user with the given email is already registered';
      }
      res.render('auth/register', {
        title: 'Register',
        pageTitle: 'Register',
        username,
        email,
        error,
      });
    }
  },

  getLogin(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/');
    if (req.query.returnTo) req.session.redirectTo = req.headers.referer;
    res.render('auth/login', { title: 'Login', pageTitle: 'Login' });
  },

  async postLogin(req, res, next) {
    const { username, password } = req.body;
    const { user, error } = await User.authenticate()(username, password);
    if (!user && error) return next(error);
    req.login(user, err => {
      if (err) return next(err);
      req.session.success = `Welcome back, ${username}`;
      const redirectUrl = req.session.redirectTo || '/';
      delete req.session.redirectTo;
      res.redirect(redirectUrl);
    });
  },

  getLogout(req, res, next) {
    req.logout();
    res.redirect('/');
  },

  async getProfile(req, res, next) {
    const posts = await Post.find()
      .where('author')
      .equals(req.user._id)
      .limit(10)
      .exec();
    res.render('user/profile', {
      posts,
      pageTitle: 'Profile',
    });
  },

  async updateProfile(req, res, next) {
    const { username, email } = req.body;
    const { user } = res.locals;
    if (username) user.username = username;
    if (email) user.email = email;
    if (req.file) {
      if (user.image.public_id)
        await cloudinary.v2.uploader.destroy(user.image.public_id);
      const { secure_url, public_id } = req.file;
      user.image = { secure_url, public_id };
    }
    await user.save();
    const login = util.promisify(req.login.bind(req));
    await login(user);
    req.session.success = 'Profile successfully updated';
    res.redirect('/profile');
  },

  getForgotPassword(req, res, next) {
    res.render('auth/forgot', { pageTitle: 'Forgot Password?' });
  },

  async putForgotPassword(req, res, next) {
    const token = await crypto.randomBytes(20).toString('hex');
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.session.error = 'There is no account associated with that email';
      return res.redirect('/forgot-password');
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const message = {
      to: email,
      from: 'Console.log Support <console.log_support@noreply>',
      subject: 'Console.log - Forgot Password',
      text: `Please use the following link to reset the password for your Console.log account: http://${req.headers.host}/reset/${token}`,
    };
    await sgMail.send(message);
    req.session.success = `An email has been sent to ${email} with further instructions`;
    res.redirect('/forgot-password');
  },

  async getResetPassword(req, res, next) {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      req.session.error = 'Password reset token is invalid or has expired';
      return res.redirect('/forgot-password');
    }
    res.render('auth/reset', { token, pageTitle: 'Reset Password' });
  },

  async putResetPassword(req, res, next) {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.session.error = 'Password reset token is invalid or has expired';
      return res.redirect('/forgot-password');
    }

    if (req.body.password === req.body.confirm) {
      await user.setPassword(req.body.password);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      const login = util.promisify(req.login.bind(req));
      await login(user);
    } else {
      req.session.error = 'Passwords do not match';
      return res.redirect(`/reset/${token}`);
    }

    const message = {
      to: user.email,
      from: 'Console.log Support <console.log_support@noreply>',
      subject: 'Console.log - Password reset confirmation',
      text:
        'This email is to confirm that the password for your Console.log account has been changed',
    };

    await sgMail.send(message);
    req.session.success = 'Password successfully changed';
    res.redirect('/');
  },
};

  
var express = require('express');
var router = express.Router();
var User = require('../models/user');
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    console.log(user);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and Password is required',
    });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: 'Email is not registered',
      });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({
        error: 'Invalid password!',
      });
    }
    var token = await user.signToken();
    res.json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

//use middleware on route for procted info for dashboard
module.exports = router;
var express = require('express');
var router = express.Router();
const User = require('../models/user')
const Exercise = require('../models/exercise')
const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }  
  next()
}



/* GET home page. */
router.get('/',isLoggedIn, function(req, res, next) {
  res.render('login');
});
router.get('/login', (req, res) => {
  res.render('login')
})
router.get('/user',isLoggedIn, async (req, res) => {    
  const user = await User.findOne(req.session.user)  
  if (user) {
    const exercise = await Exercise.aggregate([ { $sample: { size: 6 } } ]);  
    return res.render('user', { user,exercise });
  } else {
    console.log("user not found");    
  }
})
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login')
})
router.get('/admin', (req, res) => {
  res.render('admin')
})

module.exports = router;

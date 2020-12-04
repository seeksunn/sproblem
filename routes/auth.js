const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Exercise = require('../models/exercise')
router.post('/register', async (req, res) => {
  const user = new User(req.body)
  await user.save()
  req.session.user = user;
  res.redirect('/user')  
})
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({
    username,
    password
  })
  if (user) {
    req.session.user = user;
    const exercise = await Exercise.find().limit(6)    
    return res.redirect('/user')
  } else {
    return res.render('login', { message: 'Email or Password incorrect' })
  }
})
module.exports = router
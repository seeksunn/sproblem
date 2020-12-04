var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
const Admin = require('../models/admin')
const Exercise = require('../models/exercise');
const Words = require('../models/words');
const isAdmin = (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect('/admin')
  }  
  next()
}



/* GET home page. */
router.post('/login', async (req, res) => {
    const {password} = req.body    
    const admin = await Admin.findOne({
        "password" : password
    })
    if (admin) {
      req.session.admin = admin;
      const exercise = await Exercise.find()
      return res.render('manage', { admin,exercise })
    } else {
      return res.render('admin', { message: 'Email or Password incorrect' })
    }
})
router.get('/manage',isAdmin, async (req, res, next) => {
  const admin = await Admin.findOne(req.session.admin)  
  if (admin) {
    const exercise = await Exercise.find()
    return res.render('manage', { admin,exercise });
  } else {
    return res.render('admin', { message: 'please log in' })
    
  }
})
router.get('/delete',isAdmin, async (req, res, next) => {
  const admin = await Admin.findOne(req.session.admin)
  const  id = req.query.exId;  
  if (admin) {
    await Exercise.deleteOne({_id: new mongodb.ObjectID(id)});
    const exercise = await Exercise.find()
    return res.render('manage', { admin,exercise });
  } else {
    return res.render('admin', { message: 'please log in' })    
  }
})
router.get('/exercise',isAdmin, async (req, res, next) => {
  const admin = await Admin.findOne(req.session.admin)
  const  id = req.query.exId;  
  var wordArray='Split each word with spacebar';
  if (admin) {
    if(id=='newExercise') {      
      return res.render('editor', { admin,exercise : {_id : 'New Exercise'}, wordArray});
    } else {
      const exercise = await Exercise.findById(id) 
      if (exercise) {
        wordArray = exercise.words.join(' ');
        return res.render('editor', {admin,exercise,wordArray })
      }
      else {
        console.log("no exercises found");
      }      
    }    
  } else {
    return res.render('admin', { message: 'admin not found' })    
  }
})
router.post('/confirm',isAdmin, async (req, res, next) => {
  const admin = await Admin.findOne(req.session.admin)
  const ex = new Exercise(req.body);
  const wordArray = req.body.words.split(/\s+/);  
  if(admin){
    if(req.body.exId=="New Exercise") {
      await Exercise.create({
        'topic' : req.body.topic,
        'content' : req.body.content,
        'words' : wordArray
      })      
    } else {
      const id = {_id:new mongodb.ObjectId(req.body.exId)}
      await Exercise.updateOne(id,{
        $set: {  "topic" : req.body.topic,  "content" : req.body.content, "words" : wordArray }
      })
    }
    var words;
    wordArray.forEach(async word => {
      words = await Words.findOne({'words':word})
      if(!words){
        await Words.create({'words':word})      
      }
    });
    const exercise = await Exercise.find()
    return res.render('manage', { admin,exercise})     
  } else {
    return res.render('admin', { message: 'admin not found' }) 
  } 
})
router.get('/words',isAdmin, async (req, res, next) => {
  const admin = await Admin.findOne(req.session.admin)  
  if (admin) {
    const words = await Words.find()
    return res.render('manage_words', { admin,words });
  } else {
    return res.render('admin', { message: 'please log in' })    
  }
})
router.post('/addWord',isAdmin, async (req, res, next) => {
  const admin = await Admin.findOne(req.session.admin) 
  const word = req.body.word 
  if (admin) {
    var words = await Words.findOne({'words':word})
    if(!words){
        await Words.create({'words':word})
        words = await Words.find()
        return res.render('manage_words', { admin,words });  
    }
    words = await Words.find()
    return res.render('manage_words', { admin,words });  
  } else {
    return res.render('admin', { message: 'please log in' })    
  }
})
router.post('/deleteWord',isAdmin, async (req, res, next) => {
  const admin = await Admin.findOne(req.session.admin)
  const  id = req.body.wordId;  
  if (admin) {
    await Words.deleteOne({_id: new mongodb.ObjectID(id)});
    const words = await Words.find()
    return res.render('manage_words', { admin,words });
  } else {
    return res.render('admin', { message: 'please log in' })    
  }
})

module.exports = router;
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Exercise = require('../models/exercise')
const Words = require('../models/words')

const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login')
    }
    next()
}

router.get('/exercise',isLoggedIn, async (req, res) => {
  const  id = req.query.exId;    
  const exercise = await Exercise.findById(id)   
  if (exercise) {
    return res.render('exercise', { exercise })
  }
  else {
      console.log("no exercises found");
  }
})
router.post('/completer',isLoggedIn, async (req, res) => { 
    const exId = req.body;    
    const user = await User.findOne(req.session.user);    
    var newArray = user['completed'];    
    if(newArray.includes(exId['exId'])){
      return res.redirect('/user'); 
    }
    newArray.push(exId['exId']);         
    await User.updateOne (
        { "_id" : user['id']},
        {$set: {  "completed" : newArray}
    }); 
    req.session.user = user;
    return res.redirect('/user');     
})
router.get('/all_words_exercise',isLoggedIn, async (req, res) => {      
    //var words = await Words.find();  
    var words = await Words.aggregate([ { $sample: { size: 20 } } ]);  
    if (words) {
      arrayWords = [];
      for (var key in words) {
        if (words.hasOwnProperty(key)) {
          arrayWords.push(words[key].words);          
        }
      }  
      words = arrayWords;
      console.log(words.toString())
      return res.render('all_words_exercise', { words })
    }
    else {
        console.log("no words collection found");
    }
})
router.get('/list',isLoggedIn, async (req, res) => {  
  var filter = req.query.filter; 
  const user = await User.findOne(req.session.user)  
  if (user) {
    var exercise;
    if(filter=='all'){
      exercise = await Exercise.find();
    }
    else {
      exercise = await Exercise.find({
        'topic' : new RegExp(".*"+filter+".*", "i")
      });
    }    
    exerciseLength = await Exercise.countDocuments()
    return res.render('list', { user,exercise,exerciseLength });
  } else {
    console.log("user not found");    
  }
})
router.get('/rndwords_api_exercise',isLoggedIn, async (req, res) => {
  const https = require('https');
  var words;

  https.get('https://random-word-api.herokuapp.com/word?number=10', (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', chunk => {
      data = chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      words=JSON.parse(data);
      console.log(words)
      return res.render('all_words_exercise', {words})  
    });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });      
    //console.log(words)    
})
module.exports = router
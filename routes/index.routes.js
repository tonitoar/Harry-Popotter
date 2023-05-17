const express = require('express');
const router = express.Router();
const axios = require('axios');
const dataHouse = require("../houseTest.json");
const User = require("../models/User.model")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


//MAIN
router.get("/welcome", (req, res, next) => {
  res.render("inside/main");
});


//SPELLS
router.get("/spells", (req, res, next) => { 
  axios.get("https://api.potterdb.com/v1/spells")
  .then(response => {
    console.log(response.data.data)
    res.render("inside/spells", {spells: response.data.data})})

});



//TEST-HOUSE
router.get("/test-house", (req, res, next) => {
  //console.log(dataHouse);
  res.render("inside/test-house", {questions: dataHouse})
});

// per el calcul de resultat

function calculateHouse(answers) {
  let points = {
    Gryffindor: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
    Slytherin: 0
  };
  
  answers.forEach(answer => {
    let house = answer.house;
    let value = answer.value;
    
    points[house] += value;
  });
  
  let maxPoints = Math.max(...Object.values(points));
  let house = Object.keys(points).find(key => points[key] === maxPoints);
  
  return house;
}

const housePhotos = {
  Gryffindor: 'images/Gryfindor.jpg',
  Ravenclaw: 'images/ravenclaw.jpg',
  Hufflepuff: 'images/hufflepuff.jpg',
  Slytherin: 'images/Slytehrin.jpg'
};


router.post('/test-house', (req, res, next) => {

  const answers = JSON.parse(req.body.answers);
  // console.log(calculateHouse(answers));
  const userHouse = calculateHouse(answers);
  const housePhoto = housePhotos[userHouse];
//user update
  req.session.housePhoto = housePhoto;

  res.render("inside/test-house", { userHouse, housePhoto });
});


//PROFILE

router.get('/profile', async (req, res, next) => {

  console.log("req.session", req.session.currentUser._id)

  // User.findById( req.session.currentUser._id)
  // .then(result => {
  //   console.log("user", result)

  //   res.render("inside/profile", {user:result})
  // }) 

  //?tota la part de sota ha d anar a dins
  // console.log(req.session.currentUser.username)
  // User.findById
  try {
    const username = req.session.currentUser.username;
    const spells = User.schema.path('spells').enumValues;
    const wandWood= User.schema.path('wand.wood').enumValues;
    const wandCore= User.schema.path('wand.core').enumValues;
    const patronus = User.schema.path('patronus').enumValues;
    const creature = User.schema.path('creature').enumValues;
    const item = User.schema.path('item').enumValues;
    // console.log("vareta", wandCore)
    // console.log("madera", wandWood)
   // console.log("core", wandCore)
   const housePhoto = req.session.housePhoto; 
    res.render('inside/profile', { username, spells, wandWood, wandCore, patronus, creature, item, housePhoto });

} catch (err) {
  next(err);
}
});

router.post('/profile', async (req, res, next) => {
  try {
    // Retrieve the selected values from the request body
    const selectedSpells = req.body.spells;
    const selectedWandWood = req.body.wandWood;
    const selectedWandCore = req.body.wandCore;
    const selectedPatronus = req.body.patronus;
    const selectedCreature = req.body.creature;
    const selectedItem = req.body.item;

    // Find the user by their username stored in the session
    const user = await User.findOne({ username: req.session.currentUser.username });

    // Update the selected values in the user's profile
    user.spells = selectedSpells;
    user.wand = { wood: selectedWandWood, core: selectedWandCore };
    user.patronus = selectedPatronus;
    user.creature = selectedCreature;
    user.item = selectedItem;

    // Save the updated user profile
    await user.save();

    res.redirect('/profile');
  } catch (err) {
    next(err);
  }
});


//LOBBY
router.get("/combat/lobby", (req, res, next) => {
      res.render("inside/combatLobby");
  });




//FIGHT
router.get("/combat/fight", (req, res, next) => {
          res.render("inside/combatFight");
      });
  

router.get("/combat/fight", (req, res, next) => {
      res.render("inside/combatFight");
  });




module.exports = router;



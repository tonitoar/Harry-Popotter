const express = require('express');
const router = express.Router();
const axios = require('axios');

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
  axios.request("https://api.potterdb.com/v1/spells")
  .then(response => {console.log(response)})
  res.render("inside/spells");
});

//TEST-HOUSE
router.get("/test-house", (req, res, next) => {
  res.render("inside/test-house");
});


router.post('/test-house', (req, res, next) => {
  res.render("inside/test-house");
  })

//PROFILE

router.get("/profile", (req, res, next) => {
      res.render("inside/profile");
  });

router.post('/profile', (req, res, next) => {
  res.render("inside/profile");
  })



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



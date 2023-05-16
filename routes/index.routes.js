const express = require('express');
const router = express.Router();
const axios = require('axios');
const dataHouse = require("../houseTest.json")


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
  console.log(dataHouse);
  res.render("inside/test-house", {questions: dataHouse})
});


router.post('/test-house', (req, res, next) => {
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



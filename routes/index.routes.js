const express = require("express");
const router = express.Router();
const axios = require("axios");
const dataHouse = require("../houseTest.json");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const {getSpells} = require("../Services/spells.service");
const Combat = require("../models/Combat.model");


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
  axios.get("https://api.potterdb.com/v1/spells").then((response) => {
    console.log(response.data.data);
    res.render("inside/spells", { spells: response.data.data });
  });
});

//TEST-HOUSE
router.get("/test-house/:user", (req, res, next) => {
  //console.log(dataHouse);
  const user = req.params.user;
  res.render("inside/test-house", { questions: dataHouse, user });
});

// per el calcul de resultat

function calculateHouse(answers) {
  let points = {
    Gryffindor: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
    Slytherin: 0,
  };

  answers.forEach((answer) => {
    let house = answer.house;
    let value = answer.value;

    points[house] += value;
  });

  let maxPoints = Math.max(...Object.values(points));
  let house = Object.keys(points).find((key) => points[key] === maxPoints);

  return house;
}

const housePhotos = {
  Gryffindor: "/images/Gryfindor.jpg",
  Ravenclaw: "/images/ravenclaw.jpg",
  Hufflepuff: "/images/hufflepuff.jpg",
  Slytherin: "/images/Slytherin.jpg",
};

router.post("/test-house/:user", (req, res, next) => {
  const answers = JSON.parse(req.body.answers);
  const userHouse = calculateHouse(answers);
  const housePhoto = housePhotos[userHouse];
  const username = req.params.user;
  //console.log("ID",user)

  User.findOneAndUpdate({ username: username }, { house: userHouse })
    // .then((user) => {
    //   if (!user) {
    //     throw new Error("User not found");
    //   }

    // })
    .then(() => {
      // req.session.housePhoto = housePhoto;
      res.render("inside/test-house", { userHouse, housePhoto });
    })
    .catch((error) => {
      console.error("Error creating test:", error);
      res.status(500).send("Error creating test: " + error.message);
    });
});

router.get("/profile/:user", (req, res, next) => {
  const { user } = req.params;
 getSpells()
//  .find()
//  .populate("attributes")
  .then((response) => {
    //let data = response.data.data;
    //console.log(response.data.data)});
    //let dataSpells = response.data.data
    //console.log("hechizos",response.data.data) // crear variable en la cual sigui una array de 20 spells que vinguin del response.data.data
                                                // limitar la array que tingui 20 = spells aviliable const, seleccionar 4 "multiple"
                                                // const spellsAvailable = (aqui aniran els 20 spells seleccionats)
    User.findOne({ username: user })
    .then((foundUser) => {
      const spells = response.data.data;
      const wandWood = User.schema.path("wand.wood").enumValues;
      const wandCore = User.schema.path("wand.core").enumValues;
      const patronus = User.schema.path("patronus").enumValues;
      const creature = User.schema.path("creature").enumValues;
      const item = User.schema.path("item").enumValues;
      const house = foundUser.house
      // console.log("HHHHHHHHHHHHHHHH",foundUser.house)
        // const housePhoto = foundUser.housePhoto;
      // console.log("WOOD MATERIAL",wandWood )
        res.render("inside/profile", {
          user: foundUser,
          house, 
          spells, //: spellsAvailable,
          wandWood,
          wandCore,
          patronus,
          creature,
          item,
          // //housePhoto,
        });
        console.log("USER ----------->", foundUser)
      })
      .catch((err) => {
        next(err);
      });
  });
});

router.post("/profile/:user", (req, res, next) => {
  const { user } = req.params;
  const { spells, wood, core, patronus, creature, item } = req.body;
  // console.log("XXXXXXXXXX", req.body)
  User.findOneAndUpdate(
    { username: user },
    {
      spells: "",
      wand: { wood: wood, core: core },
      patronus: patronus,
      creature: creature,
      item: item,
    },
    { new: true }
  )
    .then((updatedUser) => {
      // Update the user in the session object
      console.log("UPDATED ------>", updatedUser)
      req.session.currentUser = updatedUser.toObject();
      // Remove the password field
      delete req.session.currentUser.password;
      res.redirect(`/profile/${updatedUser.username}`);
    })
    .catch((error) => {
      console.error("Error creating test:", error);
      res.status(500).send("Error creating test: " + error.message);
    });
});

//LOBBY
//router.get("/combat/lobby", (req, res, next) => {
  //});

  router.get('/combat/:user/lobby', (req, res, next) => {
    const currentUserUsername = req.params.user;
  
    User.findOne({ username: currentUserUsername })
      .then(currentUser => {
        User.find({ username: { $ne: currentUserUsername } })
          .then(opponents => {
            res.render('inside/combatLobby', { currentUser, opponents });
          })
          .catch(err => {
            next(err);
          });
      })
      .catch(err => {
        next(err);
      });
  });


//FIGHT
router.get("/combat/fight", (req, res, next) => {
  res.render("inside/combatFight");
});

router.post("/combat/fight", (req, res, next) => {
  res.render("inside/combatFight");
});

module.exports = router;

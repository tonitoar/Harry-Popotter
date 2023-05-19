const express = require("express");
const router = express.Router();
const axios = require("axios");
const dataHouse = require("../houseTest.json");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const { getSpells } = require("../Services/spells.service");
const Combat = require("../models/Combat.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//MAIN
router.get("/welcome", (req, res, next) => {
  // console.log(req.session.currentUser)
  const user = req.session.currentUser;
  res.render("inside/main", user);
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
  Gryffindor:
    "https://res.cloudinary.com/dvdoxs7vr/image/upload/v1684430046/potter-pics/Gryfindor_xffr8l.jpg",
  Ravenclaw:
    "https://res.cloudinary.com/dvdoxs7vr/image/upload/v1684430069/potter-pics/ravenclaw_xmyzec.jpg",
  Hufflepuff:
    "https://res.cloudinary.com/dvdoxs7vr/image/upload/v1684430058/potter-pics/hufflepuff_o3ihem.jpg",
  Slytherin:
    "https://res.cloudinary.com/dvdoxs7vr/image/upload/v1684430078/potter-pics/Slytehrin_ddfyhg.jpg",
};

router.post("/test-house/:user", (req, res, next) => {
  const answers = JSON.parse(req.body.answers);
  const userHouse = calculateHouse(answers);
  const housePhoto = housePhotos[userHouse];
  const username = req.params.user;
  //console.log("ID",user)
  // console.log("current user info-----------", req.session.currentUser);
  // console.log("userhouse-----------", userHouse);
  req.session.currentUser.house = userHouse;
  // console.log("current user house name------------", req.session.currentUser.house);
  // console.log("current user info version 2-----------", req.session.currentUser);

  User.findOneAndUpdate(
    { username: username },
    { house: userHouse, photo: housePhoto }
  )
    // .then((user) => {
    //   if (!user) {
    //     throw new Error("User not found");
    //   }

    // })
    .then(() => {
      // req.session.housePhoto = housePhoto;
      res.render("inside/test-results", { userHouse, housePhoto, username });
    })
    .catch((error) => {
      console.error("Error creating test:", error);
      res.status(500).send("Error creating test: " + error.message);
    });
});

router.get("/profile/:user", (req, res, next) => {
  if (!req.session.currentUser.house) {
    res.redirect(`/test-house/${req.session.currentUser.username}`);
  } else {
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
        const spellData = response.data
        const spellNames = spellData.data.map(spell => spell.attributes.name);

        User.findOne({ username: user })
          .then((foundUser) => {
            const spells = spellNames;
            const wandWood = User.schema.path("wand.wood").enumValues;
            const wandCore = User.schema.path("wand.core").enumValues;
            const patronus = User.schema.path("patronus").enumValues;
            const creature = User.schema.path("creature").enumValues;
            const item = User.schema.path("item").enumValues;
            const house = foundUser.house;
            const housePhoto = foundUser.photo;
            // console.log("SPELLS -------------->",spells )

 // Retrieve the query parameters from the URL
 const { spells: selectedSpells, wood: selectedWood, core: selectedCore, patronus: selectedPatronus, creature: selectedCreature, item: selectedItem } = req.query;
            
            res.render("inside/profile", {
              // user: foundUser,
              // house,
              // spells, //: spellsAvailable,
              // wandWood,
              // wandCore,
              // patronus,
              // creature,
              // item,
              // housePhoto,
              user: foundUser,
              house,
              spells,
              wandWood,
              wandCore,
              patronus,
              creature,
              item,
              housePhoto,
              selectedSpells: selectedSpells ? selectedSpells.split(", ").join(", ") : "",
              selectedWandWood: selectedWood || "",
              selectedWandCore: selectedCore || "",
              selectedPatronus: selectedPatronus || "",
              selectedCreature: selectedCreature || "",
              selectedItem: selectedItem || "",
            });
            
            //console.log("USER ----------->", foundUser);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
});

router.post("/profile/:user", (req, res, next) => {
  const { user } = req.params;
  const { spells, wood, core, patronus, creature, item } = req.body;
  //console.log("xxxxxxxxxxxxxxxxxxxxxxx------", req.body)
  // console.log("XXXXXXXXXX", req.body)

  // let updatedSpells = [];
  // if (Array.isArray(spells)) {
  //   updatedSpells = spells.map((spell) => ({ name: spell }));
  // }
  const spellsPower=spells.map(spell =>{
    console.log(spell)
    return {name: spell, powerlvl: Math.floor(Math.random() * 101)};  
  } ); 
    console.log("--------------------",spellsPower)
  
  User.findOneAndUpdate(
    { username: user },
    {
      spells: spellsPower, 
      //spells: updatedSpells,
      wand: { wood: wood, core: core },
      patronus: patronus,
      creature: creature,
      item: item,
    },
    { new: true }
  )
    .then((updatedUser) => {
      // Update the user in the session object
      //console.log("UPDATED ------>", updatedUser);
      req.session.currentUser = updatedUser.toObject();
      // Remove the password field
      delete req.session.currentUser.password;
      //res.redirect(`/profile/${updatedUser.username}`);
      res.redirect(`/profile/${updatedUser.username}?spells=${spells}&wood=${wood}&core=${core}&patronus=${patronus}&creature=${creature}&item=${item}`);
    })
    .catch((error) => {
      console.error("Error creating test:", error);
      res.status(500).send("Error creating test: " + error.message);
    });
});

//LOBBY
//router.get("/combat/lobby", (req, res, next) => {
//});

router.get("/combat/:user/lobby", (req, res, next) => {
  const currentUserUsername = req.params.user;

  User.findOne({ username: currentUserUsername })
    .then((currentUser) => {
      console.log("--------------------->",typeof currentUser.spells)
      console.log("que es",currentUser.spells)
      console.log("que es",currentUser.key)
      User.find({ username: { $ne: currentUser.username } })
        .then((opponents) => {
          res.render("inside/combatLobby", {currentUser, opponents });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
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

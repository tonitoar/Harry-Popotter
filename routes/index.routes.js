const express = require("express");
const router = express.Router();
const axios = require("axios");
const dataHouse = require("../houseTest.json");
const User = require("../models/User.model");
const Test = require("../models/Test.model");
const mongoose = require('mongoose');


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
  res.render("inside/test-house", { questions: dataHouse, user});
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

    User.findOne({ username })
      .then((user) => {
        if (!user) {
          throw new Error("User not found");
        }

        const newTest = new Test({
          user: user._id,
          house: userHouse,
        });

        return newTest.save();
      })
      .then((savedTest) => {
        req.session.housePhoto = housePhoto;
        res.render("inside/test-house", { userHouse, housePhoto });
      })
      .catch((error) => {
        console.error('Error creating test:', error);
        res.status(500).send('Error creating test: ' + error.message);
      });
  });

  //PROFILE

  // router.get("/profile/:user", async (req, res, next) => {
    // console.log("req.session", req.session.currentUser._id)

    // User.findById( req.session.currentUser._id)
    // .then(result => {
    //   console.log("user", result)

    //   res.render("inside/profile", {user:result})
    // })

    //?tota la part de sota ha d anar a dins
    // console.log(req.session.currentUser.username)
    // User.findById
  //   try {
  //     const user = await User.findOne({ username: req.params.user });
  //     const spells = User.schema.path("spells").enumValues;
  //     const wandWood = User.schema.path("wand.0.wood").enumValues;
  //     const wandCore = User.schema.path("wand.0.core").enumValues;
  //     const patronus = User.schema.path("patronus").enumValues;
  //     const creature = User.schema.path("creature").enumValues;
  //     const item = User.schema.path("item").enumValues;
  
  //     res.render("inside/profile", {
  //       user,
  //       spells,
  //       wandWood,
  //       wandCore,
  //       patronus,
  //       creature,
  //       item,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // });


  // router.post("/profile/:user", async (req, res, next) => {
  //   try {
  //     const { user } = req.params;
  //     const {
  //       selectedSpells,
  //       selectedWandWood,
  //       selectedWandCore,
  //       selectedPatronus,
  //       selectedCreature,
  //       selectedItem,
  //     } = req.body;
  
  //     const updatedUser = await User.findOneAndUpdate(
  //       { username: user },
  //       {
  //         spells: selectedSpells,
  //         wand: [{ wood: selectedWandWood, core: selectedWandCore }],
  //         patronus: selectedPatronus,
  //         creature: selectedCreature,
  //         item: selectedItem,
  //       },
  //       { new: true }
  //     );

  //     await updatedUser.save()
  
  //     res.redirect(`inside/profile/${updatedUser.username}`);
  //   } catch (err) {
  //     next(err);
  //   }
  // }); 

  router.get("/profile/:user", (req, res, next) => {
    const { user } = req.params;
  //console.log("EEEEEESSSS", user.username)
    User.findOne({ username: user })
      .then((foundUser) => {
        const spells = User.schema.path("spells").enumValues;
        const wandWood = User.schema.path("wand.wood").enumValues;
        const wandCore = User.schema.path("wand.core").enumValues;
        const patronus = User.schema.path("patronus").enumValues;
        const creature = User.schema.path("creature").enumValues;
        const item = User.schema.path("item").enumValues;
  
       // const housePhoto = foundUser.housePhoto;
  
        res.render("inside/profile", {
          username: foundUser.username,
          spells,
          wandWood,
          wandCore,
          patronus,
          creature,
          item,
          //housePhoto,
        });
      })
      .catch((err) => {
        next(err);
      });
  });
  
  router.post("/profile/:user", (req, res, next) => {
  const { user } = req.params;
  const {
    selectedSpells,
    selectedWandWood,
    selectedWandCore,
    selectedPatronus,
    selectedCreature,
    selectedItem,
  } = req.body;

  User.findOneAndUpdate(
    { username: user },
    {
      spells: selectedSpells,
      wand: [{ wood: selectedWandWood, core: selectedWandCore }],
      patronus: selectedPatronus,
      creature: selectedCreature,
      item: selectedItem,
    },
    { new: true }
  )
    .then((updatedUser) => {
      // updatedUser.save()
      //   .then(() => {
      //     res.redirect(`/inside/profile/${updatedUser.username}`);
      //   })
      //   .catch((err) => {
      //     next(err);
      //   });

      // Update the user in the session object
      req.session.currentUser = updatedUser.toObject();
      // Remove the password field
      delete req.session.currentUser.password;
      res.redirect(`/inside/profile/${updatedUser.username}`);

    })
    .catch((error) => {
        console.error('Error creating test:', error);
        res.status(500).send('Error creating test: ' + error.message);
    });
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


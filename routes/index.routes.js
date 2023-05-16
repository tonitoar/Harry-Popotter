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


router.post('/test-house', (req, res, next) => {

  //let {text, value} = dataHouse
  //function calculateHouse(answers) {
//   function calculateHouse(dataHouse) {
//     let points = {
//       Gryffindor: 0,
//       Ravenclaw: 0,
//       Hufflepuff: 0,
//       Slytherin: 0
//     };
    
//     dataHouse.forEach(answer => {
//       let house = answer.house;
//       let value = answer.value;
      
//       points[house] += value;
//     });
    
//     let maxPoints = Math.max(...Object.values(points));
//     let house = Object.keys(points).find(key => points[key] === maxPoints);
    
//     return house;
//   }
//  calculateHouse(); 

  // let {options.text, options.value, options.house} = req.body

//   var quizElement = document.getElementById('quiz');
//   var submitButton = document.getElementById('submit');
//   var resultsElement = document.getElementById('results');

//   var userAnswers = [];

//   // Example: Add a click event listener to the quiz element
// quizElement.addEventListener('click', function(event) {
//   var clickedElement = event.target;

//   // Perform actions based on the clicked element
//   if (clickedElement.tagName === 'INPUT') {
//     // Handle the button click
//     var buttonText = clickedElement.value;
//     var questionText = clickedElement.parentNode.parentNode.querySelector('h3').textContent;

//     // Save the selected answer
//     var answer = {
//       question: questionText,
//       answer: buttonText
//     };
//     userAnswers.push(answer);

//     console.log('Selected answer:', answer);
//   }

//   submitButton.addEventListener('click', function() {

//     function calculateHouse(answers) {
//       let points = {
//         Gryffindor: 0,
//         Ravenclaw: 0,
//         Hufflepuff: 0,
//         Slytherin: 0
//       };
    
//       answers.forEach(answer => {
//         let question = answer.question;
//         let selectedAnswer = answer.answer;
    
//         // Update the points based on the selected answer
//         if (question === 'Question 1') {
//           // Modify this condition to match your specific question
//           if (selectedAnswer === 'Option A') {
//             points.Gryffindor += 1;
//           } else if (selectedAnswer === 'Option B') {
//             points.Ravenclaw += 1;
//           } else if (selectedAnswer === 'Option C') {
//             points.Hufflepuff += 1;
//           } else if (selectedAnswer === 'Option D') {
//             points.Slytherin += 1;
//           }
//         }
//         // Add more conditions for additional questions if needed
    
//       });
    
//       // Find the house with the maximum points
//       let maxPoints = Math.max(...Object.values(points));
//       let house = Object.keys(points).find(key => points[key] === maxPoints);
    
//       return house;
//     }
    

//     var finalHouse = calculateHouse(userAnswers);

//     resultsElement.innerHTML = 'You are ' + finalHouse;
});


// });

// });



//PROFILE

router.get("/profile", async (req, res, next) => {

  try {
    const spells = User.schema.path('spells').enumValues;
   // const wand = User.schema.path('wand.0.wood').enumValues;
    // const wandWoods = User.schema.path('wand').schema.tree.wood.enumValues; // Retrieve wand wood enum values
    // const wandCores = User.schema.path('wand').schema.tree.core.enumValues; // Retrieve wand core enum values
    const wandWoods = User.schema.path('wand').caster.schema.path('wood').enumValues; // Retrieve wand wood enum values
    const wandCores = User.schema.path('wand').caster.schema.path('core').enumValues; // Retrieve wand core enum values
    const patronus = User.schema.path('patronus').enumValues;
    const creature = User.schema.path('creature').enumValues;
    const item = User.schema.path('item').enumValues;
    console.log("madera", wandWoods)
    console.log("core", wandCores)
    res.render('inside/profile', { spells, wandWoods, wandCores, patronus, creature, item });

} catch (err) {
  next(err);
}
});

router.post('/profile', (req, res, next) => {
  try {
    // Retrieve the selected values from the request body
    const selectedSpells = req.body.spells;
    const selectedWand = req.body.wand;
    const selectedPatronus = req.body.patronus;
    const selectedCreature = req.body.creature;
    const selectedItem = req.body.item;

    // Perform further processing or save the selected values as needed

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



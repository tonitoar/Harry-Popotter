const { Schema, model } = require("mongoose");
// const mongoose = require('mongoose');

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    unique: true,
  },

  profileImageSrc: {
    type: String,
  },

  house: {
    type: String,
  },

  spells: 
    {
      name: {
        type: String,
        required: true,
      },
      powerlvl: {
        type: Number,
        default: () => Math.floor(Math.random() * 101)
      },
    },


  patronus: {
    type: String,
    enum: [
      "Swan",
      "Mouse",
      "Goat",
      "Phoenix",
      "Fox",
      "Otter",
      "Deer",
      "Hare",
      "Boar",
      "Cat",
      "Deer",
      "Ladybug",
      "Lynx",
      "Wolf",
      "Weasel",
      "Horse",
      "Jack Russell Terrier",
      "Magpie",
      "Eagle",
    ], // BONUS: SECCIO ESPECIAL
    // required: true,
    //unique: true,
  },

  wand: 
    {
      wood: {
        type: String,
        enum: [
          "Acacia",
          "Alder",
          "Apple",
          "Ash",
          "Aspen",
          "Beech",
          "Blackthorn",
          "Black Walnut",
          "Cedar",
          "Cherry",
          "Chestnut",
          "Cypress",
          "Dogwood",
          "Ebony",
          "Elder",
          "Elm",
          "English Oak",
          "Fir",
          "Hawthorn",
          "Hazel",
        ], // BONUS: SECCIO ESPECIAL
      },
      core: {
        type: String,
        enum: [
          "Unicorn Hair",
          "Dragon Heartstrings",
          "Phoenix Feather",
          "Basilisk Horn",
          "Thestral Tail Hair",
          "Thunderbird Tail Feather",
          "White River Monster Spine",
          "Horned Serpent Horn",
        ], // BONUS: SECCIO ESPECIAL
      },
    },


  creature: {
    type: String,
    enum: [
      "Dragon",
      "Basilisk",
      "Acromantula",
      "Chimaera",
      "Nundu",
      "Werewolf",
      "Unicorn",
      "Phoenix",
      "Griffin",
      "Centaur",
      "Kelpie",
      "Thestral",
      "Thunderbird",
      "Hippogriff",
      "Dementor",
      "Giant Squid",
      "Bowtruckle",
      "Fairy",
      "Niffler",
      "Mooncalf",
      "Augurey",
    ], // BONUS: SECCIÓ ESPECIAL
    // required: true,
   // unique: true,
  },

  item: {
    type: String,
    enum: [
      "Nimbus 2000",
      "Firebolt",
      "Resurrection Stone",
      "Cloak of Invisibility",
      "Philosopher's Stone",
      "Time-Turner",
      "Crystal ball",
      "Floo powder",
      "Sword of Gryffindor",
      "Golden Egg",
      "Deluminator",
      "Sorting Hat",
      "Tom Riddle's Diary",
      "Marauders Map",
      "Snitch",
    ],
    // required: true,
    //unique: true, 
  },
  photo: {
    type: String,
  },

});

const User = model("User", userSchema);

module.exports = User;

const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const combatSchema = new Schema(
  {
    Player1: {
      house: String, 
      username: String, 
      spells: [{
        name: String,
        powerlvl: Number,  
        required: true, 
      }],
    },

    Player2: {
      house: String, 
      username: String, 
      spells: [{
        name: String,
        powerlvl: Number,  
        required: true, 
      }], 
    },
    Result: {
      type: String,
      required: true,
    },
  },

);

const Combat = model("User", combatSchema);

module.exports = Combat;

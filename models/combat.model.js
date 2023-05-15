const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const combatSchema = new Schema(
  {
    Player1: {
      spells: {
        type: [String],
        required: true, 
        unique: true, 
      },
      required: true, 
    },

    Player2: {
      spells: {
        type: [String],
        required: true, 
        unique: true, 
      },
      required: true, 
    },
    Result: {
      type: String,
      required: true,
    },
  },

);

const Combat = model("User", combatSchema);

module.exports = Combat;

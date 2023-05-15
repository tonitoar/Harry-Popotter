const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const combatSchema = new Schema(
  {
    Player1: {
      type: ObjectId, 
      }, // objcetID
    },
    {
      Player1: {
        type: ObjectId, 
        }, // objcetID
      },

      {
    Result: {
      type: ObjectId, 
    }, // objcetID
    },

);

const Combat = model("Combat", combatSchema);

module.exports = Combat;

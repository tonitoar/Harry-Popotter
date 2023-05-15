const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const combatSchema = new Schema(
  {
    Player1: {
      User1: {type: Schema.Types.ObjectId, ref: "users", required: true}, 
      }, // objcetID
    },
    {
      Player2: {
        User2: {type: Schema.Types.ObjectId, ref: "users", required: true},

        
        }, // objcetID
      },

    //   {
    // Result: {
    //   type: ObjectId, 
    // }, // objcetID
    // },

);

const Combat = model("Combat", combatSchema);

module.exports = Combat;

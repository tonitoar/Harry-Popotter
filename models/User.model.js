const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    house: {
      type: String,
      required: false,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true, 
    },
    spells: {
      type: String,
      required: true,
      unique: true,
    },
    patronus: {
      type: String,
      required: true,
    },
    wand: {
      type: String,
      required: true,
      unique: true, 
    },
    pet: {
      type: String,
      required: true,
      unique: true, 
    },
    item: {
      type: String,
      required: true,
      unique: true, 
    },
  },
 
);

const User = model("User", userSchema);

module.exports = User;

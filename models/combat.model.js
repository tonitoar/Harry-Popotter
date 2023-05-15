const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const combatSchema = new Schema(
  {
    house: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    spell: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    wand: {
      type: String,
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Combat = model("User", combatSchema);

module.exports = Combat;

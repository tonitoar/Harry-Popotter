const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const combatSchema = new Schema({
  user1: {
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  opponent: {
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
});

const Combat = model("Combat", combatSchema);

module.exports = Combat;

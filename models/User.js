const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  todos: {
    type: Array,
    required: true,
    default: [],
  },
});

module.exports = model("User", UserSchema);

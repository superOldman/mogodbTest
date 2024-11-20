const mongoose = require("../db.js");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  userName: String,
  account: String,
  password: String,
});

const User = model("User", userSchema);

module.exports = User;

// export default User;

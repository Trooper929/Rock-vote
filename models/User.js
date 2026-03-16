const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.checkPassword = function (plaintext) {
  return bcrypt.compare(plaintext, this.password);
};

userSchema.methods.removePassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
module.exports = mongoose.model("User", userSchema);

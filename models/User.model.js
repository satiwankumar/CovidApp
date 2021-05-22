const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const UserSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  firstname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  cnic: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },

  status: {
    type: Boolean,
    default: false,
},
  user_type:{
      type:String,
      required:true 
  }


});

UserSchema.set("timestamps", true);

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      user_type: this.user_type,
      status: this.status,
    },
    config.get("jwtSecret"),
    { expiresIn: "1800s" }
  );
  return token;
};

module.exports = User = mongoose.model("user", UserSchema);

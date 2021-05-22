const mongoose = require("mongoose");
const user = require("./User.model");

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
  },
  no_of_dependents: {
    type: Number,
    required: true,
  },
  funds: {
    type: Number,
    required: true,
  },
  ration: [],
  status: {
    type: String,
    default: "pending",
  },
});

applicationSchema.set("timestamps", true);

module.exports = applications = mongoose.model("applications", applicationSchema);

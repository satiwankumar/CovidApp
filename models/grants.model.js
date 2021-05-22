
const mongoose = require("mongoose");
const application = require("./application.model");

const grantsSchema = new mongoose.Schema({
    application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: application,
  },
  
  funds_granted: {
    type: Number,
    required: true,
  },
  ration_granted: [],
 
});

grantsSchema.set("timestamps", true);

module.exports = grants = mongoose.model("grants", grantsSchema);

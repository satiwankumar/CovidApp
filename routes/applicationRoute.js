const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const moment = require("moment");
const _ = require("lodash");

const { baseUrl } = require("../utils/url");
//middleware
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const User = require("../models/User.model");

const applicationController = require("../controllers/applicationController");

moment().format();

router.post(
  "/create",
  auth,
  [
    check("no_of_dependents", "no_of_dependents is required").not().isEmpty(),
    check("funds", "funds  required").not().isEmpty(),
    check("ration", "ration array are required").isArray().not().isEmpty(),
  ],
  applicationController.CreateApplication
);

router.get("/", [auth, admin], applicationController.GET_ALL_APPLICATIONS);

router.get("/me", [auth], applicationController.GET_CURRENT_USER_APPLICATION);

module.exports = router;

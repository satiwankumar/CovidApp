const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const moment = require("moment");
const _ = require("lodash");
//middleware
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const grantsController = require("../controllers/grantsController");

moment().format();

router.post(
  "/create",
  [
    auth,
    admin,
    [check("application", "application is required").not().isEmpty(),
    check("funds_granted", "funds_granted  required").not().isEmpty(),
    check("ration_granted", "ration_granted array is required")
      .isArray()
      .not()
      .isEmpty()],
  ],
  grantsController.GRANT_DONATION
);
router.get('/', [auth, admin], grantsController.GET_ALL_GRANTS);


module.exports = router;

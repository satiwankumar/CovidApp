const express = require("express");
const _ = require('lodash')
const router = express.Router();
const { check, validationResult } = require('express-validator');

//middleware
const auth = require('../middleware/authMiddleware')
const admin = require('../middleware/adminMiddleware')

//servcies
const { url } = require('../utils');
const checkObjectId = require("../middleware/checkobjectId");

//Controller
const UserController = require('../controllers/userController')




// @route Get api/users (localhost:5000/api/users)
// @desc to getallusers 
// access Private


router.get('/', [auth, admin], UserController.GetUsers);



// @route Post api/user/Signup 
// @desc to Add/Register user
// access public

router.post('/create', [
    check('firstname', 'firstname is required').not().isEmpty(),
    check('lastname', 'lastname is required').not().isEmpty(),
    check('cnic', 'cnic is required').not().isEmpty(),
    check('password', 'please enter a password ').not().isEmpty(),
    check('user_type', 'user_type is required').not().isEmpty(),

    
],
    UserController.Register
)



module.exports = router







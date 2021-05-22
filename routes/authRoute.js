const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const moment = require("moment");
const _ = require('lodash')
//middleware
const auth = require('../middleware/authMiddleware')
const Controller = require('../controllers/authController')

moment().format();


//@route Get api/auth
//@desc Test route
//access Public


router.get('/', auth,Controller.LoadUser)



//@route Post api/login
//@desc Test route
//access Public


router.post('/login', [check('cnic', 'cnic is required').not().isEmpty(), check('password', 'password is required').exists(),], Controller.Login);





router.get('/logout', auth, Controller.Logout)


module.exports = router
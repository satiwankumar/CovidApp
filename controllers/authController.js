const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')
const moment = require("moment");
const _ = require('lodash')
const { baseUrl } = require('../utils/url');

//models
const User = require('../models/User.model')
const Session = require('../models/session.model')


exports.Login = async (req, res) => {
    let error = []

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let { cnic, password } = req.body;
       
        //see if user exists
        let user = await User.findOne({ cnic });

        if (!user) {
            error.push({ message: "Invalid Credentials" })
            return res.status(400).json({ errors: error });
        }

        const validpassword = await bcrypt.compare(password, user.password)
        if (!validpassword) {
            error.push({ message: "Invalid Credentials" })
            return res.status(400).json({ errors: error });

        }

        const token = user.generateAuthToken()
        // let session = await Session.findOne({ user: user.id });
        // // console.log(session)
        // if (session) {
        //     session.token = token,
        //         session.status = true,
        //         session.deviceId = req.body.deviceId
        // } else {
        user.status=true
        await user.save()

        session = new Session({
            token: token,
            user: user.id,
            status: true,
            deviceId: req.body.deviceId,
            deviceType: req.body.deviceType
        })
        // }

        await session.save()
     

        res.status(200).json({
            "message": "Log in Successfull",
            "user": user,
            "token": token

        })

    } catch (err) {


        const errors = []
        errors.push({ message: err.message })
        res.status(500).json({ errors: errors });
    }

    //return json webtoken
}



exports.Logout =  async (req, res) => {
    try {


        const sessions = await Session.findOne({ user: req.user._id })
        sessions.token = null,
            sessions.status = false,
            sessions.deviceId = null
        await sessions.save()
        return res.status(200).send({ "message": "User logout Successfullly" })
    } catch (error) {
        res.json({ "message": error.message })
    }


}
exports.LoadUser = async (req, res) => {
    try {
        console.log(req.user)
        let user = await User.findOne({ _id: req.user._id })


        if (!user) {
            return res
                .status(400)
                .json({ message: 'User doesnot exist' });
        }
        const url = baseUrl(req)
        user.image = `${url}${user.image}`
        res.status(200).json(user)
    } catch (error) {
        // console.error(error.message)
        res.status(500).json({ "error": error.message })
    }

}
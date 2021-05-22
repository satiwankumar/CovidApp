const express = require("express");
const bcrypt = require('bcrypt')
const _ = require('lodash')
const fs = require('fs');
var path = require('path');
const {baseUrl}= require('../utils/url')
const { check, validationResult } = require('express-validator');
const config = require('config')
//model
const User = require('../models/User.model')
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
    min: 3,
    max: 10,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
  };
  
exports.Register = async (req, res, next) => {

    try {
        let error = []
        const errors = validationResult(req);
        const url = baseUrl(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // if user duplicated
        let user = await User.findOne({ cnic: req.body.cnic })
        if (user) {
            error.push({ message: "User already registered" })
            return res.status(400).json({ errors: error }
            )
        }



        //decode the base 4 image 
       
        user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            cnic: req.body.cnic,
            user_type:req.body.user_type.toUpperCase()
        });

       let validatePAssword = await passwordComplexity(complexityOptions).validate(req.body.password);
       console.log(validatePAssword)
       if(validatePAssword.error){
        error.push({ message: "password should be a combinatin of one UpperCase, one SpecialCharacter,One Numeric, length should be minimum 3 and maximum 10 " })
        return res.status(400).json({ errors: error })
       }



        const salt = await bcrypt.genSalt(10)
        //hash passoword






        user.password = bcrypt.hashSync(req.body.password, salt)
        const token = await user.generateAuthToken()


        await user.save()
      


     
        res.status(200).json({
            message: "Registration Success, please login to proceed",
            token: token,
            createdUser: user,

        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

exports.GetUsers  = async (req, res) => {
    const {page,limit,selection,fieldname,order} = req.query
    const currentpage = page?parseInt(page,10):1
    const per_page = limit?parseInt(limit,10):5
    const CurrentField = fieldname?fieldname:"createdAt"
    const currentOrder = order? parseInt(order,10):-1
    let offset = (currentpage - 1) * per_page;
    const sort = {};
    sort[CurrentField] =currentOrder
    // return res.json(sort)
    
    const currentSelection = selection?selection:1


    try {
        let users = await User.find({status:currentSelection}).limit(per_page).skip(offset).sort(sort)
        // console.log(users)
        if (!users.length) {
            return res
                .status(400)
                .json({ message: 'no user exist' });
        }
        const url =   baseUrl(req)  
        users.forEach(user=>
           user.image = `${url}${user.image}`
            )
            let Totalcount = await User.find({status:currentSelection}).count()
            const paginate = {
            currentPage: currentpage,
            perPage: per_page,
            total: Math.ceil(Totalcount/per_page),
            to: offset,
            data: users
            }
        res.status(200).json(paginate)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

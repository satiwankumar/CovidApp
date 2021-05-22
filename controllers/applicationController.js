const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const { baseUrl } = require("../utils/url");
const { check, validationResult } = require("express-validator");

const applicationModel = require("../models/application.model");




exports.CreateApplication = async (req, res, next) => {
  try {
    let error = [];
    const errors = validationResult(req);
    const url = baseUrl(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let user = await User.findOne({
      _id: req.user._id,
      user_type: "RESIDENT",
    });
    console.log(user)
    if (!user) {
      error.push({ message: "USER is not a Resident " });
      return res.status(400).json({ errors: error });
    }
    // if user duplicated
    let application = await applicationModel.findOne({ user: req.user._id });
    if (application) {
      error.push({ message: "Application already registered" });
      return res.status(400).json({ errors: error });
    }

    //decode the base 4 image

    application = new applicationModel({
      user: req.user._id,
      no_of_dependents: req.body.no_of_dependents,
      funds: req.body.funds,
      ration: req.body.ration,
    });

    await application.save();

    res.status(200).json({
      message: "Application submited Successfully",
      application: application,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};




exports.GET_ALL_APPLICATIONS  = async (req, res) => {
  const {page,limit,fieldname,order} = req.query
  const currentpage = page?parseInt(page,10):1
  const per_page = limit?parseInt(limit,10):5
  const CurrentField = fieldname?fieldname:"createdAt"
  const currentOrder = order? parseInt(order,10):-1
  let offset = (currentpage - 1) * per_page;
  const sort = {};
  sort[CurrentField] =currentOrder
  // return res.json(sort)
  const filter = {};

      for (const key in req.query) {
        if (req.query.hasOwnProperty(key)) {
          const value = req.query[key];
          if (key=="page" || key=="limit"||order=="order"){

          }
          else if(value){
            filter[key] = value;
                
          }
        }
      }

  try {
      let applications = await applicationModel.find({...filter}).populate('user').limit(per_page).skip(offset).sort(sort)
      // console.log(applications)
      if (!applications.length) {
          return res
              .status(400)
              .json({ message: 'no application exist' });
      }
      const url =   baseUrl(req)  
     
          let Totalcount = await applicationModel.find({...filter}).count()
          const paginate = {
          currentPage: currentpage,
          perPage: per_page,
          total: Math.ceil(Totalcount/per_page),
          to: offset,
          data: applications
          }
      res.status(200).json(paginate)
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

exports.GET_CURRENT_USER_APPLICATION = async (req, res) => {

  try {
      let application = await applicationModel.findOne({ user: req.user._id }).lean()
      // console.log(application)
      if (!application) {
          return res
              .status(400)
              .json({ message: 'no application  exist' });
      }
          const url =   baseUrl(req)  

   
      res.status(200).json(application)
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}
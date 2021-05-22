const express = require("express");
const _ = require("lodash");
const { baseUrl } = require("../utils/url");
const { check, validationResult } = require("express-validator");

//model
const User = require("../models/User.model");
const applicationModel = require("../models/application.model");
const grantsModel = require("../models/grants.model");

exports.GRANT_DONATION = async (req, res, next) => {
  try {
    let error = [];
    const errors = validationResult(req);
    const url = baseUrl(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let application = await applicationModel.findOne({
      _id: req.body.application,
    });

    if (!application) {
      error.push({ message: "application doesnot exist" });
      return res.status(400).json({ errors: error });
    }

    let grant = await grantsModel.findOne({
      application: req.body.application,
    });
    if (grant) {
      error.push({ message: "Dontation Granted Already For This Application" });
      return res.status(400).json({ errors: error });
    }

    //decode the base 4 image

    grant = new grantsModel({
      application: req.body.application,
      funds_granted: req.body.funds_granted,
      ration_granted: req.body.ration_granted,
    });

    await grant.save();
    application.status = "completed";

    await application.save();
    res.status(200).json({
      message: "Donation granted Successfully",
      grant: grant,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};



exports.GET_ALL_GRANTS  = async (req, res) => {
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
      let grants = await grantsModel.find({}).populate('application').limit(per_page).skip(offset).sort(sort)
      // console.log(grants)
      if (!grants.length) {
          return res
              .status(400)
              .json({ message: 'no grants exist' });
      }
      const url =   baseUrl(req)  
     
          let Totalcount = await grantsModel.find().count()
          const paginate = {
          currentPage: currentpage,
          perPage: per_page,
          total: Math.ceil(Totalcount/per_page),
          to: offset,
          data: grants
          }
      res.status(200).json(paginate)
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}
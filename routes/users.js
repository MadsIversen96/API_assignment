var express = require('express');
var router = express.Router();
var jsend = require('jsend');
var jwt = require('jsonwebtoken')
var db = require("../models");
var crypto = require('crypto');
var UserService = require("../services/UserService");
var userService = new UserService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
router.use(jsend.middleware);

// Post for registered users to be able to login
router.post("/login", jsonParser, async (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.description = "Logs in an existing user. (Remember to signup a user first)" <br> Use token as authorization.
    // #swagger.produces = ['json']
    /* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/Login"
      }
    }
  */
    // #swagger.responses[200] = { description: "You are logged in"}
    // #swagger.responses[400] = { description: "Email is required." }
    // #swagger.responses[400] = { description: "Password is required." }
     // #swagger.responses[401] = { description: "Incorrect email or password" }
    // #swagger.responses[500] = { description: "Something went wrong with creating JWT token" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
     // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
  const { email, password } = req.body;
  if (email == null) {
    return res.jsend.fail({ statusCode: 400, result: "Email is required." });
  }
  if (password == null) {
    return res.jsend.fail({ statusCode: 400, result: "Password is required." });
  }
  userService.getOne(email).then((data) => {
      if (data === null) {
          return res.jsend.fail({ statusCode: 401, result: "Incorrect email or password" });
      }
      crypto.pbkdf2(password, data.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
          if (err) {
              return cb(err);
          }
          if (!crypto.timingSafeEqual(data.encryptedPassword, hashedPassword)) {
              return res.jsend.fail({ statusCode: 401, result: "Incorrect email or password" });
          }
          let token;
          try {
              token = jwt.sign(
                  { id: data.id, email: data.email },
                  process.env.TOKEN_SECRET,
                  { expiresIn: "1h" }
              );
              console.log('Generated token:', token);
          } catch (err) {
              return res.jsend.error({ statusCode: 500, result: "Something went wrong with creating JWT token" });
          }
          return res.jsend.success({ statusCode: 200, result: "You are logged in", id: data.id, email: data.email, token: token });
      });
  });
});

// Signup route
router.post("/signup", async (req, res, next) => {
     // #swagger.tags = ['Users']
    // #swagger.description = "Signs up a user."
    // #swagger.produces = ['json']
    /* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/Signup"
      }
    }
  */
    // #swagger.responses[200] = { description: "You created an account."}
    // #swagger.responses[400] = { description: "Email is required." }
    // #swagger.responses[400] = { description: "Password is required." }
     // #swagger.responses[400] = { description: "Provided email is already in use." }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
     // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
  const { name, email, password } = req.body;
  if (name == null) {
      return res.jsend.fail({ statusCode: 400, result: "Name is required." });
  }
  if (email == null) {
      return res.jsend.fail({ statusCode: 400, result: "Email is required." });
  }
  if (password == null) {
      return res.jsend.fail({ statusCode: 400, result: "Password is required." });
  }
  var user = await userService.getOne(email);
  if (user != null) {
      return res.jsend.fail({ statusCode: 400, result: "Provided email is already in use." });
  }
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) {
          return next(err);
      }
      userService.create(name, email, hashedPassword, salt);
      return res.jsend.success({ statusCode: 201, result: "You created an account." });
  });
});

// Delete route
router.delete('/', jsonParser, async (req, res, next) => {
     // #swagger.tags = ['Users']
    // #swagger.description = "Deletes a user."
    // #swagger.produces = ['json']
    /* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/DeleteUser"
      }
    }
  */
    // #swagger.responses[200] = { description: "You deleted an account."}
    // #swagger.responses[400] = { description: "Email is required." }
    // #swagger.responses[404] = { description: "No such user in the database" }
     // #swagger.responses[400] = { description: "Provided email is already in use." }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
     // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
  let email = req.body.email;
  if (email == null) {
      return res.jsend.fail({ statusCode: 400, result: "Email is required" });
  }
  var user = await userService.getOne(email);
  if (user == null) {
      return res.jsend.fail({ statusCode: 404, result: "No such user in the database" });
  }
  await userService.delete(email);
  return res.jsend.success({ statusCode: 200, result: "You deleted an account." });
});

module.exports = router;


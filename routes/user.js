const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
//const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

//registratin systems

router.get("/signup", userController.renderSignupForm );

router.post("/signup", userController.signupUser );


///login system

router.get("/login",userController.renderloginForm );



router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login',failureFlash: true,}),userController.login);

///logout system

router.get("/logout",userController.logoutSystem);



module.exports = router;

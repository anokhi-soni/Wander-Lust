let Express = require('express');
let router = Express.Router({ mergeParams: true }); // Doing this is compulsory if the routes of current file (reviewsRoutes.js) consists of ids (/:id) other files (listingsRoutes.js)  or of parent routes because, By default, Express routers DO NOT inherit params from parent routes. 


const MyError = require('../utils/MyErrorClass.js');
const wrapAsync = require('../utils/WrapAsync.js');
let User = require("../models/user.js");
let passport = require("passport");
let localStrategy = require("passport-local");
router.use(passport.initialize()); //passport.initialize() => a middleware that initializes passport
router.use(passport.session()); // used to keep a user logged in across requests.
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // serializeUser() serializes user
passport.deserializeUser(User.deserializeUser()); // deserializeUser() deserializes user

const {redirectPath} = require("../middlewares.js");

let userController = require("../Controller/userController.js");

router
    .route("/signup")
    .get(userController.signUpForm)
    .post(wrapAsync(userController.postSignUp))

router
    .route("/login")
    .get(userController.loginForm)
    .post(redirectPath, 
        passport.authenticate("local", {
        failureRedirect : "/login",  // agar user ne galat password/username daala to wo wapas /login pe redirect ho jaayega
        failureFlash : true}), // yaani agar user ne galat password/username daala to ek failureFlash msg bhi hum daal rahe honge
        wrapAsync(userController.postLogin)
    )

router.get("/logout", userController.logOut);

module.exports = router;
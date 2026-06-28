let Listing = require("./models/listing.js");
let {Review} = require("./models/review.js");
module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        // console.log(req.path, " ", req.originalUrl);
        req.session.redirectUrl = req.originalUrl; // created a variable redirectUrl inside req.session which will store the req.originalUrl value
        // res.locals.redirectUrl = req.originalUrl; // created a variable redirectUrl inside res.locals which will store the req.originalUrl value
        // console.log(res.locals.redirectUrl);
        req.flash("error", "You must be logged in to create/edit/delete a listing...");
        return res.redirect("/login"); // must return otherwise the next stmts will also get executed
    } else {
        next(); // yaani next waala middleware jisme /add pe render karaya jaa raha hai user ko wo execute ho jaayega
    }
}

module.exports.redirectPath = (req, res, next)=>{
    res.locals.redirectUrl = req.session.redirectUrl; // we aren't using the req.session.redirectUrl directly inside the /login, cuz the passport.authenticate() resets the session, so we're storing the session value inside the res.locals of /login
    next();
}

module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let place = await Listing.findById(`${id}`);
    if(place && !place.owner._id.equals(res.locals.userLoginInfo._id)){ // if place exists and it's owner is not the cuurent/logged in user, then he/she won't be able to proceed further
        req.flash("error", "You are not the owner of the listing...");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let currReview = await Review.findById(reviewId).populate("author");
    if(!currReview.author._id.equals(res.locals.userLoginInfo._id)){
        req.flash("error", "You are not the author....");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
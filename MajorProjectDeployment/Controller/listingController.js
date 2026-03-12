let Listing = require("../models/listing.js");
let {Review} = require("../models/review.js");
const {ListingSchema, ReviewSchema} = require("../models/listingSchema.js"); // Joi scehma for listings
const MyError = require('../utils/MyErrorClass.js');

let mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//mbxGeocoding => mapbox Geocoding // mapbox-sdk/services/geocoding => It means in mapbox-sdk, there are many services from which we're using the geocoding service
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN }); // passing our mapbox account token to connect th sdk with our mapboz account
// this geocodingClient is the main thing which will hwlp us in forward/reverse geocoding

module.exports.validateListing = (req, res, next) =>{
    let result = ListingSchema.validate(req.body); // This means we're passing the req.body object to ListingSchema and checking whether it statisfies the constraints defined by us in the schema or not, and whatever result is sent by the .validate() will get stored inside the result variable
    // console.log(result.error);
    if(result.error){
        // let message = result.error.details[0].message; // datails is an array of objects which is a property of error. The 0th object has an attribute 'message' which stores the error message
        // OR
        let errMsg = result.error.details.map((el)=> el.message).join(","); // Now, there can be many errors at a time, so there'll me many messages too in the detalis array, wo here, we're accessing each message attribute details array and joining them with a comma 
        throw new MyError(400, errMsg);
    } else { 
        next(); // yaani agar koi validation error nahi aaya to hum next middleware function ko call kar denge
    }
}

module.exports.allListings = async(req, res)=>{
    let listings =  await Listing.find();
    // console.log(listings);
    // res.send("Yo!"); 
    return res.render("listings/listings", {listings});
}

module.exports.renderNewForm = (req, res)=>{ // isLoggedIn is the a middleware function created by ourselves in the middleware.js file
    return res.render("listings/Add");
}


module.exports.postListing = async (req, res, next)=>{

    let result = await geocodingClient.forwardGeocode({
        query: req.body.listings.location, // The place which is to be converted into coordinates
        // limit: 2 // how many results (coordinates) you want of the specified place // by default it is set to 5 if we don't set any limit
        limit: 1
    })
    .send(); //This is the step that actually sends the HTTP request to the Mapbox server. It returns a Promise containing the response data.
  
    // console.log(result.body.features); // This features is an array which contains the coordinates of our location
    // console.log(result.body.features[0].geometry); // Accessing the 0th result/object of features array
    // console.log(result.body.features[1].geometry); // Accessing th 1st result/object of features array

    let url = req.file.path; // this path stores the url of the file provided by the cloudinary
    let filename = req.file.filename; // this filename stores the name of the file which is on the cloudinary 
    // console.log(url, filename);
    let listings = req.body.listings; // or let {listings} = req.body
    let place = new Listing(listings);
    place.owner = req.user._id; // req.user stores the logged in user info in the form of a document
    place.image = {url, filename};
    // console.log(req.user);

    place.geometry = result.body.features[0].geometry; // storing the geometry given by the 
    await place.save();
    console.log(place);
    
    req.flash("success", "Listing created successfully!");
    return res.redirect("/listings"); // wrote return so that Express doesn't match the next middleware ie., router.all(/.*/)
    
}

module.exports.showListing = async (req, res, next)=>{
    let {id} = req.params;
    let place = await Listing.findById(id).populate({path: "reviews", populate : {path:"author"}}).populate("owner");
    if(!place) {
        // next(new MyError(405, "Page Not Found!"));
        req.flash("error", "The page you're looking for doesn't exists...");
        return res.redirect(`/listings`);
    }
    // console.log(place);
    return res.render("listings/show_place", {place});
    // res.send("Hello!")
}

module.exports.renderEditFrom = async (req, res)=>{ // this isOwner will check if the user who is trying to edit the form is the owner of the listing or not before rendering the edit form
    let {id} = req.params;
    let place = await Listing.findById(`${id}`);
    if(!place) throw new MyError(400, "No such Id exists :(");
    let ogURl = place.image.url;
    ogURl = ogURl.replace("/upload", "/upload/c_fill,h_300,w_300,e_blur:300"); 
    /*
    1. "/upload/c_fill,h_300,w_300,e_blur:300" :
        • c_fill => means crop the image and fill the height and width specified
        • h_300, w_300 => h => height, w => width, 300 => length in pixel
        • e_blur => blurs the image and 300 is the amount which specifies how much the image should be blurred 
    
    2. "/upload/e_background_removal/e_grayscale"
        • e_background_removal => to remove the background and only keep the person
        • e_grayscale => to turn the image gray or black&white
    */ 
    // console.log(place);
    // res.send(place);
    // console.log(id);
    return res.render("listings/Edit", {place, ogURl});
}

module.exports.postEdit = async (req, res)=>{
    let {id} = req.params;
    // let {listings} = req.body;
    let listings = req.body.listings;
    console.log(listings);
    let updatedListing = await Listing.findByIdAndUpdate(`${id}`, listings, {new : true})
    if(typeof req.file !== "undefined"){ // Agar req.file undefined nahi hua to, yaani agar user ne koi file upoad kiya hoga edit ke time to
        let url = req.file.path;
        let filename = req.file.filename
        updatedListing.image.url = url;
        updatedListing.filename = filename;
        await updatedListing.save();
    }
    req.flash("success", "Listing updated successfully");
    return res.redirect(`/listings`);
}

module.exports.deleteListing = async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    // .then((doc)=> {console.log(doc)}).catch((err) => console.log(err));
    req.flash("success", "Listing deleted successfully");
    return res.redirect("/listings");
}
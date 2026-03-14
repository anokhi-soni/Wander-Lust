if(process.env.NODE_ENV != "production"){ // It means we're creating a new variable NODE_ENV inside process.env. And we'll only use .env when NODE_ENV !- production and when we'll be deploying our website, then we'll set NODE_ENV to "production" so that no one can use the .env
    require("dotenv").config();
}
console.log(process.env.SECRET);

let Express = require('express');
let app = Express();
let path = require("path");
let Mongoose = require('mongoose');
let sampleData = require("./init/SampleData.js"); // sampleData is the obect returned by the file and the 'data' property in that is an array
let methodOverride = require('method-override');
let ejsMate = require("ejs-mate");
const MyError = require('./utils/MyErrorClass.js');
const wrapAsync = require("./utils/WrapAsync.js");
let Listing = require("./models/listing.js");
let listingRouter = require("./ExpressRouters/listingsRoutes.js");
let reviewRouter = require("./ExpressRouters/reviewsRoutes.js");
let User = require("./models/user.js");
let usersRouter = require("./ExpressRouters/usersRoutes.js");

let Atlas_DB_URL = process.env.ATLASDB_URL;
// let Multer = require("multer"); // this package handels multipart/form-data
// const upload = Multer({dest : "uploads/"}); // It means we're going to store all the files inside the "uploads" folder. dest => destination 

//For Map
let mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//mbxGeocoding => mapbox Geocoding // mapbox-sdk/services/geocoding => It means in mapbox-sdk, there are many services from which we're using the geocoding service
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN }); // passing our mapbox account token to connect th sdk with our mapboz account
// this geocodingClient is the main thing which will hwlp us in forward/reverse geocoding


let ExpressSession = require("express-session");
let cookieParser = require("cookie-parser");
let Flash = require("connect-flash");

let MongoStore = require("connect-mongo").default; // why to wrire default => Newer versions (v5+) of connect-mongo export the class as a default export, so require() needs .default

const store = MongoStore.create({ // creating a session storage from MongoStore and storing inside store variable
    mongoUrl : Atlas_DB_URL, // the cloud db connectivity url 
    crypto : { // we can write this secret outside the crypto as well but it's adviced to write inside it for safety purpose
        secret : process.env.SESSION_SECRET // recommended that the password must be same as that of the secret code inside the sessionOptions
    },
    touchAfter : 24*3600 //Interval (in seconds) between session updates. // means => Only update the session in the database once every 24 hours if the session was not modified.
});

store.on("error", (err)=>{ // creating a function 'on' inside store, so if an error arises in MongoStore, to print that error
    console.log("ERROR IN MONGO SESSION STORE : ", err)
    
})
let sessionOptions = {
    store,
    secret : process.env.SESSION_SECRET, // stored the secret inside the env file so that no one else can see it
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000, // the session will get expired after 7 days of when the user interacted with the server // The expires/maxAge are in milliseconds
        maxAge : Date.now() + 7 * 24 * 60 * 60 * 1000, // maximum age of the session (We're keeping it same only) // The expires/maxAge are in milliseconds
        httpOnly : true // this helps to prevent from cross-scripting attacks 
    }
}
let passport = require("passport");
let localStrategy = require("passport-local");
const { Review } = require("./models/review.js");
// const { title } = require("process");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(Express.urlencoded({extended : true}));
app.use(Express.json());
app.use(methodOverride("_method"));
app.use(Express.static(path.join(__dirname, "/public")));
app.use(Express.static(path.join(__dirname, "/public/CSS")));
app.engine("ejs", ejsMate);
app.use(Express.static(path.join(__dirname, "/utils")));
app.use(cookieParser());
app.use(ExpressSession(sessionOptions));
app.use(Flash());  // Should  always written before the routes where the flash will be used

// We must write these middlewares after the session middleware only cuz passport uses session!
app.use(passport.initialize()); //passport.initialize() => a middleware that initializes passport
app.use(passport.session()); // used to keep a user logged in across requests.
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // serializeUser() serializes user
passport.deserializeUser(User.deserializeUser()); // deserializeUser() deserializes user

app.use((req, res, next)=>{ // Should  always written before the routes where the flash will be used
    res.locals.success = req.flash("success"); // this success variable of res.locals is actually an array
    res.locals.error = req.flash("error"); // this error variable of res.locals is actually an array
    res.locals.userLoginInfo = req.user; // req.user stores the logged in user's info
    // console.log(res.locals.userLoginInfo);
    // console.log(res.locals.error);
    next();
})

app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", usersRouter);

async function main(){
    return Mongoose.connect(Atlas_DB_URL);
}
main()
.then(()=>{
    console.log("connection successfull");
})
.catch((err)=>{
    console.log("err");
})

async function initializeData() { // we'll call this function whenever we'll have to initialize the data again
    await Listing.deleteMany({}); // to first delete all the data from the database
    await Review.deleteMany({});
    let KiriObject = '697443156cbaf1aca1924fa7';
    sampleData.data =  await Promise.all(sampleData.data.map(async (object) => {

        let result = await geocodingClient.forwardGeocode({
        query: object.location, // The place which is to be converted into coordinates
        // limit: 2 // how many results (coordinates) you want of the specified place // by default it is set to 5 if we don't set any limit
        limit: 1
    })
    .send();
    console.log(result.body.features[0].geometry);
        return {
            ...object, 
            owner : KiriObject,
            geometry : result.body.features[0].geometry
        } 
    })
);
    // console.log(sampleData.data);
    await Listing.insertMany(sampleData.data); // to insert the sample data again

    console.log("Data was initialized")
} 
// initializeData();



// For testing if the schema validations are working properly or not
app.get("/testingListing", (req, res) => {
    let house = new Listing({ // since here we didn't even write image, undefined will be passed and hence the default link of image will be sent into the db
        title : "My House",
        description : "2 kitchens, 4 toilets, 4 bathrooms, 4 bedrooms, 1 living room",
        price : "4000", // per 2 days
        location : "Bandra, Mumbai",
        country : "India"
    })
    house.save().then((doc) => {console.log(doc)}).catch((err)=>{console.log(err)});
    res.send("testing successful");
})

// app.get("/", (req, res)=>{
//     return res.send("HI! Welcome to Wander Lust!");
// });

app.get("/demoUser", async (req, res)=>{
    let fakeUser = {
        email : "SignmaStudent@gmail.com",
        username : "hajimeArisu"
    }

    let registerationInfo = await User.register(fakeUser, "helloWorld"); // helloWorld is the password that we're setting
    res.send(registerationInfo);
})

app.get("/search", async (req, res, next)=>{
    let {destination} = req.query;
    console.log(destination);
    let place = await Listing.findOne({title : `${destination}`});
    // console.log(place._id.toHexString());
    // console.log(place._id);
    place ? res.redirect(`/listings/${place._id.toHexString()}`) :  next(new MyError(404, "No Results Found"));;
    // res.send("Yo!")
})
// agar upar se koi route match nahi hua, to ye waala middleware custom error throw kar dega ki Page was not found
app.use((req, res, next)=>{ // this middleware MUST be an error middleware cuz if any route will get matched, it'll get executed if it's not an error middleware
    // next(new MyError(404, "Page Not Found"));
    throw new MyError(404, "Page Not Found");
})


app.use((err, req, res, next)=>{
    console.log("_______________________Error______________________")
    let {status = 500, message = "Something went wrong"} = err;
    // res.status(status).send(`<h1> ${message} </h1>`);
    if(err.name == "ValidationError"){
        let retVal = valiErr();
        let {status, message} = retVal;
        res.render("error.ejs", {err, status, message});
    } else res.render("error.ejs", {err, status, message});
    console.log(err);
})


app.listen(3000, ()=>{
    console.log("Listening to port 3000");
});

function valiErr (){
    let message = "Please Enter Valid Values (Price should be a number only)";
    let status = 422;
    return {message, status};
}


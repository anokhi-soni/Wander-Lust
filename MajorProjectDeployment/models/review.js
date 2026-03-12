let Mongoose = require('mongoose');
let {Schema} = Mongoose;
let {User} = require("./user");

let reviewSchemaOG = Schema({
    comment : String,
    ratings : {
        type : Number,
        min : 1,
        max : 5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author : {
        type : Mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
});

Review = Mongoose.model("Review", reviewSchemaOG);

module.exports = {reviewSchemaOG, Review};
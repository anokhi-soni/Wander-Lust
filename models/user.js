let Mongoose = require("mongoose");
let {Schema} = Mongoose;
const passportLocalMongoose = require("passport-local-mongoose").default; // if we don't write this .default, we'll get an error

let userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
})

userSchema.plugin(passportLocalMongoose); 
/*
.plugin() is a schema method, so the plugin is applied to the schema, not the model.
plugins:
    add fields (like username, hash, salt)
    add methods (like register(), authenticate())
*/
module.exports = Mongoose.model('User', userSchema);
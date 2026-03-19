let User = require("../models/user");
module.exports.signUpForm = (req, res)=>{
    res.render("listings/SignUp");
}
module.exports.postSignUp = async(req, res)=>{
    let {username, password, email} = req.body;
    // console.log(username, password, email);
    let newUser = new User({
        email : email,
        username : username
    });

    let userRegistered = await User.register(newUser, password);
    // console.log(userRegistered);
    req.login(userRegistered, (error)=>{
        if(error) return next(error);
        req.flash("success", `Welcome to WanderLust ${username}!`);
        return res.redirect("/listings");
    })
    
}

module.exports.loginForm = (req, res)=>{
    return res.render("listings/Login");
}

module.exports.postLogin = async(req, res)=>{
    req.flash("success", "Your're logged in successfully");
    console.log(res.locals.redirectUrl);
    let redirecTotUrl = res.locals.redirectUrl || "/listings"; // yaani agar res.locals.redirectUrl khaali nahi hoga to wo redirectToUrl me store ho jaayega anyatha redirectToUrl me /listings store ho jaayega
    return res.redirect(redirecTotUrl);
}

module.exports.logOut = (req, res, next)=>{
    req.logOut((err)=>{
        if(err){ // agar log out karte samay koi error hua to hum wo error return kar denge next ke saath
            return next(err);
        }
        req.flash("success", "You're Logged Out!");
        return res.redirect("listings");
    })
}
const User = require('../models/user');

// To register a new user
module.exports.renderRegister = (req, res) => {
    res.render('user/register');
}
module.exports.registerUser = async (req, res, next) => {
    try{
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to Yelp Camp'); 
            res.redirect('/');
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}

// To login a user 
module.exports.renderLogin = (req, res) => {
    res.render('user/login');
}
module.exports.loginUser = (req, res) => {
    req.flash('success','Welcome Back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// To logout a user
module.exports.logoutUser = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','Goodbye!');
        res.redirect('/');
      });
}
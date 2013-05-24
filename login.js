var users = {'dave': 'expressrocks'};
module.exports = function(req, res, next){
    var method = req.method.toLowerCase();
    var user = req.body.user;
    var logout = (method === 'delete');
    var login = (method === 'post' && user);
    var routes = req.app.routes[method];
    if (!routes) {next(); return;}
    if(login || logout) {
        routes.forEach(function(route){
            if (!(req.url.match(route.regexp))) {
                console.log(req.url);
                req.method = 'GET';
            }
        });
    }
    if(logout) {delete req.session.user;}
    
    function validate(user, cb){
        var valid = Object.keys(users).some(function(name){
           return (user.name === name && user.pwd === users[name]); 
        });        
        cb((!valid && {msg:'Login details invalid!'}));
    }
    if(login) {
        validate(user, function(err) {
            if (err) {
                console.log("Error is: " + err.msg);
                req.flash('error', err.msg); 
                res.locals.flash = req.flash();
                return;
            }
            req.session.user = { name: user.name, pwd: user.pwd};
        });
        
        /*
        Object.keys(users).forEach(function(name){
            console.log( user.name + " " + user.pwd);
           if(user.name === name && user.pwd === users[name]){
               req.session.user = {name: user.name, pwd: user.pwd};
           } 
        });
        */
    }
    if(!req.session.user) {req.url = '/';}
    next();
};

/*
 * GET home page.
 */

exports.index = function(req, res){
    var user = req.session.user ? req.session.user : null;
  res.render('index', { title: 'Express', user: user });
};

var users = {'dave' : 'expressrocks' };
exports.login = function(req, res, next){
    var user = req.body.user;
    console.log(user);
    if(user) {
        Object.keys(users).forEach(function(name){
            if(user.name === name && user.pwd === users[name]) {
                req.session.user = {
                    name: user.name,
                    pwd: user.pwd
                };
            }
        });
    }
    next();
};
exports.logout = function(req, res, next){
    delete req.session.user;
    next();
}
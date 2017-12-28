var user = require('../models/user');

module.exports.createUser = function (req, res) {
    let body = req.body;
    if (body.name && body.email && body.password) {
        let newUser = new user({
            name: body.name,
            email: body.email
        });

        newUser.setPassword(req.body.password);
        console.log("Paramètre reçu \n");
        console.log(newUser);
        console.log("Ajout à la base de données ... \n");
        user.create(newUser, function(err, data){
            if(err)
                console.log(err);
            if(data)
                console.log(data);
        });

    }
};
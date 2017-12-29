var user = require('../models/user');
var sendResponse = function(res, status, data){
    res.status(status);
    res.json(data);
};

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
            if(err){
                sendResponse(res, 400, err);
            }
            if(data){
                let returnedData = {
                    name: data.name,
                    token: data.generateJWT()
                };
                sendResponse(res, 201, returnedData);
            }
        });

    }
};
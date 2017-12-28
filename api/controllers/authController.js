let user = require('../models/user');
let sendResponse = function(res, status, data){
    res.status(status);
    res.json(data);
};

module.exports.authenticate = function(req, res){
    let body = req.body;
    if(body.name){
        user.findOne({name:body.name}, function(err, data){
            if(data){
                let returnedData = {
                    name: data.name,
                    token: data.generateJWT()
                };
                sendResponse(res, 200, returnedData);
            }
            if(err){
                sendResponse(res, 400, data);
            }
        });
    }
};
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');

var sendResponse = function (res, status, data) {
    res.status(status);
    res.json(data);
};

module.exports.getItems = function (req, res) {
    if (req.tokenSuccess) {
        let items = [
            { name: 'item 1', value: '1' },
            { name: 'item 2', value: '2' },
            { name: 'item 3', value: '3' },
            { name: 'item 4', value: '4' }
        ];
        sendResponse(res, 200, items);
    }
    if (req.tokenError) {
        sendResponse(res, 400, { message : "Vous n'avez pas de jeton d'autorisation." });
    }
};

module.exports.getBase64 = function (req, res) {
    let filePath = './public/' + req.query.filePath;
    let bitmap = fs.readFileSync(filePath);
    let buffer = new Buffer(bitmap).toString('base64');
    sendResponse(res, 200, { buffer: buffer });
};

module.exports.upload = function (req, res) {

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
        console.log(file.name);
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
};
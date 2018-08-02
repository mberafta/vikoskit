var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var xlsToJson = require('xls-to-json');
var https = require('https');
var request = require('request');
var httpsProxyAgent = require('https-proxy-agent');
var path = require('path');
var agent = new httpsProxyAgent("http://xufj641:Nilmar69!@web.pandore.log.intra.laposte.fr");
var dns = require('dns');
var querystring = require('querystring');

const PROXY_PASI = "surf-sccc.pasi.log.intra.laposte.fr:8080";
const PROXY_PANDORE = "220.128.20.150:8080";
const PROXY_PREFIX = "http://xufj641:Nilmar69!@";
const KEY_PATH = "C:\\Users\\XUFJ641\\Documents\\Certificats\\certificats-dk6\\ficoco.ste.reseau.intra.laposte.fr.crt";
const CA_PATH = 'C:\\Users\\XUFJ641\\Documents\\Certificats\\Certinomis_Bundle_SSL_SHA2.crt';
const DK6_API_ROUTE = '/fsa/service/ficoco-cour/vignette/courrier/vignettesAffran';
const HOSTS = {
    integration: "gia0yam3.spig.reseau.intra.laposte.fr",
    pmep: "gi1-expo-http-6304.spig.reseau.intra.laposte.fr",
    prod: "ficoco.ste.reseau.intra.laposte.fr",
    preprod: "ficoco.ste-ie.reseau.intra.laposte.fr"
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
        sendResponse(res, 400, { message: "Vous n'avez pas de jeton d'autorisation." });
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

module.exports.xlsToJson = function (req, res) {
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('gtinref.xls');
    var sheet_name_list = workbook.SheetNames;
    sendResponse(res, 200, XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
        defval: null, dateNF: ""
    }));
};

module.exports.createHttpsRequest = function (req, res) {
    // Configuration de la reqûete
    let serverConfiguration = req.body.serverConfiguration,
        requestObj = req.body.requestObj;

    // Objet perméttant de renseigner toute la configuration de la reqûete
    let options = {
        hostname: HOSTS[serverConfiguration.urlKey],
        path: serverConfiguration.apiRoute,
        port: 443,
        method: serverConfiguration.method,
        encoding: null,
        headers: {
            'Access-Control-Request-Method': serverConfiguration.method,
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            appName: 'HX_',
            appVersion: req.headers['appVersion'.toLowerCase()],
            accept: req.headers['accept'.toLowerCase()],
            'DISFE-Id-Device': req.headers['DISFE-Id-Device'.toLowerCase()],
            provenanceCode: req.headers['provenanceCode'.toLowerCase()],
            'Proxy-Connections': 'keep-alive'
        },
        rejectUnauthorized: false
    };

    console.log('\n');
    console.log('\n');
    console.log(options);
    console.log('\n');
    console.log('\n');
    
    // Données à envoyer
    let dataObject = serverConfiguration.method == "POST" ? JSON.stringify(requestObj) : "";

    try {
        // Selon la méthode de la requête HTTP, les données sont une chaine ou un tableau de buffers
        let parsedData = serverConfiguration.method == "POST" ? "" : [], responseData, status;
        let httpRequest = https.request(options, (response) => {
            status = response.statusCode;

            response.on('error', (err) => {
                console.log('Erreur -> ', err);
            });

            // Les données arrivent sous forme de flux dans le temps
            // Il faut donc les réunir pour former le résultat final de la requête
            response.on('data', (data) => {
                if (serverConfiguration.method == "POST")
                    parsedData += data;
                else
                    parsedData.push(data);
            });

            // Fin de la réception de données, réunion de toutes parties du buffer en cours de reconstruction
            // Création du fichier vignette.pdf qui sera imprimé afin d'avoir une base64 non corrompue
            response.on('end', () => {
                if (serverConfiguration.method == "GET") { // Tableau de buffers
                    responseData = Buffer.concat(parsedData);
                    // Création du nouveau pdf
                    fs.writeFile('./vignette.pdf', responseData, (err) => {
                        fs.readFile('./vignette.pdf', (err, data) => {
                            if (data) {
                                let base64 = new Buffer(data).toString('base64');
                                responseData = { pdf: base64 };
                                sendResponse(res, status, responseData);
                            }
                        });
                    });
                }
                else { // Données sous forme d'une chaine
                    responseData = JSON.parse(new Buffer(JSON.parse(JSON.stringify(parsedData))).toString('ascii'));
                    console.log(responseData);
                    sendResponse(res, status, responseData);
                }

            });
        });

        // Lancement de la requête avec transmission des paramêtres
        httpRequest.write(dataObject);
        httpRequest.end();
    }
    catch (e) {
        console.log('EXCEPTION OCCURED -> ', e);
    }
};


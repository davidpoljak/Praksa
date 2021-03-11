
var appConfig = require('./config/appConfig.js'), // config se prvi ucitava jer ostali fileovi mozda koriste config
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  fs = require('fs'),
  morgan = require('morgan'),
  app = require('express')(),
  jwt = require('./jwt/jwt');


// inicijalizacija loggera
var winston = require('./winston');
global.systemLogger = winston.loggers.get('systemLogger');
global.apiLogger = winston.loggers.get('apiLogger');


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

if (appConfig.appLogParams.apiCallLog == true) {
  app.use(morgan(':status :date[iso] :method :url :response-time  :req[query] :req[body] :remote-addr :res[content-length]',
    {
      skip: function (req, res) { return req.method == 'OPTIONS' },
      stream: apiLogger.stream
    }
  ));
};

if (appConfig.mainParams.checkAuthHeader == true) app.use(jwt.jwtMiddleware());

app.use('/api/security', require('./jwt/security').securityRouter);
app.use('/api', require('./api').router);

//ako URL ne pocinje sa API onda je greska
app.use(function (req, res, next) {
  systemLogger.log({
    level: 'warn',
    message: '404 Unknown API URL: ' + req.url
  })
  var err = new Error('Unknown API URL.');
  err.status = 404;
  next(err);
});
// generalna greska....
app.use(function (err, req, res, next) {
  if(appConfig.ukljuciConsoleLog.ukljuciStackTrace) {
    console.error(err);
  }
  systemLogger.log({
    level: 'error',
    message: 'ERROR: ' + err.message + err.status
  });
  res.status(err.status || 500).end();
});

//The 404 ruta UVIJEK MORA BITI ZADNJA RUTA !!!!!!!!
app.get('*', function (req, res) {
  systemLogger.log({
      level: 'warn',
      message: 'Nepoznati API URL ! ' + req.url
  });
  res.status(404).send('Nepoznati API URL !');
});

// POKRETANJE SINKRONIZACIJE
if (appConfig.ISVUconfig.ISVUsinkOnOff === true) {
  var api = require('./api').ISVUdata;
  api.getData();
}

module.exports = app;
app.listen(appConfig.mainParams.applicationPort);
systemLogger.log({
  level: 'info',
  message: 'Server started at port ' + appConfig.mainParams.applicationPort
});

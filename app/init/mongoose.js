var mongoose = require('mongoose');
var fs = require('fs');
var config = require('config');

//TODO fetch config from config file
//var dbConfig = config.get('DBCONFIG');

mongoose.connect('mongodb://localhost/todotracker', {server:{auto_reconnect:true}});
var db = mongoose.connection;

db.on('error', function (err) {
  console.error('MongoDB connection error:', err);
});

db.once('open', function callback() {
  console.info('MongoDB connection is established');
});

db.on('disconnected', function() {
  console.error('MongoDB disconnected!');
  mongoose.connect(process.env.MONGO_URL, {server:{auto_reconnect:true}});
});

db.on('reconnected', function () {
  console.info('MongoDB reconnected!');
});

models_path = process.cwd() + '/app/model'
fs.readdirSync(models_path).forEach(function (file) {
  if (file.endsWith('.js'))
    require(models_path + '/' + file)
});

var restify = require('restify');
var fs = require('fs');

var controllers = {}
  , controllers_path = process.cwd() + '/app/controller'

console.log(controllers_path);
fs.readdirSync(controllers_path).forEach(function (file) {
  if (file.endsWith('.js')) {
    controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
  }
})

var server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());

//CRUD list
server.post("/list", controllers.list.createList);
server.get("/list/:id", controllers.list.viewList);
server.del("/list/:id", controllers.list.deleteList);
server.get("/lists", controllers.list.viewAllList);

//add task to list
server.post("/list/:id/task", controllers.task.createTask);
server.put("/task/:id", controllers.task.completeTask);
server.del("/task/:id", controllers.task.deleteTask);

// had some issues setting up routes the doc
//server.get(/\/docs\/current\/?.*/, restify.serveStatic({
/*  directory: process.cwd() + '/apidoc',
  file: 'index.html'
}));*/

server.listen(3000, function (err) {
  if (err)
    console.error(err)
  else
    console.log('App is ready at : 3000');
})


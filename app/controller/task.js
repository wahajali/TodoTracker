var mongoose = require('mongoose'),
Task = mongoose.model("Task")
List = mongoose.model("List"),

/**
 * @api {post} /list/:id/task Create todo task
 * @apiname CreateTask
 * @apigroup Task
 *
 * @apiDescription Create a new todo task.
 * @apiParam {Number} id              Mandatory unique ID of list for which task is to be created.
 * @apiParam {String} description     Mandatory description specifying task.
 * @apiParam {Boolean} [complete]     Optional boolean specifying weather this task is complete.
 *
 * @apiSuccess {Boolean} success       Specify weather the request was successful.
 * @apiSuccess {Object}  list          Todo list for which task was saved.
 */
exports.createTask = function(req, res, next) {
  List.findById(new Object(req.params.id), function(err, list) {
    var task = new Task(req.body);
    list.tasks.push(task);
    task.list = list;
    task.save(function(err, t){
      if (err) {
        console.log('ERROR: ' + err);
        res.status(500);
        res.json({
          success: false,
          error: "Error occured while creating task "
        })
      } else {
        list.save(function(err, list) {
          if (err) {
            console.log('ERROR: ' + err);
            //rollback, should be a better way to do this?
            t.remove();
            res.status(500);
            res.json({
              success: false,
              error: "Error occured while creating task "
            })
          } else {
            res.json({
              success: true,
              list: list
            })
          }
        })
      }
    })
  })
}

/**
 * @api {put} /task/:id/ Mark task complete
 * @apiname CompleteTask
 * @apigroup Task
 *
 * @apiDescription Mark a task as complete.
 * @apiParam {Number} id              Mandatory unique ID of list for which task is to be created.
 *
 * @apiSuccess {Boolean} success       Specify weather the request was successful.
 * @apiSuccess {String}  msg           Message describing the status of the call.
 */
exports.completeTask = function(req, res, next) {
  var taskModel = new Task(req.body);
  Task.findOneAndUpdate(
    {"_id": req.params.id},
    {"$set": {"complete": true}},
    function(err, task) {
      if (err) {
        console.log('ERROR: ' + err);
        res.status(500);
        res.json({
          success: false,
          error: "Error occured while marking task complete"
        })
      } else {
        if (task) {
          res.json({
            success: true,
            msg: "task: " + task.description + " marked complete"
          })
        } else {
          res.json({
            success: false,
            msg: "task: " + req.params.id + " not found"
          })
        }
      }
    })
}

/**
 * @api {delete} /task/:id Delete a single task
 * @apiname DeleteTask
 * @apigroup Task
 *
 * @apiDescription Delete a single todo list task with given ID.
 * @apiParam {Number} id unique ID.
 *
 * @apiSuccess {Boolean} success       Specify weather the request was successful.
 * @apiSuccess {String}  msg           Message describing the status of the call.
 */
exports.deleteTask = function(req, res, next) {
  Task.findById(new Object(req.params.id), function(err, task) {
    if (err) {
      console.log('ERROR: ' + err);
      res.status(500);
      res.json({
        success: false,
        error: "Error occured while deleting task"
      })
    } else if(task) {
      task.remove();
      res.json({
        success: true,
        msg: "Task: " + task.description + " deleted successfully"
      })
    } else {
      res.json({
        success: false,
        msg: "task: " + req.params.id + " not found"
      })
    }
  })
}

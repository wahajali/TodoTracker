var mongoose = require('mongoose'),
Task = mongoose.model("Task")
List = mongoose.model("List"),

/**
 * @api {post} /list Create todo list
 * @apiname CreateList
 * @apigroup List
 *
 * @apiDescription Create a new todo list.
 * @apiParam {String} title           Mandatory title of todo list.
 * @apiParam {String} [description]   Optional description of todo list.
 * @apiParam {String} owner           Optional with default value "DE".
 *
 * @apiSuccess {Boolean} success       Specify weather the request was successful.
 * @apiSuccess {Object}  list          Todo list.
 */
exports.createList = function(req, res, next) {
  var listModel = new List(req.body);
  listModel.save(function(err, list) {
    if (err) {
      console.log('Error: ' + err);
      res.status(500);
      res.json({
        success: false,
        error: "Error occured while creating List "
      })
    } else {
      res.json({
        success: true,
        list: list
      })
    }
  })
}

/**
 * @api {post} /list/:id View a single todo list
 * @apiname ViewList
 * @apigroup List
 *
 * @apiDescription View a single todo list with given ID. Task information is also populated.
 * @apiParam {Number}    unique ID of list.
 *
 * @apiSuccess {Boolean} success       Specify weather the request was successful.
 * @apiSuccess {Object}  list          Todo list.
 */
exports.viewList = function(req, res, next) {
  console.log(req.params.id);
  List.find().populate('tasks').exec(function(err, list) {
    if (err) {
      res.status(500);
      console.log('ERROR: ' + err);
      res.json({
        type: false,
        error: "Error occured while processing request."
      })
    } else {
      if (list) {
        res.json({
          success: true,
          list: list
        })
      } else {
        res.json({
          success: false,
          error: "List with ID " + req.params.id + " not found"
        })
      }
    }
  })
}

/**
 * @api {delete} /list/:id Delete a single todo list
 * @apiname DeleteList
 * @apigroup List
 *
 * @apiDescription Delete a single todo list with given ID.
 * @apiParam {Number} id unique ID.
 *
 * @apiSuccess {Boolean} success       Specify weather the request was successful.
 * @apiSuccess {String}  msg           Success messge with delete list ID.
 */
exports.deleteList = function(req, res, next) {
  List.findById(new Object(req.params.id), function(err, list) {
    if (err) {
      res.status(500);
      console.log('ERROR: ' + err);
      res.json({
        success: false,
        error: "Error occured while processing request."
      })
    } else if (list) {
      //findByIdandRemove doesn't call pre/post hooks
      list.remove(function (err, l){
        if (err) {
          res.status(500);
          res.json({
            success: false,
            error: "Error occured: " + err
          })
        } else {
          res.json({
            success: true,
            msg: "List: '" + l.title + "' deleted successfully"
          })
        }
      }) ;
    } else {
      res.status(404);
      res.json({
        success: false,
        error: "List with id '" + req.params.id +  "' not found"
      })
    }
  })
}

/**
 * @api {get} /lists/ Get all todo lists.
 * @apiname GetAllList
 * @apigroup List
 *
 * @apiDescription Get all lists, with their respective information.
 * @apiParam {Number} id unique ID.
 *
 * @apiSuccess {Boolean} success       Specify weather the request was successful.
 * @apiSuccess {Object}  list          List of todo lists objects
 */
exports.viewAllList = function(req, res, next) {
  List.find({}).exec(function(err, list) {
    if (err) {
      res.status(500);
      console.log('ERROR: ' + err);
      res.json({
        success: false,
        error: "Error occured while processing request."
      })
    } else {
      res.json({
        success: true,
        list: list
      })
    }
  })
}

var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var Task = require("./task");

var ListSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, default: ''},
  owner: {type: String, default: ''},
  tasks: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

ListSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var retJson = {
      id: ret._id,
      title: ret.title,
      description: ret.description,
      owner: ret.owner,
      tasks: ret.tasks,
      tasks_count: ret.tasks.length
    };
    return retJson;
  }
})

ListSchema.statics.fetchAll = function fetchAll() {
  var List = mongoose.model('List', ListSchema);
  List.aggregate(
    {
      $project: {
        tasks_count: { $size:"$tasks" },
        "title": 1,
        "description": 1,
        "owner": 1
      }
    }
  )
}

ListSchema.pre('remove', function(next) {
  // to be notified of the calls' result.
  // can be moved to batch remove
  T = mongoose.model('Task');
  this.tasks.forEach(function (t) {
    T.findByIdAndRemove(new Object(t)).exec();
  })
  next();
});

mongoose.model('List', ListSchema);

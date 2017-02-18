var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var TaskSchema = new Schema({
  description: {type: String, required: true},
  complete: {type: Boolean, default: false},
  list : { type : mongoose.Schema.Types.ObjectId, ref: 'List' }
});

TaskSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var retJson = {
      id: ret._id,
      description: ret.description,
      complete: ret.complete
    };
    return retJson;
  }
})

TaskSchema.pre('remove', function(next) {
  // to be notified of the calls' result.
  // can be moved to batch remove
  T = mongoose.model('List');
  parentId = this._id;
  ls = T.findById(this.list).exec(function(err, lax){
    lax.tasks.pull(parentId);
    lax.save();
  });
  next();
});

mongoose.model('Task', TaskSchema);

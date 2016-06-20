var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
var urlSchema = mongoose.Schema({
  baseUrl: String,
  shortId: Number,
  created_at: { type: Date, default: Date.now }
});

urlSchema.plugin(autoIncrement.plugin, { model: 'Url', field: 'shortId', startAt: 1000});
var Url = mongoose.model('Url', urlSchema);
module.exports = Url;

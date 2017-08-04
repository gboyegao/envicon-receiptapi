// receipt/models/receipt.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var receiptSchema   = new Schema({
    name: String,
    address:  String,
    receiptNumber: String,
    receiptDate: Date,
    item:[{
      name: String,
      quantity: String,
      unitPrice:String,
      amount:String
    }],
    total: String
  });

module.exports = mongoose.model('Receipt', receiptSchema);

"use strict"
// server.js

// BASE SETUP
// =============================================================================
//TO-DO:create mongo util
// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Receipt     = require('./models/receipt');


  var mongoose   = require('mongoose');
  mongoose.connect('mongodb://user:password@ds119220.mlab.com:19220/receipts',function (err,db) {
    if(err){
      console.log("Error connecting");
      process.exit(1);
    }
      console.log("Connected to Mongo");

  }); // connect to our database


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next){

 console.log('Request is being made');
 next();

});



// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


router.route('/receipts')

    // create a receipt (accessed at POST http://localhost:8080/api/receipts)
    .post(function(req, res) {
          var receipt = new Receipt();
             // create a new instance of the receipt model
        receipt.name = req.body.name;
        receipt.address = req.body.address;
        receipt.receiptNumber = req.body.receiptNumber;
        receipt.receiptDate = req.body.receiptDate;
        receipt.total = req.body.total;
        receipt.item = [];
        // var item = req.body.item;
        // var item = {"name":"","quantity":""};
        // item.name = "Oil";
        // item.quantity = "5";
         for (let i in req.body.item) {
              let item = req.body.item[i];
              let itemObj = { name: item['name'], quantity: item['quantity'], unitPrice: item['unitPrice'], amount: item['amount'] };
                receipt.item.push(itemObj);
            }

          // set the receipts name (comes from the request)

        // save the receipt and check for errors
        receipt.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Receipt created!' });
        });

    })


    // get all the receipts (accessed at GET http://localhost:8080/api/receipts)
  .get(function(req, res) {
      var receipt = new Receipt();
      Receipt.find(function(err, receipts) {
          if (err)
              res.send(err);

          res.json(receipts);
      });
  });


  router.route('/receipts/:receipt_id')

    // get the receipt with that id (accessed at GET http://localhost:8080/api/receipts/:receipt_id)
    .get(function(req, res) {
        Receipt.findById(req.params.receipt_id, function(err, receipt) {
            if (err)
                res.send(err);
            res.json(receipt);
        });
    })

    .put(function(req, res) {

        // use our receipt model to find the receipt we want
        Receipt.findById(req.params.receipt_id, function(err, receipt) {

            if (err)
                res.send(err);



            // save the receipt
            if (receipt !== null){
              // update the receipts info
              receipt.name = req.body.name;
              receipt.address = req.body.address;
              receipt.receiptNumber = req.body.receiptNumber;
              receipt.receiptDate = req.body.receiptDate;
              receipt.total = req.body.total;
              receipt.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'receipt updated!' });
            });
          }
          else
            {
              res.send('No Such item with that id');
            }

        });
    })
    // delete the receipt with this id (accessed at DELETE http://localhost:8080/api/receipts/:receipt_id)
   .delete(function(req, res) {
       Receipt.remove({
           _id: req.params.receipt_id
       }, function(err, receipt) {
           if (err)
               res.send(err);

           res.json({ message: 'Successfully deleted' });
       });
   });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

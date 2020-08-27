var express = require('express');
var router = express.Router();


/* GET to treatmentList */
router.get('/treatmentList', function (req, res) {
    var db = req.db;
    var collection = db.get('treatment');
    collection.find({}, {}, function (e,docs){
        res.json(docs);
    });
});

/* GET to treatmentList */
router.get('/treatment/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('treatment');

    var query = { _id: req.params.id }
    collection.findOne(query, function (e, docs){
        res.json(docs);
    });
});

/* POST to addTreatment */
router.post('/addTreatment', function (req, res) {
    var db = req.db;
    var collection = db.get('treatment');
    collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? { msg: result._id } : { msg: err }
        );
    });
});

/* UPDATE to editTreatment */
router.post('/editTreatment/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('treatment');

    var treatment = req.params;
    var query = { _id: treatment.id };
    var newValues = { $set: {
            start: treatment.start,
            end: treatment.end,
            text: treatment.age,
            doctor: treatment.sex,
            //TODO add drugs and treatments
        }
    };

    collection.updateOne(query, newValues, function(err, res) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/* DELETE to deleteTreatment */
router.delete('/deleteTreatment/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('treatment');
    var treatmentToDelete = req.params.id;
    collection.remove({ '_id' : treatmentToDelete }, function (err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
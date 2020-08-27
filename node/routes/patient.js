var express = require('express');
var router = express.Router();


/* GET to patientList */
router.get('/patientList', function (req, res) {
    var db = req.db;
    var collection = db.get('patient');
    collection.find({}, {}, function (e,docs){
        res.json(docs);
    });
});

/* GET to patientList */
router.get('/patient/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('patient');

    var query = { _id: req.params.id }
    collection.findOne(query, function (e, docs){
        res.json(docs);
    });
});

/* POST to addPatient */
router.post('/addPatient', function (req, res) {
    var db = req.db;
    var collection = db.get('patient');
    collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* UPDATE to editPatient */
router.post('/editPatient/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('patient');

    var id = req.params.id;
    var query = { _id : id };

    var newValues = { $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: req.body.age,
                sex: req.body.sex,
                drugs: req.body.drugs,
                treatments: req.body.treatments
            }
    };

    collection.update(
        query,
        newValues,
        function(err, result) {
            res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/* DELETE to deletePatient */
router.delete('/deletePatient/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('patient');
    var patientToDelete = req.params.id;
    collection.remove({ '_id' : patientToDelete }, function (err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
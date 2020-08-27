var express = require('express');
var router = express.Router();


/* GET to doctorList */
router.get('/doctorList', function (req, res) {
    var db = req.db;
    var collection = db.get('doctor');
    collection.find({}, {}, function (e,docs){
        res.json(docs);
    });
});

/* GET to doctorList */
router.get('/doctor/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('doctor');

    var query = { _id: req.params.id }
    collection.findOne(query, function (e, docs){
        res.json(docs);
    });
});

/* POST to addDoctor */
router.post('/addDoctor', function (req, res) {
    var db = req.db;
    var collection = db.get('doctor');
    collection.insert(req.body, function (err, result) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* UPDATE to editDoctor */
router.post('/editDoctor/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('doctor');

    var doctor = req.params;
    var query = { _id: doctor.id };
    var newValues = { $set: {
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                speciality: doctor.speciality,
            }
    };

    collection.updateOne(query, newValues, function(err, res) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/* DELETE to deleteDoctor */
router.delete('/deleteDoctor/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('doctor');
    var doctorToDelete = req.params.id;
    collection.remove({ '_id' : doctorToDelete }, function (err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
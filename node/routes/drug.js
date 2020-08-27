var express = require('express');
var router = express.Router();


/* GET to drugList */
router.get('/drugList', function(req, res) {
    var db = req.db;
    var collection = db.get('drug');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/* POST to addDrug */
router.post('/addDrug', function(req, res) {
    var db = req.db;
    var collection = db.get('drug');
    collection.insert(req.body, function(err, result) {
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* DELETE to deletePatient */
router.delete('/deleteDrug/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('drug');
    var drugToDelete = req.params.id;
    collection.remove({ '_id' : drugToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
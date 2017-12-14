var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

/**
 * Get the user corresponding to the userID
 */

router.get('/all', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		db.collections('users')
			.find({})
			.toArray(function(err, doc) {

			});
	});
});
router.get('/:id', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('users')
			.find({
				_id: parseInt(req.params.id)
			})
			.toArray(function (err, doc) {
			if (doc.length > 0){
				res.send(doc[0]);
			}
			else {
				res.send({});
			}
		});
		// db.collection('users').find({userId: req.params.id}).toArray(function (err, doc) {
		// 	var newSkills = !doc.skills ? skills : doc.skills.concat(skills);
		// 	console.log(doc);
		// 	db.collection('users').updateOne({userId: 1}, {$set: {skills: newSkills}});
		//
		// 	res.send(doc);
		// });
		// Insert some documents
	});
});

module.exports = router;
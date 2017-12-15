import express from 'express';
import { url } from '../utils/constants';
import { getUserById } from '../utils/user';

const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

router.get('/', (req, res) => {
	const getAllUsers = (db, callback) => {
		const collection = db.collection('users');
		collection.find({})
			.toArray((err, users) => {
				if (err) throw err;
				callback(users);
			});
	};
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		getAllUsers(db, (users) => {
			res.send(users.map(d => {
				delete d.skills;
				return d;
			}));
		})
	});
});

router.get('/:id', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		getUserById(db, req.params.id, (user) => {
			console.log(user);
			delete user.skills;
			res.send(user);
		});
	});
});

module.exports = router;

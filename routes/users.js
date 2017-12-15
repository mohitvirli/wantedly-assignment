import express from 'express';
import { url } from '../utils/constants';
import { getUserById } from '../utils/user';

const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

/**
 * Get all the users from the database
 */
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


/**
 * Add a user
 */
router.post('/add', function(req, res) {

	const addUser = (db, callback) => {
		const collection = db.collection('users');
		const user = req.body;
		user.skills = {};
		collection.insertOne(user, (err, doc) => {
			if (err) throw err;
			callback(doc);
		})
	};

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		addUser(db, (result) => {
			res.send(result);
		})
	});
});

/**
 * Get the user details corresponding to the id
 */
router.get('/:id', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		getUserById(db, req.params.id, (user) => {
			delete user.skills;
			res.send(user);
		});
	});
});

module.exports = router;

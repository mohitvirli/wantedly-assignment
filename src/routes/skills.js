import express from 'express';
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

import { url } from '../utils/constants';
import { getUserById, findById } from '../utils/user';
import { removeDuplicates } from '../utils/common';

/**
 * Get the user corresponding to the userID
 */

router.post('/endorse', function(req, res) {
	const updateSkills = (db, user, callback) => {
		let skills = user.skills;

		if (typeof skills[req.body.skillId] === 'undefined') {
			skills[req.body.skillId] = [
				"5a2b87e33af953386caf1c7c"
			];
		} else {
			skills[req.body.skillId].push("5a2b87e33af953386caf1c7d"); // add the loggedIn user
		}
		const collection = db.collection('users');
		collection.updateOne({
				_id: new ObjectId(req.body.userId)
			}, {
				$set: {
					skills: skills
				}
			}, (err, result) => {
				if (err) throw err;
				callback(result);
			});

	};
	MongoClient.connect(url, (err, db) => {
		if (err) throw err;
		getUserById(db, req.body.userId, (user) => {
			updateSkills(db, user, (result) => {
				db.close();
				res.send(result);
			});
		});
	});
});



router.get('/:userId', function(req, res) {

	const getUsers = (db, userList, callback) => {
		const collection = db.collection('users');
		collection.find({
				$or: userList
			})
			.toArray((err, users) => {
				if (err) throw err;
				callback(users);
			})
	};

	const getSkills = (db, skillList, users, callback) => {

		const skills = Object.keys(skillList).map(d => {
			return {
				_id: new ObjectId(d)
			}
		});

		const collection = db.collection('skills');
		collection.find({
				$or: skills
			})
			.toArray((err, skillDetails) => {
				if (err) throw err;
				const result = skillDetails.map(d => {
					const userList = skillList[d._id];
					return {
						skill: d,
						users : userList.map(id => {
							const user = findById(users, id);
							delete user.skills;
							return user;
						})
					}
				});
				callback(result);
			})
	};

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		getUserById(db, req.params.userId, (user) => {
			const userList = removeDuplicates(Object.values(user.skills)
				.reduce((d, acc) => d.concat(acc), []))
				.map(d => {
					return {
						_id: new ObjectId(d)
					}
				});

			getUsers(db, userList, (users) => {
				getSkills(db, user.skills, users, (result) => {
					res.send(result);
					// getUsers(db, users, )
				});
			})

		});
	});
});

export default router;
import express from 'express';
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

import { url } from '../utils/constants';
import { getUserById, findById } from '../utils/user';
import { removeDuplicates } from '../utils/common';


/**
* Add a skill for the current user
*/
router.post('/add', function(req, res) {

	const addSkillToDB = (db, callback) => {
		const collection = db.collection('skills');
		const skill = req.body.skill;
		collection.updateOne(skill, {
			$set: skill,
		}, {
			upsert: true
		}, (err, doc) => {
			if (err) throw err;
			callback(doc);
		})
	};

	const updateUser = (db, callback, skill) => {

		const setObj = {};
		setObj[`skills.${skill._id}`] = [];

		const collection = db.collection('users');
		collection.updateOne({
			_id: new ObjectId(req.body.userId)
		}, {
			$set: setObj,
		}, (err, result) => {
			if (err) throw err;
			callback(result);
		});
	};


	const addSkillUser = (db, callback) => {
		const collection = db.collection('skills');
		collection.findOne({
				name: req.body.skill.name
			}, (err, skill) => {
				if (err) throw err;
				console.log(skill);
				updateUser(db, callback, skill);
			});
	};

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;

		addSkillToDB(db, () => {
			addSkillUser(db, (result) => {
				res.send(result);
			});
		});
	});
});

/**
 * Endorse the user for the given skill ID
 * @param userId, the user Id of the user to be endorsed
 * @param skillId, the skill id of the skill to be endorsed
 */

router.post('/endorse', function(req, res) {
	const updateSkills = (db, user, callback) => {
		let skills = user.skills ? user.skills : {};
		if (req.body.endorse) {
			if (typeof skills[req.body.skillId] === 'undefined') {
				skills[req.body.skillId] = [
					req.body.ownerId
				];
			} else {
				skills[req.body.skillId].push(req.body.ownerId); // add the loggedIn user
			}
		} else {
			const skill = skills[req.body.skillId];
			skill.splice(skill.indexOf(req.body.ownerId), 1);
			skills[req.body.skillId] = skill;
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
				// if (result.ok)
				// 	res.send({success: true});
				// else
				// 	res.send({success: false});
			});
		});
	});
});

/**
 * Get the skill of the corresponding user
 * @param userId
 */

router.get('/:userId', function(req, res) {

	const getUsers = (db, userList, callback) => {
		const collection = db.collection('users');
		if (userList.length > 0) {
			collection.find({
				$or: userList
			})
				.toArray((err, users) => {
					if (err) throw err;
					callback(users);
				});
		} else {
			callback([]);
		}
	};

	const getSkills = (db, skillList, users, callback) => {

		const skills = Object.keys(skillList).map(d => {
			return {
				_id: new ObjectId(d)
			}
		});

		if (skills.length > 0) {
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
		} else {
			callback([]);
		}
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
					db.close();
					res.send(result);
					// getUsers(db, users, )
				});
			})

		});
	});
});

export default router;
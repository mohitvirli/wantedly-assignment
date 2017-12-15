const ObjectId = require('mongodb').ObjectID;

/**
 * Get the user from the database
 * @param db the database
 * @param id of the user
 * @param callback the callback function
 */
export const getUserById = (db, id, callback) => {
	const collection = db.collection('users');
	collection.findOne({
			_id: new ObjectId(id)
		}, (err, user) => {
			if (err) throw err;
			callback(user ? user : {});
		});
};

/**
 * Get the user from a list user
 * @param users, all the users from which the id is to selected
 * @param id
 */

export const findById = (users, id) => {
	return users.filter(d => {
			return d._id.toString() === id
		})[0];
};
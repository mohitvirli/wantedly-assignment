const ObjectId = require('mongodb').ObjectID;

export const getUserById = (db, id, callback) => {
	const collection = db.collection('users');
	collection.findOne({
			_id: new ObjectId(id)
		}, (err, user) => {
			if (err) throw err;
			callback(user ? user : {});
		});
};

export const findById = (users, id) => {
	return users.filter(d => {
			return d._id.toString() === id
		})[0];
};
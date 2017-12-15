import express from 'express';
const router = express.Router();

router.get('/', function(req, res) {
	res.render('profile', { title: 'My Profile' });
});

export default router;

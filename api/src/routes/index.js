const { Router } = require('express');

const transactions = require('./transactions');
const auth = require('./auth');


const router = Router();


router.use('/transactions', transactions);
router.use('/auth', auth);









module.exports = router;

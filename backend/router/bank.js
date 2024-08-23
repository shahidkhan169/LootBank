  const express = require('express');
  const router = express.Router();
  const auth = require('../middleware/auth');
  const {
    register,
    login,
    transfer,
    credit,
    checkBalance,
    getUserProfile,
    Transactions,
    updateUserProfile
  } = require('../controller/bank');

  router.post('/register', register);
  router.post('/login', login);
  router.post('/transfer', auth, transfer);
  router.post('/credit', auth, credit);
  router.post('/check-balance', auth, checkBalance);
  router.get('/profile', auth, getUserProfile);
  router.get('/transactions',auth,Transactions)
  router.put('/updateprofile',auth,updateUserProfile)

  module.exports = router;

const User = require('../models/bank');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

// Helper functions
const generateUsername = async (email) => {
    const usernameBase = email.split('@')[0];
    const randomNumbers = Math.floor(100 + Math.random() * 900);
    const username = `${usernameBase}${randomNumbers}`;

    const existingUser = await User.findOne({ userid: username });
    if (existingUser) {
        return generateUsername(email); // Recursive call if the username exists
    }

    return username;
};

const generateAccountNo = async () => {
    const prefix = '10000';
    const min = 100000;
    const max = 999999;

    const randomPart = Math.floor(Math.random() * (max - min + 1)) + min;
    const accountNo = `${prefix}${randomPart}`;

    const existingAccount = await User.findOne({ accountNo });
    if (existingAccount) {
        return generateAccountNo();
    }

    return accountNo;
};

// Route handler
module.exports.register = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            phoneNumber,
            dob,
            age,
            nationality,
            address,
            state,
            district,
            mpin,
            confirmMpin,
            password,
            confirmPassword
        } = req.body;

        // Validate all required fields
        if (!firstname || !lastname || !email || !phoneNumber ||!address || !dob || !age || !nationality || !state || !district || !mpin || !confirmMpin || !password || !confirmPassword) {
            return res.status(400).send('All fields are required');
        }

        // Validate age
        if (age < 18) {
            return res.status(400).send('You must be 18 years or older to register');
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).send('Password and Confirm Password do not match');
        }

        // Check if MPIN and confirmMpin match
        if (mpin !== confirmMpin) {
            return res.status(400).send('MPIN and Confirm MPIN do not match');
        }

        // Generate unique username and account number
        const userid = await generateUsername(email);
        const accountNo = await generateAccountNo();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set an initial account balance (if needed, you can adjust the default value)
        const accountBalance = 1000;

        // Create a new user instance
        const newUser = new User({
            firstname,
            lastname,
            email,
            phoneNumber,
            dob,
            age,
            address,
            nationality,
            state,
            district,
            mpin,
            password: hashedPassword,
            userid,
            accountNo,
            accountBalance
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success and the new user's details (excluding sensitive information)
        res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user: {
                firstname,
                lastname,
                email,
                userid,
                phoneNumber,
                dob,
                age,
                address,
                nationality,
                state,
                district,
                accountNo,
                accountBalance
            }
        });
    } catch (err) {
        // Handle duplicate key error (e.g., email or phone number already exists)
        if (err.code === 11000) {
            res.status(400).json({ message: 'Email or phone number already exists' });
        } else {
            // General error handling
            res.status(400).json({ message: 'Error creating user', error: err.message });
        }
    }
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('Invalid email');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Password incorrect');
        }

        // Token creation during login
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY); // Set an expiration time for security

        // Send the token in the Authorization header
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).json({ message: 'Login successful',token, route: '/profile' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


const verifyMpin = async (userId, mpin) => {
    const user = await User.findById(userId);
    return user && user.mpin === mpin;
};

module.exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({
            name: user.firstname + ' ' + user.lastname,
            userid:user.userid,
            email: user.email,
            accountNo: user.accountNo,
            phoneNumber:user.phoneNumber,
            dob:user.dob,
            age:user.age,
            address:user.address,
            nationality:user.nationality,
            state:user.state,
            district:user.district
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const { phoneNumber, dob, age, address, nationality, state, district } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update only fields that can be changed
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (dob) user.dob = dob;
        if (age) user.age = age;
        if (address) user.address = address;
        if (nationality) user.nationality = nationality;
        if (state) user.state = state;
        if (district) user.district = district;

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                name: user.firstname + ' ' + user.lastname,
                email: user.email,
                accountNo: user.accountNo,
                phoneNumber: user.phoneNumber,
                dob: user.dob,
                age: user.age,
                address: user.address,
                nationality: user.nationality,
                state: user.state,
                district: user.district
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
};

module.exports.transfer = async (req, res) => {
    try {
      const { amount, targetAccountNo, note, mpin } = req.body;
      const userId = req.userId;
  
      if (!userId) {
        return res.status(401).send('Unauthorized');
      }
  
      const user = await User.findById(userId);
      if (!user) return res.status(400).send('User not found');
  
      const transferAmount = parseFloat(amount);
  
      if (isNaN(transferAmount) || transferAmount <= 0) {
        return res.status(400).send('Invalid transfer amount');
      }
  
      if (!await verifyMpin(userId, mpin)) {
        return res.status(400).send('Incorrect MPIN');
      }
  
      const targetUser = await User.findOne({ accountNo: targetAccountNo });
      if (!targetUser) return res.status(400).send('Target account not found');
  
      if (user.accountBalance < transferAmount) {
        return res.status(400).send('Insufficient balance');
      }
  
      // Update account balances
      user.accountBalance -= transferAmount;
      targetUser.accountBalance += transferAmount;
      console.log("user:",user.accountBalance)
      console.log("target:",targetUser.accountBalance)
      await user.save();
      await targetUser.save();
  
      // Record transaction for the sender
      const senderTransaction = new Transaction({
        transactionId: generateTransactionId(),
        userId: user._id,
        amount: transferAmount,
        type: 'debit',
        reference: `${targetUser.firstname} ${targetUser.lastname}`,
        note,
        status: 'success'
      });
      await senderTransaction.save();
  
      // Record transaction for the receiver
      const receiverTransaction = new Transaction({
        transactionId: generateTransactionId(),
        userId: targetUser._id,
        amount: transferAmount,
        type: 'credit',
        reference: `${user.firstname} ${user.lastname}`,
        note,
        status: 'success'
      });
      await receiverTransaction.save();
  
      res.status(200).send('Transfer successful');
    } catch (error) {
      console.error('Error during transfer:', error); // Log the entire error object
      res.status(500).send('An internal server error occurred');
    }
  };
  


module.exports.credit = async (req, res) => {
    try {
        const { amount, mpin, note } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const user = await User.findById(userId);
        if (!user) return res.status(400).send('User not found');

        if (!await verifyMpin(userId, mpin)) {
            return res.status(400).send('Incorrect MPIN');
        }

        const creditAmount = parseFloat(amount);
        if (isNaN(creditAmount) || creditAmount <= 0) {
            return res.status(400).send('Invalid credit amount');
        }

        user.accountBalance += creditAmount;
        await user.save();

        // Record the transaction
        const transaction = new Transaction({
            transactionId: generateTransactionId(),
            userId: user._id,
            amount: creditAmount,
            type: 'credit',
            reference: user.firstname + ' ' + user.lastname,
            note,
            status: 'success'
        });

        await transaction.save();

        res.status(200).send('Credit successful');
    } catch (error) {
        res.status(500).send(error.message);
    }
};


module.exports.checkBalance = async (req, res) => {
    try {
        const userId = req.userId;
        const mpin = req.body.mpin;

        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const user = await User.findById(userId);
        if (!user) return res.status(400).send('User not found');

        if (!await verifyMpin(userId, mpin)) {
            return res.status(400).send('Incorrect MPIN');
        }

        res.status(200).json({ balance: user.accountBalance });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports.Transactions= async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        // Fetch all transactions for the current user
        const transactions = await Transaction.find({ userId }).sort({ timestamp: -1 });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).send('Failed to retrieve transactions');
    }
};

// Express route to handle logout


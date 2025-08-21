const usercontroller = require('../Controller/user.controller');
const express = require('express');
const {auth, restrictTo} = require('../middleware/user.auth');
const userRouter = express.Router();
// Define routes for user management
userRouter.post('/register', usercontroller.addUser); // Register a new user
userRouter.post('/login', usercontroller.login); // User login
userRouter.post('/:id', usercontroller.getUserById); // Get user by ID
userRouter.patch('/:id', auth, restrictTo('admin', 'user'), usercontroller.updateUserById); // Update user details
userRouter.delete('/:id', auth, restrictTo('admin', 'user'),usercontroller.deleteUserById); // Delete a user by ID
userRouter.get('/', auth, restrictTo('admin', 'user'),usercontroller.getAllUsers); // Get all users only for admin

module.exports = userRouter;

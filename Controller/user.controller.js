const userSchema = require('../Models/user.model');
const sessionStorage = require('../Models/session.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {promisify} = require('util');
const express = require('express');

const addUser = async (req, res) => {//post('/')
    let user = new userSchema(req.body);    
    try {
        let newUser = await user.save();
        res.status(201).json({message: "User created successfully", newUser});
    }catch (error) {
        res.status(400).json({ message: "Error creating user", error: error.message });
    }
}

const getAllUsers = async (req, res) => {//get('/') Admin only
    try {
        let users = await userSchema.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({message: "Error getting users", error});
    }
}

const getUserById = async (req, res) => {//post('/:id')
    try {
        const { id } = req.params;
        const { username, password } = req.body;
        let user = await userSchema.findById(id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        if (user.username !== username || !await bcrypt.compare(password, user.password)) {
            return res.status(403).json({message: "Unauthorized to access this user"});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: "Error getting user", error});
    }
}

const deleteUserById = async (req, res) => {//delete('/:id')
    const { id } = req.params;
    // const  { requestingId } = req.params;
    try {   
        const requestingId = req.user
        let requestingUser = await userSchema.findById(requestingId._id); 
        if (!requestingUser) {
            return res.status(404).json({message: "Requesting user not found"});
        }
        let user = await userSchema.findById(id);
        if (!user) {    
            return res.status(404).json({message: "User not found"});
       }
        if (requestingId.role === 'admin') {
            await sessionStorage.deleteMany({userId: id});
            await userSchema.findByIdAndDelete(id);
            return res.status(200).json({message: "User deleted successfully"});
        }
        // const {UserName, Password } = req.body;
        // if (requestingUser.username !== username || !await bcrypt.compare(password, requestingUser.password) || 
        // requestingId.toString() !== id.toString()) {
        //     return res.status(403).json({message: "Unauthorized to delete user"});
        // }
        await sessionStorage.deleteMany({userID: id});
        await userSchema.findByIdAndDelete(id);
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        res.status(400).json({message: "Error deleting user", error});
    }
}

const updateUserById = async (req, res) => {
    const { id } = req.params;
    // const { requestingId } = req.params;
    const requestingId = req.user._id;
    try {
        // let requestingUser = await userSchema.findById(requestingId);
        const requestingUser = req.user; 
        if (!requestingUser) {
            return res.status(404).json({message: "Requesting user not found"});
        }
        if (requestingUser.role === 'admin') {
            if (req.body.password && id.toString() === requestingId.toString()) {
                let salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            else {
                delete req.body.password; 
            }
            let { ...update }= req.body;
            let user = await userSchema.findByIdAndUpdate(id, update, {new: true});
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }
            return res.status(200).json({message: "User updated successfully", user});
        }
        let {UserName, Password, ...update } = req.body;
        if (requestingUser.username !== UserName || !await bcrypt.compare(Password, requestingUser.password) 
            || requestingId.toString() !== id.toString()) {
            return res.status(403).json({message: "Unauthorized to update user"});
        }
        if (update.password) {
            let salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(update.password, salt); 
        }        
        let user = await userSchema.findByIdAndUpdate(id, update, {new: true});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message: "User updated successfully", user});
    }catch (error) {
        res.status(400).json({message: "Error updating user", error});
    }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if(!username ||!password){
      return res.status(400).json({ error: 'not find user and password' });
    }
    
    const user = await userSchema.findOne({ username }).select("+password");
    if (!user){
         return res.status(400).json({ error: 'not find user' });
         }

    const Match = await bcrypt.compare(password, user.password);
    if (!Match) return res.status(400).json({ error: 'Invalid credentials' });

    // Create tokens here
    const accessToken = jwt.sign(
      { userId: user._id, role : user.role},
      process.env.JWT_TOKEN,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: '7d' }
    );

    res.json({ accessToken, refreshToken });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
    addUser,
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    login
};


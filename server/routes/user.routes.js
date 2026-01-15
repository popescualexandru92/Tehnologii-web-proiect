const { User } = require('../database/models');
const express = require('express');
const bcrypt = require('bcrypt');
const {verifyToken} = require('../utils/token.js');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const existingUser = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        if(existingUser) {
            return res.status(400).json({success: false, message: 'User already exists', data: {}});
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const user = await User.create({
            ...req.body,
            password: hashedPassword,
        })

        delete user.dataValues.password;

        res.status(201).json({success: true, message: 'User created successfully', data: user});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error creating user', data: error.message});
    }
})


router.put('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'User id is not valid', data: {}})
        }

        // Users can only update their own profile
        if (parseInt(id) !== userId) {
            return res.status(403).json({success: false, message: 'You can only update your own profile', data: {}})
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({success: false, message: 'User not found', data: {}})
        }

        // Check if email is being changed and if it's already taken
        if (req.body.email && req.body.email !== user.email) {
            const existingUser = await User.findOne({
                where: { email: req.body.email }
            });

            if (existingUser) {
                return res.status(400).json({success: false, message: 'Email already in use', data: {}})
            }
        }

        // Only allow updating specific fields
        const allowedUpdates = {};
        if (req.body.name) allowedUpdates.name = req.body.name;
        if (req.body.email) allowedUpdates.email = req.body.email;

        // Handle password change
        if (req.body.newPassword) {
            // Verify current password
            if (!req.body.currentPassword) {
                return res.status(400).json({success: false, message: 'Current password is required to change password', data: {}})
            }

            const isPasswordValid = bcrypt.compareSync(req.body.currentPassword, user.password);
            
            if (!isPasswordValid) {
                return res.status(400).json({success: false, message: 'Current password is incorrect', data: {}})
            }

            // Hash new password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.newPassword, salt);
            allowedUpdates.password = hashedPassword;
        }

        const updatedUser = await user.update(allowedUpdates);

        delete updatedUser.dataValues.password;

        res.status(200).json({success: true, message: 'User updated successfully', data: updatedUser});
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({success: false, message: 'Error updating user', data: error.message});
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'User id is not valid', data: {}})
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({success: false, message: 'User not found', data: {}})
        }

        await user.destroy();

        res.status(200).json({success: true, message: 'User successfully deleted', data: {}});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error deleting user', data: error.message});
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ['password']
            }
        });

        res.status(200).json({success: true, message: 'Users retrieved successfully', data: users});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error retrieving users', data: error.message});
    }
})

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'User id is not valid', data: {}})
        }

        const user = await User.findByPk(id, {
            attributes: {
                exclude: ['password']
            }
        });

        if (!user) {
            return res.status(404).json({success: false, message: 'User not found', data: {}})
        }

        res.status(200).json({success: true, message: 'User was found', data: user})
    } catch (error) {
        res.status(500).json({success: false, message: 'Error retrieving user', data: error.message});
    }
})


module.exports = router;
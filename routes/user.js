// DEPENDENCIES
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const config = require('.././config/database');
    const User = require('../models/user');

// CREATE USER
    router.post( '/', ( req, res, next ) => {
        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: bcrypt.hashSync( req.body.password, 10),
            email: req.body.email
        });

        User.count( {}, (err, count ) => {
            if ( count === 0 ) {
                newUser.admin = true;
                console.log( 'User admin set to: ' + newUser.admin );
            } else {
                newUser.admin = false;
                console.log( 'User admin set to ' + newUser.admin );
            }
        });

        newUser.save( ( err, createdUser ) => {
            if ( err ) { 
                return res.status( 500 ).json({ success: false, msg: 'Failed to register user.', error: err });
            } else {
                res.status(201).json({ success: true, msg: 'User registered', user: createdUser });
            }
        });
    });


// LOG IN USER
    router.post( '/login', ( req, res, next ) => {
        User.findOne( { userName: req.body.userName }, ( err, foundUser ) => {
            
            if ( err ) { 
                return res.status( 500 ).json({ success: false, msg: 'Error logging in User, N/A', error: err });
            }
            
            if ( !foundUser ) {
                return res.status( 500 ).json({ success: false, msg: 'User not found' });
            }

            if ( !bcrypt.compareSync( req.body.password, foundUser.password) ) {
                return res.status( 401 ).json({ success: false, msg: 'Login failed. Login fields do not match' });
            }
            
            let userToken = jwt.sign({ user: foundUser }, config.secret, { expiresIn: 7200 });

            res.status( 200 ).json({ 
                success: true, 
                msg: 'Successfully logged in.', 
                token: userToken, 
                user: {
                    id: foundUser._id,
                    userName: foundUser.userName,
                    email: foundUser.email,
                    lastName: foundUser.lastName,
                    firstName: foundUser.firstName,
                    image: foundUser.image,
                    services: foundUser.services
                } 
            });
        });
    });


// FETCH USER PROFILE
    router.get('/:id', ( req, res, next ) => {
        User.findById( req.params.id, ( err, foundUser ) => {
            if ( err ) {
                return res.status( 500 ).json({ success: false, msg: 'Cannot retreive User profile', error: err });
            } else {
                res.status( 200 ).json({ success: true, msg: 'User profile retrieved.', user: foundUser });
            }
        });
    });

// EXPORT THE ROUTER
    module.exports = router;
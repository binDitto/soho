// DEPENDENCIES
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

// IMPORT MODELS TO USE
    const User = require('../models/user');

// IMPORT CONFIG SECRET PASSCODE
    const config = require('.././config/database');

// CREATE USER
    router.post( '/', registerUser );

    /* Register User Function */
    function registerUser ( req, res, next ) {

        const body = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: bcrypt.hashSync(req.body.password, 10),
            email: req.body.email
        };

        const user = new User( body );

        User.count( {}, setAdmin );

        function setAdmin ( err, count ) {
            if ( count === 0 ) {
                user.admin = true;
                console.log( 'User admin set to ' + user.admin );
            } else {
                user.admin = false;
                console.log( 'User admin set to ' + user.admin );
            }
        }

        user.save( errResCallback );

        function errResCallback ( err, createdUserRes ) {

            const errorObj = {
                title: 'Error creating User to db',
                error: err
            };

            const userObj = {
                message: 'User successfully registerd to the database!',
                user: createdUserRes
            };

            if ( err ) { return res.status(500).json(errorObj); }

            res.status( 201 ).json( userObj );
        }
    }

// LOG IN USER
    router.post( '/login', loginUser );

    function loginUser ( req, res, next ) {
        User.findOne( { email: req.body.email }, authenticateLogin );
        function authenticateLogin ( err, foundUser ) {

            const errorObj = {
                title: 'Error logging in User, N/A',
                error: err
            };

            const noneFound = {
                title: 'Login failed.',
                error: { message: 'Invalid login credentials' }
            };

            const notMatched = {
                title: 'Login failed. Login fields are wrong',
                error: { message: 'Invalid login credentials' }
            };

            const comparePasswords = bcrypt.compareSync( req.body.password, foundUser.password );

            if ( err ) { return res.status(500).json(errorObj); }

            if ( !foundUser ) { return res.status(500).json(noneFound); }
            
            if ( !comparePasswords ) { return res.status(401).json(notMatched); }

            /* Entered fields match a found User */

            let foundUserToken = jwt.sign( { user: foundUser }, config.secret, { expiresIn: 7200 } );

            const loggedInObj = {
                message: 'Successfully logged In',
                token: foundUserToken,
                user: foundUser
            };

            res.status(200).json(loggedInObj);

        }
    }

// FETCH A SINGLE USER 
    router.get('/:id', fetchUser);

    function fetchUser ( req, res, next ) {

        User.findById( req.params.id, returnUser);

        function returnUser ( err, foundUser ) {
            const cantFetch = {
                title: 'Cannot retrieve user profile',
                error: err
            };
            const canFetch = {
                message: 'User Profile retrieved',
                user: foundUser
            };

            if ( err ) { return res.status(500).json(cantFetch); }
            res.status(200).json(canFetch);
        }

    }

// EXPORT THE ROUTER
    module.exports = router;
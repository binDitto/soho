// DEPENDENCIES 
    const express = require('express');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const fs = require('fs');
    const config = require('.././config/database');
    const User = require('../models/user');
    const Service = require('../models/service');


// INITIALIZE ROUTER
    const router = express.Router();

    // GET ALL
        router.get( '/', ( req, res, next ) => {
            Service.find().sort({ createdAt: -1 }).populate('user').exec(
                ( err, foundServices ) => {
                    if ( err ) {
                        return res.status( 500 ).json({ success: false, msg: 'An error occurred fetching services.', error: err });
                    } else {
                        res.status( 200 ).json({ success: true, msg: 'Success! Services fetched!', services: foundServices });
                    }
                }
            );
        });


    // ROUTE AUTHENTICATION - MAKE SURE VALID USER LOGGED IN FOR CRUD
        router.use( '/', ( req, res, next ) => {
            jwt.verify( req.query.token, config.secret, ( err, verifiedToken ) => {
                if ( err ) {
                    return res.status( 401 ).json({ success: false, msg: 'Authentication failed!', error: err });
                }

                next();
            });
        });
    
    // MULTER IMPLEMENTATION - storing files to disk storage
        const multer = require('multer');

        const storage = multer.diskStorage({
            destination: ( req, file, cb ) => { 
                // cb( null, 'public/assets/images/services' ) 
                cb( null, 'soho-app/src/assets/images/services' ) 
            },
            filename: (req, file, cb) => { 
                cb( null, file.fieldname + '-' + Date.now() + '.jpg' ) 
            }
        });

        const upload = multer({ storage: storage });

    
    // POST SERVICE DATA
        router.post( '/', upload.single('serviceImage'), ( req, res, next ) => {
            let decodedToken = jwt.decode( req.query.token );
            User.findById( decodedToken.user._id.toString(), ( err, loggedInUser ) => {
                if ( err ) { 
                    return res.status( 500 ).json({ success: false, msg: 'Error locating service user info.', error: err });
                }

                let service = new Service({
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description,
                    category: req.body.category,
                    user: loggedInUser,
                    image: req.file
                });

                service.save( ( err, savedService ) => {
                    if ( err ) {
                        return res.status( 500 ).json({ success: false, msg: 'Error saving service to db.', error: err });
                    } else {
                        loggedInUser.services.push( savedService );
                        loggedInUser.save();

                        res.status( 201 ).json({ success: true, msg: 'Service saved to db.', obj: savedService });
                    }
                });
            });
        });

        
    // PATCH 
        router.patch('/:id', upload.single('serviceImage'), ( req, res, next ) => {
            let decodedToken = jwt.decode( req.query.token );
            let serviceId = req.params.id;

            Service.findById( serviceId, ( err, serviceToEdit) => {
                if ( err ) { return res.status( 500 ).json({ success: false, msg: 'Error retrieving service to edit', error: err }); }
                if ( !serviceToEdit ) { return res.status( 500 ).json({ success: false, msg: 'Error, service not found' }); } 
                if ( serviceToEdit.user.toString() !== decodedToken.user._id.toString() ) { return res.status( 401 ).json({ success: false, msg: 'Not same User' }); }

                let pathBeforeEdit = serviceToEdit.image ? serviceToEdit.image.path : '';
                

                serviceToEdit.name          =   req.body.name;
                serviceToEdit.price         =   req.body.price;
                serviceToEdit.description   =   req.body.description;
                serviceToEdit.category      =   req.body.category;
                if ( req.file ) {
                serviceToEdit.image         =   req.file;
                }
                

                serviceToEdit.save( ( err, updatedService ) => {
                    if ( err ) { return res.status( 500 ).json({ success: false, msg: 'Error: Cannot update/edit service', error: err }); }
                    
                    if ( updatedService.image ) {
                        if (updatedService.image.path !== pathBeforeEdit) {
                            fs.stat(pathBeforeEdit, (err, stats) => {
                                console.log(stats);

                                if (err) {
                                    return console.error(err);
                                } else {
                                    fs.unlink(pathBeforeEdit, (err) => {
                                        if (err) {
                                            return console.log(err);
                                        } else {
                                            console.log('Old image removed from disk before adding new image!');
                                        }
                                    });
                                }

                            });
                        }
                    }
                    
                    res.status( 200 ).json({ success: true, msg: 'Service successfully updated!', service: updatedService });
                });
            });
        });

    
    // DELETE
        router.delete( '/:id', ( req, res, next ) => {
            let decodedToken = jwt.decode( req.query.token );
            let serviceId = req.params.id;

            Service.findById( serviceId, ( err, serviceToDelete ) => {

                if ( err ) { return res.status( 500 ).json({ success: false, msg: 'An error occurred retrieving service for deletion', error: err }); }
                if ( !serviceToDelete ) { return res.status( 500 ).json({ success: false, msg: 'Error, no service found to delete' }); }
                if ( serviceToDelete.user.toString() !== decodedToken.user._id ) {
                    console.log(decodedToken);
                    console.log(serviceToDelete.user);
                    return res.status( 401 ).json({ success: false, msg: 'Not same User.'});
                }

                serviceToDelete.remove(( err, deletedService ) => {
                    if ( err ) { 
                        return res.status( 500 ).json({ success: false, msg: 'Could not delete service.', error: err }); 
                    } 
                    if ( deletedService.image ) {

                        fs.stat(deletedService.image.path, (err, stats) => {
                            console.log(stats);
                            if (err) { return console.error(err); }

                            fs.unlink(deletedService.image.path, (err) => {
                                if (err) {
                                    console.log('Image removed from disk.');
                                    return console.error(err);
                                }
                            });
                        }); 
                    }

                    res.status(200).json({ success: true, msg: 'Service deleted from db', obj: deletedService });
                });

            });
        });

       

// EXPORT ROUTER
    module.exports = router;
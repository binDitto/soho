// DEPENDENCIES 
    const express = require('express');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const fs = require('fs');

// IMPORT MODELS TO USE
    const User = require('../models/user');
    const Service = require('../models/service');

// IMPORT CONFIG
    const config = require('.././config/database');

// INITIALIZE ROUTER
    const router = express.Router();

    // GET ALL
        router.get( '/', retrieveReqServ );

        function retrieveReqServ ( req, res, next ) {
            Service.find().sort({ createdAt: -1 })
                   .populate('user')
                   .exec(
                       (err, fetchedServicesRes) => {
                           if (err) {
                               return res.status( 500 ).json({
                                   title: 'An error occurred fetching services data',
                                   error: err
                               });
                           }

                           res. status(200).json({
                               message: 'Success! Services fetched!',
                               obj: fetchedServicesRes
                           });
                       }
                   );
        }


    // ROUTE AUTHENTICATION - MAKE SURE VALID USER LOGGED IN FOR CRUD
        router.use( '/', authenticate );

        function authenticate ( req, res, next ) {
            jwt.verify(req.query.token, config.secret, decodedTokenRes );

            function decodedTokenRes ( err, decodedToken ) {
                if ( err ) {
                    return res.status(401).json({
                        title: 'Authentication failed, cannot pass',
                        error: err
                    });
                }
                
                next();
            }
        }

    
    // MULTER IMPLEMENTATION - storing files to disk storage
        const multer = require('multer');

        const storage = multer.diskStorage({
            destination: ( req, file, cb ) => { 
                cb( null, 'public/assets/images/services' ) 
            },
            filename: (req, file, cb) => { 
                cb( null, file.fieldname + '-' + Date.now() + '.jpg' ) 
            }
        });

        const upload = multer({ storage: storage });

    
    // POST SERVICE DATA
        router.post( '/', upload.single('serviceImage'), registerService );

        function registerService ( req, res, next ) {

            let decodedToken = jwt.decode(req.query.token);

            User.findById( decodedToken.user._id, addUserToService );

            function addUserToService ( err, loggedInUser ) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred locating service user information',
                        error: err
                    });
                }

                const body = {
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description,
                    category: req.body.category,
                    user: loggedInUser,
                    image: req.file
                };

                let service = new Service( body );

                service.save( createServiceResCallBack );

                function createServiceResCallBack ( err, createdServiceObj ) {
                    if ( err ) {
                        return res. status(500).json({
                            title: 'An error occurred registering service to database',
                            error: err
                        });
                    }

                    loggedInUser.services.push(createdServiceObj);
                    loggedInUser.save();

                    res.status(201).json({
                        message: 'Service saved to DB',
                        obj: createdServiceObj
                    });
                }
            }
        }

    // PATCH 
        router.patch ('/:id', upload.single('serviceImage'), editService );

        function editService ( req, res, next ) {
            let decodedToken = jwt.decode( req.query.token );
            let serviceId = req.params.id;

            Service.findById(serviceId, editServiceRes );

            function editServiceRes ( err, serviceToEdit ) {
                if ( err ) {
                    return res.status(500).json({
                        title: 'An error occurred retrieving the requested service to edit',
                        error: err
                    });
                }

                if ( !serviceToEdit ) {
                    return res.status(500).json({
                        title: 'Error, service not found',
                        error: { message: 'Service not found' }
                    });
                }

                if ( serviceToEdit.user !== decodedToken.user._id ) {
                    return res.status(401).json({
                        title: 'Not Service author cannot edit',
                        error: { message: 'You are not user of this service' }
                    });
                }

                const pathBeforeEdited = serviceToEdit.image.path;

                serviceToEdit.name = req.body.name;
                serviceToEdit.price = req.body.price;
                serviceToEdit.description = req.body.description;
                serviceToEdit.category = req.body.category;
                serviceToEdit.image = req.file;

                if ( serviceToEdit.image.path !== pathBeforeEdited ) {
                    fs.stat(pathBeforeEdited, deleteImage);
                }

                function deleteImage ( err, stats ) {
                    console.log(stats);

                    if ( err ) {
                        return console.error(err);
                    }

                    fs.unlink( pathBeforeEdited, ( err ) => {
                        if ( err ) {
                            return console.log( err );
                        }

                        console.log( 'Old image removed from disk before adding new image!');
                    });
                }

                serviceToEdit.save((err, editedServiceObj) => {
                    if ( err ) {
                        return res.status(500).json({
                            title: 'An error occurred updating/editing the service',
                            error: err
                        });
                    }

                    res.status(200).json({
                        message: 'Service and image updated!',
                        obj: editedServiceObj
                    });

                });
            }
        }

    
    // DELETE
        router.delete( '/:id', deleteService );

        function deleteService ( req, res, next ) {
            let decodedToken = jwt.decode( req.query.token );
            let serviceId = req.params.id;

            Service.findById( serviceId, (err, serviceToDelete ) => {
                if ( err ) {
                    return res.status(500).json({
                        title: 'An error occurred retrieving service for deletion',
                        error: err
                    });
                }

                if ( !serviceToDelete ) {
                    return res.status(500).json({
                        title: 'An error occurred, no service found to delete',
                        error: { message: 'Service not found' }
                    });
                }

                if ( serviceToDelete.user !== decodedToken.user._id ) {
                    return res.status(401).json({
                        title: 'Not authenticated, cannot delete service',
                        error: { message: 'Users do not match' }
                    });
                }

                fs.stat( serviceToDelete.image.path, deleteImage );
                    function deleteImage ( err, stats ) {
                        console.log( stats );

                        if ( err ) {
                            return console.error( err );
                        }

                        fs.unlink( serviceToDelete.image.path, ( err ) => {
                            if ( err ) return console.log(err);
                            console.log('image successfully deleted from diskStorage!');
                        });
                    }

                serviceToDelete.remove(( err, deletedServiceObj) => {
                    if ( err ) {
                        return res.status(500).json({
                            title: 'An error occurred deleting service data',
                            error: err
                        });
                    }

                    res.status(200).json({
                        message: 'Service deleted!',
                        obj: deletedServiceObj
                    });
                });

            });
        }

// EXPORT ROUTER
    module.exports = router;
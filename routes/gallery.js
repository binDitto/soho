// DEPENDENCIES
    const express = require('express');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

// IMPORT MODELS
    const User = require('../models/user');
    const Image = require('../models/image');

// IMPORT CONFIG
    const config = require('../config/database');

// SET ROUTER 
    const router = express.Router();


    // GET ALL
    router.get('/', getAll);

        function getAll ( req, res, next ) {
            Image.find().sort({ createdAt: -1 })
                 .populate('user')
                 .exec(
                     ( err, fetchedImagesArray ) => {
                         if ( err ) {
                             return res.status(500).json({
                                title: 'An error occurred getting all images from db',
                                error: err
                             });
                         }

                         res.status(200).json({
                            message: 'Success! All images fetched!',
                            obj: fetchedImagesArray
                         });
                     }
                 );
        }

    // ROUTE AUTHENTICATION - WON'T ALLOW CRUD UNLESS ORIGINAL IMAGE
    router.use('/', verifyToken );

        function verifyToken ( req, res, next ) {
            if ( err ) {
                return res.status(401).json({
                    title: 'Not authenticated, cannot pass',
                    error: err
                });
            }

            next();
        }

    // MULTER
    const multer = require('multer');

    const storage = multer.diskStorage({
        destination: ( req, file, cb ) => {
            cb( null, 'public/assets/images/gallery/')
        },
        filename: ( req, file, cb ) => {
            cb( null, file.fieldname + '-' + Date.now() + '.jpg')
        }
    });

    const upload = multer({ storage: storage });

    // POST 
    router.post('/', upload.single('galleryImage'), createImageData );

        function createImageData ( req, res, next ) {
            let decodedtoken = jwt.decode( req.query.token );

            User.findById( decodedtoken.user._id, addUserToImage );
                function addUserToImage ( err, userCreatingImage ) {
                    if ( err ) {
                        return res.status(500).json({
                            title: 'Error locating User.',
                            error: err
                        });
                    }

                    const body = {
                        description: req.body.description,
                        file: req.file,
                        category: req.body.category,
                        user: userCreatingImage
                    };

                    let image = new Image( body );
                        image.save(( err, createdImageObj ) => {
                            if ( err ) {
                                return res.status(500).json({
                                    title: 'An error occurred registering the service to the db',
                                    error: err
                                });
                            }

                            userCreatingImage.images.push( createdImageObj );
                            userCreatingImage.save();

                            res.status(201).json({
                                message: 'Image saved to DB',
                                obj: createdImageObj
                            });
                        });
                }
        }

    // PATCH
    router.patch('/:id', upload.single('galleryImage'), editImage);

        function editImage ( req, res, next ) {
            let decodedToken = jwt.decode( req.query.token );
            let imageId = req.params.id;
            Service.findById( imageId, editImageRes);
                function editImageRes ( err, imageToEdit ) {
                    if ( err ) {
                        return res.status(500).json({
                            title: 'Error, cannot find image to edit',
                            error: err
                        });
                    }

                    if ( !imageToEdit ) {
                        return res.status(500).json({
                            title: 'Error, no image found for editing',
                            error: { message: 'Image not found' }
                        });
                    }

                    if ( imageToEdit.user !== decodedToken.user._id ) {
                        return res.status(401).json({
                            title: 'Not creator, cannot edit',
                            error: { message: 'You are not creator, go away'}
                        });
                    }

                    const pathBeforeEdited = imageToEdit.file.path;

                    imageToEdit.description = req.body.description;
                    imageToEdit.file = req.file;
                    imageToEdit.category = req.body.category;

                    if ( imageToEdit.file.path !== pathBeforeEdited ) {
                        fs.stat( pathBeforeEdited, deleteImage);
                            function deleteImage ( err, stats ) {
                                console.log(stats);
                                if ( err ) {
                                    return console.error(err);
                                }

                                fs.unlink( pathBeforeEdited, ( err ) => {
                                    if ( err ) return console.log(err);
                                    console.log('Old Image deleted before replacing with new Image');
                                });
                            }
                    }

                    imageToEdit.save(( err, editedImageObj ) => {
                        if ( err ) { 
                            return res.status(500).json({
                                title: 'An error occurred updating image',
                                error: err
                            });
                        }

                        res.status(200).json({
                            message: 'Image updated!',
                            obj: editedImageObj
                        });
                    });
                }
        }

    // DELETE
    router.delete( '/:id', deleteImage );

        function deleteImage ( req, res, next ) {
            let decodedToken = jwt.decode(req.query.token);
            let imageId = req.params.id;

            Image.findById( imageId, deleteImageRes );
                function deleteImageRes ( err, imageToDelete ) {
                    if ( err ) {
                        return res.status(500).json({
                            title: 'An error occurred retrieving image for deletion',
                            error: err
                        });
                    }

                    if ( !imagetoDelete ) {
                        return res.status(500).json({
                            title: 'Error, no image found for deletion',
                            error: { message: 'Image not found' }
                        });
                    }

                    if ( imageToDelete.user !== decodedToken.user._id ) {
                        return res.status(401).json({
                            title: 'Not creator, cannot delete',
                            error: { message: 'Users of image do not match'}
                        });
                    }

                    fs.stat( imageToDelete.file.path, deleteImageToDelete);
                        function deleteImageToDelete ( err, stats ) {
                            console.log(stats);

                            if ( err ) {
                                return console.error(err);
                            }

                            fs.unlink(imageToDelete.file.path, ( err ) => {
                                if ( err ) return console.log(err);
                                console.log('Image removed from diskStorage!');
                            });
                        }

                    imageToDelete.remove(( err, deletedImageObj ) => {
                        if ( err ) {
                            return res.status(500).json({
                                title: 'An error occurred deleting image data from db',
                                error: err
                            });
                        }

                        res.status(200).json({
                            message: 'Image data deleted',
                            obj: deletedImageObj
                        });
                    });
                }
        }
// EXPORT ROUTER
    module.exports = router;
    
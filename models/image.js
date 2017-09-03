// DEPENDENCIES
    const mongoose = require('mongoose');
    const uniqueValidator = require('mongoose-unique-validator');
    const updatedAt = require('mongoose-updated_at');

// IMAGE SCHEMA

    const ImageSchema = mongoose.Schema({
        description: { required: true, type: String },
        file: { type: Object, required: true },
        category: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: { type: Date, default: Date.now }
    });

    ImageSchema.plugin(uniqueValidator);
    ImageSchema.plugin(updatedAt);

// REMOVE IMAGE FROM USER IMAGES ARRAY UPON DELETION

    ImageSchema.post('remove', removeImageFromUser);

    function removeImageFromUser (image) {

        User.findById(image.user, pullFromUser);

        function pullFromUser ( err, returnedUser ) {
            returnedUser.images.pull(image);
            returnedUser.save();
        }
    }

// EXPORT SCHEMA
    module.exports = mongoose.model('Image', ImageSchema);
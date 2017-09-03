// DEPENDENCIES
    const mongoose = require('mongoose');
    const uniqueValidator = require('mongoose-unique-validator');

// CREATE USER SCHEMA

    const UserSchema = new mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        userName: { type: String, required: true },
        password: { type: String, required: true },
        admin: { type: Boolean },
        email: { type: String, required: true, unique: true },
        services: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }],
        images: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image'
        }],
        createdAt: { type: Date, default: Date.now }
    });

    UserSchema.plugin(uniqueValidator);

// EXPORT THE MODEL
    module.exports = mongoose.model('User', UserSchema);
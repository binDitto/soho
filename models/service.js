// DEPENDENCIES
    const mongoose = require('mongoose');
    const uniqueValidator = require('mongoose-unique-validator');
    const updatedTimeStamp = require('mongoose-updated_at');

// SERVICE SCHEMA
    const ServiceSchema = new mongoose.Schema({
        name: { type: String, unique: true, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        image: { type: Object, required: true },
        createdAt: { type: Date, default: Date.now }
    });

    ServiceSchema.plugin(uniqueValidator);
    ServiceSchema.plugin(updatedTimeStamp);

// REMOVE SERVICE FROM USER SERVICE ARRAY UPON DELETION
    ServiceSchema.post('remove', pullServiceFromUser);
    
    function pullServiceFromUser (service) {

        User.findById(service.user, serviceRemoval);

        function serviceObject (err, returnedUser){
            returnedUser.services.pull(service);
            returnedUser.save();
        }
    }

// EXPORT SCHEMA
    module.exports = mongoose.model('Service', ServiceSchema);
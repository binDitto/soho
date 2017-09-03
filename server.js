// DEPENDENCIES
    const express = require('express');
    const path = require('path');
    const bodyParser = require ('body-parser');
    const cors = require('cors');
    const mongoose = require('mongoose');

// INITIALIZE NODE APP
    const app = express();

// CONNECT TO MONGODATABASE OR MONGOLAB
    const config = require('./config/database');

    mongoose.connect(config.database);
        /* Check for connection errors */
        mongoose.connection.on('connected', connected);
        mongoose.connection.on('error', cantconnect);
        
        function connected () { console.log('Connected to database ' + config.database); }
        function cantconnect (err) { console.log('Database Error: ' + err); }

// ESTABLISH DEV AND HEROKU PROD PORTS
    const port = process.env.PORT || 8080;

// USE 'CORS' FOR SETTING HEADERS -ALLOWS MAKING REQUEST FROM DIFFERENT DOMAIN NAME
    app.use(cors());

// SET STATIC FOLDER - THIS WILL BE FOLDER APP WILL BE PULLED FROM
    app.use(express.static(path.join(__dirname, 'public')));

// PARSE REQUEST DATA INTO JSON FORMAT TO USE WITH NODE APP
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

// CONNECT ROUTS FOR USE 
    const userRoutes = require('./routes/user');
    const serviceRoutes = require('./routes/service');
    const galleryRoutes = require('./routes/gallery');

    app.use('/users', userRoutes);
    app.use('/services', serviceRoutes);
    app.use('/gallery', galleryRoutes);

    function invalid (req, res) { res.send('Invalid Endpoint'); }
    function reroute (req, res) { res.sendFile(path.join(__dirname, 'public/index.html')) }

    /* If backend main '/' is trying to be accessed from front-end, send something */
    app.get('/', invalid);
    app.get('*', reroute);

    

// START SERVER -- 'npm start' (as specified in node package.json)
    app.listen(port, listening);
    function listening () { console.log('Server is online! Listening on port ' + port) }
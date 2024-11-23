const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const process = require('process')
// Initialize the Express server
const server = express();




server.use(function(req, res, next){
    var whitelist = ['localhost:5000', 'localhost:3000', 'dega-8.com']
    var host = req.get('host');
     
    whitelist.forEach(function(val, key){
      if (host.indexOf(val) > -1){
       res.setHeader('Access-Control-Allow-Origin', host);
      }
    })
    next();
    });


// Assume we have the server origin current working directory
const serverOrigin = process.cwd();

// Middleware to parse Raw Files bodies
server.use(express.raw({ type: 'application/octet-stream', limit: '12mb' })); // For raw file uploads


// Set the constant path to pico8.dat if it's fixed
const PICO8_DAT_PATH = path.join(serverOrigin, 'public', 'Pic0-8', 'pico8.dat');


//TODONE add /upload for saving dat file locally


server.post('/upload', function ( req, res){

    // const { file } = Buffer.from(req.body);
    console.log('Server receieved file');

 // Convert Buffer (req.body) to ArrayBuffer
 const arrayBuffer = req.body.buffer.slice(req.body.byteOffset, req.body.byteOffset + req.body.byteLength);

 // Wrap the ArrayBuffer in a DataView
 const dataView = new DataView(arrayBuffer);

    const filename = req.headers['x-filename'];
    console.log(filename);

    const DatCheck = path.extname(filename);
    console.log(DatCheck);
    if(DatCheck === '.dat'){
    fs.writeFile(PICO8_DAT_PATH, dataView,'utf8', (writeErr) => {
        if (writeErr) {
            console.error(`Error writing file ${PICO8_DAT_PATH}:`, writeErr);
            return res.status(500).send('Failed to save Dat file');
        }
      })
      res.send('File uploaded successfully.')
    };

});



// Handle all other routes with a 405 Method Not Allowed
server.all('*', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed' });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


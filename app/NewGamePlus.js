
//Deprecated CODE to be moved;



// // Retrieve JavaScript content from local storage
// const gameCode = localStorage.getItem("gameJsFile");

// let LocalJSblob
// if (gameCode) {
//     // Create a Blob from the JavaScript content
//     const blob = new Blob([gameCode], { type: "application/javascript" });
//      LocalJSblob = URL.createObjectURL(blob);

    
// } else {
//     console.error("Game JS code not found in local storage.");
// }

// Import necessary modules

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

// Middleware to parse JSON bodies
server.use(express.json({ limit: '50mb' })); // Adjust limit as needed


// Define the /convertP8 route
server.post('/convertP8', function (req, res) {
    const { P8code } = req.body;
    console.log(P8code);
    const inputPath = path.join(serverOrigin, 'public', 'Pic0-8', 'degademo.p8');

    const outputPath = path.join(serverOrigin, 'public', 'Pic0-8', 'degademo.js');
// Compute the relative path from server origin to target
const relativeP8Path = path.relative(serverOrigin, inputPath);
const relativeJSPath = path.relative(serverOrigin, outputPath);
console.log('Relative path:', relativeP8Path); // Outputs: public/Pic0-8/degademo.p8
console.log('Relative path:', relativeJSPath); // Outputs: public/Pic0-8/degademo.js





    console.log(`Input path: ${inputPath}, Output path: ${outputPath}, DAT path: ${PICO8_DAT_PATH}`);

    // Write P8 code into .p8 file
    fs.writeFile(inputPath, P8code, 'utf8', (writeErr) => {
        if (writeErr) {
            console.error(`Error writing file ${inputPath}:`, writeErr);
            return res.status(500).send('Failed to save file');
        }
      });
        // Run the Shrinko8 command
        const pythonProcess = spawn('python', [
            path.join(serverOrigin, 'src','core','plugins','shrinko8-main','shrinko8.py'),
            inputPath,
            outputPath,
            '--pico8-dat',
            PICO8_DAT_PATH,
        ]);

        let result = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
            console.log(result);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error('Python Error:', data.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                // Read the output.js content here and return it in the response
                fs.readFile(outputPath, 'utf8', (readErr, jsCode) => {
                    if (readErr) {
                        console.error('Error reading output file:', readErr);
                        return res.status(500).json({ error: 'Error reading output file' });
                    }
                    // Send the jsCode back in the response
                    res.status(200).json({ jsCode });
                    console.log('Server sent')
                });
            } else {
                res.status(500).json({ error: 'Python script failed' });
            }

           
        });

    });


// Handle all other routes with a 405 Method Not Allowed
server.all('*', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed' });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


 
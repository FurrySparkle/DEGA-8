// app/api/upload/route.ts

import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
//export const runtime = "edge";

// Define the allowed origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:5000',
  'http://localhost:3000',
  'https://dega-8.com',
];

// Define the path to save the .dat file
const PICO8_DAT_PATH = path.join(
  process.cwd(),
  'public',
  'Pic0-8',
  'pico8.dat'
);

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json(
    { message: 'CORS preflight' },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods':  'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-filename',
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.join(', '),
      },
    }
  );
}

/**
 * Handle POST /api/upload
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  // Check if the origin is allowed
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse('CORS origin denied', { status: 403 });
  }

  // Set CORS headers
  const headers: HeadersInit = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods':  'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-filename',
  };

  try {
    // Ensure the content type is application/octet-stream
    if (req.headers.get('content-type') !== 'application/octet-stream') {
      return new NextResponse('Unsupported Media Type', {
        status: 415,
        headers,
      });
    }

    // Get the filename from headers
    const filename = req.headers.get('x-filename');
    if (!filename) {
      return new NextResponse('Missing x-filename header', {
        status: 400,
        headers,
      });
    }

    // Validate the file extension
    const fileExt = path.extname(filename);
    if (fileExt !== '.dat') {
      return new NextResponse('Invalid file extension', {
        status: 400,
        headers,
      });
    }

    // Read the raw body as a buffer
    const buffer = await req.arrayBuffer();
   

    // const { file } = Buffer.from(req.body);
    console.log('Server receieved file');

 // Convert Buffer (req.body) to ArrayBuffer
 const arrayBuffer = buffer;

 // Wrap the ArrayBuffer in a DataView
 const dataView = new DataView(arrayBuffer);

   


    // Write the buffer to the specified path
    await fs.promises.writeFile(PICO8_DAT_PATH, dataView);

    return new NextResponse('File uploaded successfully.', {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return new NextResponse('Internal Server Error', {
      status: 500,
      headers,
    });
  }
}

/**
 * Handle all other HTTP methods with 405 Method Not Allowed
 */
export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const headers: HeadersInit = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const stat = await fs.promises.stat(PICO8_DAT_PATH);
    const fileSizeInBytes = stat.size;
    const nineMB = 9 * 1024 * 1024; // 9MB in bytes
    const isLargerThan9MB = fileSizeInBytes > nineMB;
 console.log(isLargerThan9MB);
 
    return NextResponse.json(
      { isLargerThan9MB },
      {
        status: isLargerThan9MB ? 200 : 404,
        headers,
      }
    );
  } catch (error) {
    return new NextResponse('File not found', {
      status: 404,
      headers,
    });
  }
}

export async function PUT() {
  return new NextResponse('Method Not Allowed', {
    status: 405,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  });
}

export async function DELETE() {
  return new NextResponse('Method Not Allowed', {
    status: 405,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  });
}

// Add more method handlers as needed...
//TODO-- Add GET for frontend to query if the dat file is larger than 9mb on the server to toggle UI


// const express = require('express');
// const path = require('path');
// const { spawn } = require('child_process');
// const fs = require('fs');
// const process = require('process')
// // Initialize the Express server
// const server = express();




// server.use(function(req, res, next){
//     var whitelist = ['localhost:5000', 'localhost:3000', 'dega-8.com']
//     var host = req.get('host');
     
//     whitelist.forEach(function(val, key){
//       if (host.indexOf(val) > -1){
//        res.setHeader('Access-Control-Allow-Origin', host);
//       }
//     })
//     next();
//     });


// // Assume we have the server origin current working directory
// const serverOrigin = process.cwd();

// // Middleware to parse Raw Files bodies
// server.use(express.raw({ type: 'application/octet-stream', limit: '12mb' })); // For raw file uploads


// // Set the constant path to pico8.dat if it's fixed
// const PICO8_DAT_PATH = path.join(serverOrigin, 'public', 'Pic0-8', 'pico8.dat');


// //TODONE add /upload for saving dat file locally


// server.post('/upload', function ( req, res){

//     // const { file } = Buffer.from(req.body);
//     console.log('Server receieved file');

//  // Convert Buffer (req.body) to ArrayBuffer
//  const arrayBuffer = req.body.buffer.slice(req.body.byteOffset, req.body.byteOffset + req.body.byteLength);

//  // Wrap the ArrayBuffer in a DataView
//  const dataView = new DataView(arrayBuffer);

//     const filename = req.headers['x-filename'];
//     console.log(filename);

//     const DatCheck = path.extname(filename);
//     console.log(DatCheck);
//     if(DatCheck === '.dat'){
//     fs.writeFile(PICO8_DAT_PATH, dataView,'utf8', (writeErr) => {
//         if (writeErr) {
//             console.error(`Error writing file ${PICO8_DAT_PATH}:`, writeErr);
//             return res.status(500).send('Failed to save Dat file');
//         }
//       })
//       res.send('File uploaded successfully.')
//     };

// });



// // Handle all other routes with a 405 Method Not Allowed
// server.all('*', (req, res) => {
//     res.status(405).json({ error: 'Method Not Allowed' });
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


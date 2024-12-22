

import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
export const runtime = "nodejs";
// Define the CORS whitelist
const ALLOWED_ORIGINS = [
  'http://localhost:5000',
  'http://localhost:3000',
  'https://dega-8.com',
  'https://dega8.com',
];

// Helper function for CORS
const handleCors = (req: NextRequest) => {
  const origin = req.headers.get('origin') || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  return '';
};

// Helper function to parse JSON body
const parseJsonBody = async (req: NextRequest): Promise<any> => {
  const text = await req.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON body');
  }
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(req: NextRequest) {
  const origin = handleCors(req);
  return NextResponse.json(
    { message: 'CORS preflight' },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

// Handle GET request
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    {
      status: 405,
      headers: {
        Allow: 'POST, OPTIONS',
      },
    }
  );
}

// Handle POST request
export async function POST(req: NextRequest) {
  const origin = handleCors(req);

  if (!origin) {
    return NextResponse.json('CORS origin denied', { status: 403 });
  }

  const headers: HeadersInit = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Parse the JSON body
    const body = await parseJsonBody(req);
    const { P8code } = body;

    if (!P8code) {
      return NextResponse.json('P8code is required', {
        status: 408,
        headers,
      });
    }

    // Define paths
    const serverOrigin = process.cwd();
    const inputPath = path.join(serverOrigin, 'public', 'Pic0-8', 'degademo.p8');
    const outputPath = path.join(serverOrigin, 'public', 'Pic0-8', 'degademo.js');
    const PICO8_DAT_PATH = path.join(
      serverOrigin,
      'public',
      'Pic0-8',
      'pico8.dat'
    );

    // Write P8 code to .p8 file
    await fs.promises.writeFile(inputPath, P8code, 'utf8');

    // Run the Shrinko8 command
    const pythonProcess = spawn('python', [
      path.join(
        serverOrigin,
        'app',
        'src',
        'core',
        'plugins',
        'shrinko8-main',
        'shrinko8.py'
      ),
      inputPath,
      outputPath,
      '--pico8-dat',
      PICO8_DAT_PATH,
    ]);

    let result = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    const exitCode = await new Promise((resolve) => {
      pythonProcess.on('close', resolve);
    });

    if (exitCode === 0) {
      try {
        const jsCode = await fs.promises.readFile(outputPath, 'utf8');
        return NextResponse.json(
          { jsCode },
          {
            status: 200,
            headers: {
              ...headers,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch {
        return NextResponse.json('Error reading output file', {
          status: 501,
          headers,
          
        });
      }
    } else {

      console.log('Python script failed', errorOutput);
      return NextResponse.json('Python script failed', {
        status: 502,
        headers,
       
      });
    }
  } catch {
    return NextResponse.json('Internal Server Error', {
      status: 504,
      headers,
    });
  }
}

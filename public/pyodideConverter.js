// public/py-worker.js
import * as path from 'path';
import { loadPyodide } from "pyodide";
import fs from '@zenfs/core';
import { initFS } from '../app/src/components/DEGA-8/FileSystemControlCenter';

self.addEventListener("error", (e) => {
  console.error("Worker hit an error:", e);
});
initFS();

async function convertGame(P8code) {
      
  try {
     
 
     if (!P8code) {
       throw Error('P8code is required', {
         
       });
     }
 
     // Define paths
     const serverOrigin = process.cwd();
     const inputPath = path.join('picostore', 'Pic0-8', 'degademo.p8');
     const outputPath = path.join( 'picostore', 'Pic0-8', 'degademo.js');
     const PICO8_DAT_PATH = path.join(
       //serverOrigin,
       'picostore',
       'Pic0-8',
       'pico8.dat'
     );
 
     // Write P8 code to .p8 file
     
     await fs.promises.writeFile(inputPath, P8code, 'utf8');
     
      console.log('P8 code written to file' + P8code);
      
       let pyodide = await loadPyodide();  //{ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/' }
    const result = await pyodide.runPythonAsync('python'+
       path.join(
         serverOrigin,
         'app',
         'src',
         'core',
         'plugins',
         'shrinko8-main',
         'shrinko8.py'
       ) +
       inputPath +
       outputPath +
       '--pico8-dat' +
       PICO8_DAT_PATH
     );
     
     
     let errorOutput = result.stderr;
 
     // pythonProcess.stdout.on('data', (data) => {
     //   result += data.toString();
     // });
 
     // pythonProcess.stderr.on('data', (data) => {
     //   errorOutput += data.toString();
     // });
 
     // const exitCode = await new Promise((resolve) => {
     //   pythonProcess.on('close', resolve);
     // });
 
     
       try {
        if(result){
         return true;}
       } catch {
         console.log('Python script failed', errorOutput);
             throw Error('Python script failed');
           
       }
      
   } catch {
     throw Error('Internal Server Error', {
       
     });
   }};

   self.addEventListener("message", async (event) => {
  
console.log('Message received in worker', event.data);

  const { code } = event.data;

  try {
  
    const result = await convertGame(code);
    // Post the result back to the main thread
    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({ success: false, error: error.toString() });
  }
   });



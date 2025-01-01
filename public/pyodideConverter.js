// @ts-check
/// <reference lib="webworker" />
// public/py-worker.js




// 1) Load Pyodide script from the official CDN (or local copy)
importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js');
let shrink8Zip = 'shrinko8-main.zip';
let isShrinko8Loaded = false;
let pyodideLoad;
async function pyodide()  {
  
  if(!pyodideLoad) {
     pyodideLoad = await self.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/'});
  }
  return pyodideLoad;
}
async function loadShrinko8Zip(zipUrl) {
  const loadedPyodide = await pyodide();

  if (isShrinko8Loaded) {
    return;
  } else {
    const response = await fetch(zipUrl);
    const zipData = await response.arrayBuffer();
  //  Unpack into Pyodide’s in-memory FS
  //    Tells Pyodide "this is a ZIP file", so it extracts everything
  try{

    //await loadedPyodide.FS.mkdir('shrinko8');
    await loadedPyodide.unpackArchive(zipData, "zip");
    // await loadedPyodide.runPythonAsync(`
    //   from pyodide.http import pyfetch
    //   response = await pyfetch(${zipUrl})
    //   await response.unpack_archive()
    // `)
    

    //walk through the directory
    await loadedPyodide.runPythonAsync(`import os

for root, dirs, files in os.walk("/"):
    print("Directory:", root)
    for d in dirs:
        print("  subdir:", d)
    for f in files:
        print("  file:", f)`);

  } catch (e) {
    console.error(e);
  }
  console.log('ZIP LOADED');
  // Now the entire "shrinko8/" folder is in the Pyodide FS
  isShrinko8Loaded = true;
  }
}
loadShrinko8Zip(shrink8Zip);

async function convertGame(P8code, ZenDATfile ) {
  const loadedPyodide = await pyodide(); 
  let globalErrror;
  try {
     
 
     if (!P8code) {
       throw Error('P8code is required', {
         
       });
     }
 
     // Define paths
     
     const inputPath = ( 'Pic0-8/degademo.p8');
     
     const outputPyodide = (  'Pic0-8/degademo.js');
     
     const PYODIDE_DAT_PATH =( 'Pic0-8/pico8.dat');

     await loadShrinko8Zip(shrink8Zip);
try {
  await loadedPyodide.FS.mkdir('Pic0-8');
     console.log('Directory created');
} catch (e) {
  // If the directory already exists, FS.mkdir will throw an error.
  // You can safely ignore it or check if e.errno === 20 to confirm "exists".
}
     // Write P8 code to .p8 file
     await loadedPyodide.FS.writeFile(inputPath, P8code, { encoding: "utf8" });
     
     await loadedPyodide.FS.writeFile(PYODIDE_DAT_PATH, ZenDATfile);
   const stat = await loadedPyodide.FS.stat(inputPath);
      console.log('P8 code written to file' + stat.size + P8code);
      
      // Run the Python script and create directory for output
      await loadedPyodide.FS.open(outputPyodide, 'w+');
      console.log('Output file created, Dirs>' + loadedPyodide.FS.readdir('/home/pyodide/'));

      // 2) Build a Python code string that sets sys.argv and runs "shrinko8.py"
const pythonCode = `
import sys
import runpy

sys.argv = [
    "shrinko8.py", 
    ${JSON.stringify(inputPath)}, 
    ${JSON.stringify(outputPyodide)}, 
    "--pico8-dat", 
    ${JSON.stringify(PYODIDE_DAT_PATH)}
]
print('Running shrinko8.py "shrinko8.py",  ${JSON.stringify(inputPath)},   ${JSON.stringify(outputPyodide)},  "--pico8-dat" ${JSON.stringify(PYODIDE_DAT_PATH)}')
try:
  runpy.run_path("shrinko8.py", run_name="__main__")
except SystemExit:
    # If you'd like to completely ignore it, do nothing here
    pass
`;

     try {
      
     await loadedPyodide.runPythonAsync(pythonCode);
     
      
     
      
     const newGame = await loadedPyodide.FS.readFile(outputPyodide, { encoding: "utf8" });
     
     console.log('Game converted', newGame);
       
        if(newGame) {
         return  JSON.stringify(newGame);}
       } catch (e) {
         console.log('Python script failed', globalErrror);
             throw Error('Python script failed' + e);
           
       }
      
   } catch (e) {
     throw Error('Internal Server Error||' + e);
   }};
  // Handle errors
   self.addEventListener("error", (e) => {
    console.error("Worker hit an error:", e);
  });
self.addEventListener( "message", async (event) => {
  
  console.log('Message received in worker', event.data);

  const { code, ZenDATfile } = event.data;

  try {
  
    const result = await convertGame(code, ZenDATfile );
    
    // Post the result back to the main thread
    postMessage({ success: true , result });
  } catch (error) {
    postMessage({ success: false, error: error.toString() });
  }
});



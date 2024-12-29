"use client";
import fs from '@zenfs/core';

import path from 'path';

import { exists, writeFile } from '@zenfs/core/promises';
import { configure } from '@zenfs/core';
import { IndexedDB } from '@zenfs/dom';



export async function initFS() {

  if(!(await exists('/picostore'))) {
  await configure({
     disableAccessChecks: true,
     mounts:{ '/picostore': IndexedDB }});
  }else return;
};
initFS();

// Define the path to save the .dat file
const PICO8_DAT_PATH = path.join(
    //process.cwd(),
    'picostore',
    'Pic0-8',
    'pico8.dat'
  );



  export async function savePico8DatFile(data) {
  
    // Read the raw body as a buffer
   const buffer = await data.arrayBuffer();
   

    if(buffer){
    console.log('Server receieved file');
    };


 // Wrap the ArrayBuffer in a DataView
 const dataView = new DataView(buffer);
 const parentDir = path.dirname(PICO8_DAT_PATH);
 console.log(parentDir+'<Dir/Name||PICO8_DAT_PATH:', PICO8_DAT_PATH);
   
    // Check if the parent directory exists
    if (!(await exists(parentDir))) {
      // Create the parent directory if it doesn't exist  
      await fs.mkdir(parentDir);
    }

    // Write the buffer to the specified path
    await writeFile(PICO8_DAT_PATH, dataView);
}


export async function readPico8DatFile() {
    try {
    
        const stat = await fs.promises.stat(PICO8_DAT_PATH);
       const fileSizeInBytes = stat.size;
       const nineMB = 9 * 1024 * 1024; // 9MB in bytes
       const isLargerThan9MB = fileSizeInBytes > nineMB;
    console.log(isLargerThan9MB);
       return (
        
         {
           status: isLargerThan9MB ,
           
         }
       );
     } catch (error) {
       throw Error('File not found', {
         
       });
     }}


    
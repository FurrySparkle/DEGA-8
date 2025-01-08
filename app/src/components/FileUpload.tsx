'use client';

import {readPico8DatFile,savePico8DatFile} from "./DEGA-8/FileSystemControlCenter";
import { ChangeEvent, useEffect, useState } from 'react';
import { Switch, Group, Center } from '@mantine/core';
import storage from './mockLocalStorage';


  
 

function FileUploadSingle() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(() => {
    return storage.getItem('fileUploaded') === 'true';
  });
  const [progress, setProgress] = useState(0);


  useEffect(() => {

    readPico8DatFile().then((response) => {
     
      
      if (response.status) {

        setSubmitted(true);
        return ;
      }
      setSubmitted(false);
      throw new Error('Network response indicates no dat file, please upload a legitimate pico.dat file.');
      
    }
    )


    
  }, [submitted]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setSubmitted(false);
      storage.removeItem('fileUploaded');
      
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      return;
    }
   savePico8DatFile(file);
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <Group pos={Center} >
        <Switch size="xl" onLabel="Loaded" offLabel="Unloaded" radius="md" checked={submitted}
      onChange={(event) => setSubmitted(event.currentTarget.checked)} />
        </Group>
      {!submitted ? (
        <>
          <input type="file" accept=".dat" onChange={handleFileChange} />
          <div style={{ marginTop: '10px' }}>{file && `${file.name}`}</div>
          <button
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '10px 20px',
              marginTop: '10px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleUploadClick}
          >
            Upload
          </button>
          {progress > 0 && (
            <progress
              value={progress}
              max="100"
              style={{ display: 'block', width: '100%', marginTop: '20px' }}
            />
          )}
        </>
      ) : (
        <>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'green', marginTop: '20px' }}>
            File Uploaded!
          </div>
          <progress
           
            style={{ display: 'block', width: '100%', marginTop: '10px' }}
          />
        </>
      )}
    </div>
  );
}

export default FileUploadSingle;




// import { ChangeEvent, useState } from 'react';

// function FileUploadSingle() {
//   const [file, setFile] = useState<File | null>(null);
//   const [submitted, setSubmitted] = useState(false); // Track if the file is uploaded
//   const [progress, setProgress] = useState(0); // Track upload progress

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFile(e.target.files[0]);
//       setSubmitted(false); // Reset submission state on new file selection
//     }
//   };

//   const handleUploadClick = () => {
//     if (!file) {
//       return;
//     }

//     const uploadProgress = new XMLHttpRequest();

//     uploadProgress.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         const percentComplete = Math.round((event.loaded / event.total) * 100);
//         setProgress(percentComplete); // Update progress state
//       }
//     };

//     uploadProgress.onload = () => {
//       setProgress(100); // Set progress to complete on success
//       setSubmitted(true); // Mark as successfully submitted
//     };

//     uploadProgress.onerror = () => {
//       console.error('File upload failed');
//     };

//     uploadProgress.open('POST', '/upload');
//     uploadProgress.setRequestHeader('X-Filename', file.name);
//     uploadProgress.setRequestHeader('Content-Type', 'application/octet-stream');
//     uploadProgress.send(file);
//   };

//   return (
//     <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
//       {!submitted ? (
//         <>
//           <input type="file" accept=".dat" onChange={handleFileChange} />
//           <div style={{ marginTop: '10px' }}>{file && `${file.name}`}</div>
//           <button
//             style={{
//               backgroundColor: 'green',
//               color: 'white',
//               padding: '10px 20px',
//               marginTop: '10px',
//               fontSize: '16px',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//             }}
//             onClick={handleUploadClick}
//           >
//             Upload
//           </button>
//           {progress > 0 && (
//             <progress
//               value={progress}
//               max="100"
//               style={{ display: 'block', width: '100%', marginTop: '20px' }}
//             />
//           )}
//         </>
//       ) : (
//         <>
//           <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'green', marginTop: '20px' }}>
//             File Uploaded!
//           </div>
//           <progress
//             style={{ display: 'block', width: '100%', marginTop: '10px' }}
//           />
//         </>
//       )}
//     </div>
//   );
// }

// export default FileUploadSingle;




// import { ChangeEvent, useState } from 'react';

// function FileUploadSingle() {
//   const [file, setFile] = useState<File>();

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const submitted= true; //For toggle of upload option
//   const handleUploadClick = () => {
//     if (!file) {
//       return;
//     }

//     // 👇 Uploading the file using the fetch API to the server
//     fetch("/upload", {
//       method: 'POST',
//       body: file,
//       // 👇 Set headers manually for single file upload
//       headers: {
//         'X-Filename': file.name,
//         'Content-Type': 'application/octet-stream',
//         'Content-Length': `${file.size}`, // 👈 Headers need to be a string
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => console.log(data))
//       .catch((err) => console.error(err));
//   };

//   return (
//     <div>
//       <input type="file" accept=".dat" onChange={handleFileChange} />

//       <div>{file && `${file.name} `}</div>

//       <button style={{backgroundColor: 'green'}} onClick={handleUploadClick}>Upload</button>
//     </div>
//   );
// }

// export default FileUploadSingle;



{/* <form action= >   Dreprecated Code
                    <input type="file" id="file" accept=".dat"></input>
                    <input type="submit" value="Upload" style={{backgroundColor: 'green'}}></input>
                    </form>
                    
                    
    const uploadProgress = new XMLHttpRequest();

    uploadProgress.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete); // Update progress state
      }
    };

    uploadProgress.onload = () => {
      setProgress(100); // Set progress to complete on success
      setSubmitted(true); // Mark as successfully submitted
    };

    uploadProgress.onerror = () => {
      console.error('File upload failed');
    };

    uploadProgress.open('POST', '/upload');
    uploadProgress.setRequestHeader('X-Filename', file.name);
    uploadProgress.setRequestHeader('Content-Type', 'application/octet-stream');
    uploadProgress.send(file);
    
    */}
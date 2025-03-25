import React, { useEffect, useRef, useState } from 'react';
import domtoimage from 'dom-to-image';

const Pico8Player = ({ width = 356, height = 256 }: { width?: number|string, height?: number|string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [iframeSrc, setIframeSrc] = useState<string>("/Pic0-8/degademo.html");
 
  // Function to reload the iframe content with a cache-busting query parameter
  const resetCart = () => {
    const iframe = iframeRef.current;
    const timestamp = new Date().getTime();
    setIframeSrc(`/Pic0-8/degademo.html?t=${timestamp}`);
    iframe!.contentWindow?.location.reload();
    console.log('Iframe reloaded with new game code.');
  };


  // Add screenshot function
  const captureScreenshot = async (): Promise<string> => {
    if (!iframeRef.current) {
      throw new Error('Iframe not found');
    }
    
    try {
      const dataUrl = await domtoimage.toPng(iframeRef.current);
      return dataUrl.split(',')[1]; // Return base64 without data:image/png;base64, prefix
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      throw error;
    }
  };

  // Expose the capture function to window for external access
  useEffect(() => {
    (window as any).captureGameScreenshot = captureScreenshot;
    return () => {
      delete (window as any).captureGameScreenshot;
    };
  }, []);


  useEffect(() => {
   
 
    // Listen for storage events from other windows
    window.addEventListener('GameConverted', resetCart);



    // Initial load
    resetCart();

    console.log('PicoPlayer mounted!');

    // Cleanup function
    return () => {
      window.removeEventListener('GameConverted', resetCart);
      
    };
  }, []);

  return (
    <div>
      <iframe
        title="PicoPlayer"
        ref={iframeRef}
        src= {iframeSrc}
        width={width}
        height={height}
        style={{ border: 'none',  }}
        sandbox = "allow-scripts allow-same-origin"
        
      ></iframe>
    </div>
  );
};

export default Pico8Player;



//Deprecated code

 // // Function to reload the iframe content using location.reload()
  // const resetCart = () => {
  //   const iframe = iframeRef.current;
  //   if (iframe) {
  //     iframe.contentWindow?.location.reload();
  //     console.log('Iframe reloaded with new game code.');
  //   }
  // };


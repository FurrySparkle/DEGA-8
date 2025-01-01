import React, { useEffect, useRef, useState } from 'react';

const Pico8Player = () => {
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
        width="356"
        height="256"
        style={{ border: 'none' }}
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


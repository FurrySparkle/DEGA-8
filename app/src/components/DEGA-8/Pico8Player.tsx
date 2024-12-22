import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    loadGameCode: () => void;
  }
}

const Pico8Player = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [gameP8File, setGameP8File] = useState<string | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string>("/Pic0-8/degademo.html");
  // // Function to reload the iframe content using location.reload()
  // const resetCart = () => {
  //   const iframe = iframeRef.current;
  //   if (iframe) {
  //     iframe.contentWindow?.location.reload();
  //     console.log('Iframe reloaded with new game code.');
  //   }
  // };


  // Function to reload the iframe content with a cache-busting query parameter
  const resetCart = () => {
    const timestamp = new Date().getTime();
    setIframeSrc(`/Pic0-8/degademo.html?t=${timestamp}`);
    console.log('Iframe reloaded with new game code.');
  };

  useEffect(() => {
    // Function to handle localStorage changes from other windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "GameConverted") {
        
        resetCart();
      }
    };

    // // Custom event listener for changes within the same window
    // const originalSetItem = localStorage.setItem;
    // localStorage.setItem = function (key, value) {
    //   const event = new Event('itemInserted');
    //   document.dispatchEvent(event);
    //   originalSetItem.apply(this, [key, value]);
    // };

    // const handleItemInserted = () => {
    //   const newValue = localStorage.getItem('gameP8File');
    //   setGameP8File(newValue);
    //   //resetCart();
    // };

    // Listen for storage events from other windows
    window.addEventListener('storage', handleStorageChange);

    // // Listen for custom events within the same window
    // document.addEventListener('itemInserted', handleItemInserted);

    // Initial load
    resetCart();

    console.log('PicoPlayer mounted!');

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      ///document.removeEventListener('itemInserted', handleItemInserted);
      // Restore original setItem method
      //localStorage.setItem = originalSetItem;
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

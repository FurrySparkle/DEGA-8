import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    loadGameCode: () => void;
  }
}

const Pico8Player = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [gameP8File, setGameP8File] = useState<string | null>(null);

  // Function to reload the iframe content using location.reload()
  const resetCart = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.contentWindow?.location.reload();
      console.log('Iframe reloaded with new game code.');
    }
  };

  useEffect(() => {
    // Function to handle localStorage changes from other windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gameP8File') {
        setGameP8File(event.newValue);
        resetCart();
      }
    };

    // Custom event listener for changes within the same window
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      const event = new Event('itemInserted');
      document.dispatchEvent(event);
      originalSetItem.apply(this, [key, value]);
    };

    const handleItemInserted = () => {
      const newValue = localStorage.getItem('gameP8File');
      setGameP8File(newValue);
      resetCart();
    };

    // Listen for storage events from other windows
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom events within the same window
    document.addEventListener('itemInserted', handleItemInserted);

    // Initial load
    resetCart();

    console.log('PicoPlayer mounted!');

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('itemInserted', handleItemInserted);
      // Restore original setItem method
      localStorage.setItem = originalSetItem;
    };
  }, []);

  return (
    <div>
      <iframe
        title="PicoPlayer"
        ref={iframeRef}
        src="/Pic0-8/degademo.html"
        width="356"
        height="256"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default Pico8Player;

import React, { RefObject, useEffect, useRef } from 'react';


declare global {
  interface Window {
      loadGameCode: () => void;
  }
}


// Function to be used in other files
export function ResetCart(iframeRef: React.RefObject<HTMLIFrameElement>) {
    // Ensure the iframeRef is valid and current points to an iframe
    if (iframeRef.current) {
        const iframe = iframeRef.current;
        iframe.onload = () => {
            if (iframe.contentWindow) {
                // Call the function defined in the iframe's window
                iframe.contentWindow.loadGameCode?.(); // Use optional chaining to avoid errors if undefined
            }
        };
    }
   
}

const Pico8Player = ( {iframeRef}) => {
    

    useEffect(() => {
        // Call ResetCart when the component mounts
        ResetCart(iframeRef);


// Listen for local storage changes
window.addEventListener('storage', (event) => {
    if (event.key === 'GameReady') {
      ResetCart(iframeRef);
    }
    console.log('New Game loaded into cart and Running!!')
  });
  console.log('PicoPlayer mounted!');

    }, [iframeRef]); 

    

    return (
        <div>
            <iframe
                title="PicoPlayer"
                ref={iframeRef} // Pass the iframe ref
                src="/Pic0-8/degademo.html"
                width="356"
                height="256"
                style={{ border: 'none' }}
            ></iframe>
        </div>
    );
};

export default Pico8Player;


import React, { useEffect, useRef } from 'react';

interface Pico8PlayerProps {
  code: string;
}

const Pico8Player: React.FC<Pico8PlayerProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const sendCodeToIframe = () => {
      if (iframe.contentWindow) {
        console.log('Sending code to iframe:', code);
        iframe.contentWindow.postMessage(
          { type: 'LOAD_GAME_CODE', code },
          '*' // Replace '*' with the iframe's origin if known for better security
        );
      }
    };

    // Send code when the iframe loads
    iframe.addEventListener('load', sendCodeToIframe);

    // Send code if the iframe is already loaded
    if (
      iframe.contentWindow &&
      iframe.contentDocument?.readyState === 'complete'
    ) {
      sendCodeToIframe();
    }

    // Send code whenever 'code' changes
    sendCodeToIframe();

    // Cleanup event listener on unmount
    return () => {
      iframe.removeEventListener('load', sendCodeToIframe);
    };
  }, [code]);

  return (
    <iframe
    title="PicoPlayer"
      ref={iframeRef}
      src="/Pic0-8/antfarm.html"
      width="800"
      height="600"
    ></iframe>
  );
};

export default Pico8Player;


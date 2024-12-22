
import React from 'react';
import './src/index.scss';
import Providers from './Providers'; // Import the new Client Component

export const metadata = {
  title: 'DEGA-8',
  description: 'Instant Pocket Game',
  
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
       <head>
       <link rel="icon" href="../public/Logo_solo.webp" />

  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="Your instant pocket game with Pico-8." />
  <link rel="apple-touch-icon" href="../public/Logo_solo.webp" />
 
  
 
  <title>DEGA-8</title>
        {/* Include external stylesheets here */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Open+Sans:100,400,300,500,700,800"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Fira+Code:100,400,300,500,700,800"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;

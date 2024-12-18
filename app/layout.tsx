
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

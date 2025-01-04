'use client';

import React from 'react';
import { usePathname} from 'next/navigation';

import './src/index.scss';
import LandingPage from './src/components/pages/landing';

function Page() {
  
  
  // Determine which component to render based on the current route
  const path = usePathname();
  let content;

  if (path === '/') {
    content = <LandingPage landing={true} />;
  } 
  

  return (
    <>
      {content}
    </>
  );
}

export default Page;
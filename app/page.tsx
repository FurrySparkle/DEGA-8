'use client';

import React from 'react';
import { usePathname} from 'next/navigation';

import dynamic from 'next/dynamic';
import './src/index.scss';


const LandingPage = dynamic(() => import('./src/components/pages/landing.tsx'));

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
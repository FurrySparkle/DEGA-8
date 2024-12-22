'use client';

import React from 'react';
import { usePathname} from 'next/navigation';

import dynamic from 'next/dynamic';
import './src/index.scss';

const ChatPage = dynamic(() => import('./src/components/pages/chat'));
const LandingPage = dynamic(() => import('./src/components/pages/landing'));

function Page() {
  

  // Determine which component to render based on the current route
  const path = usePathname();
  let content;

  if (path === '/') {
    content = <LandingPage landing={true} />;
  } 
  
  // else if (path.startsWith('/chat/')) {
  //   content = <ChatPage />;
  // } else if (path.startsWith('/s/')) {
  //   content = <ChatPage share={true} />;
  // } else {
  //   content = <div>Page not found</div>;
  // }

  return (
    <>
      {content}
    </>
  );
}

export default Page;
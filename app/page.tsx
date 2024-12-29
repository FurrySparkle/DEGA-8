'use client';

import React from 'react';
import { usePathname, useParams} from 'next/navigation';

import dynamic from 'next/dynamic';
import './src/index.scss';

const ChatPage = dynamic(() => import('./src/components/pages/chat'));
const LandingPage = dynamic(() => import('./src/components/pages/landing'));

function Page() {
  
  const param =  useParams<{ id: string }>();
  // Determine which component to render based on the current route
  const path = usePathname();
  let content;

  if (path === '/') {
    content = <LandingPage landing={true} />;
  } 
  // else if (path.startsWith('/chat/')) {
  //   console.log('ChatPage||', param!.id);
  // content = <ChatPage id={param!.id} />;
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
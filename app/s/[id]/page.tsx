// filepath: /C:/Users/15054/Documents/GitHub/DEGA-8/app/s/[id]/page.tsx
'use client';

import React from 'react';
import ChatPage from '../../src/components/pages/chat';

export default function SharedChatPage() {
  return <ChatPage share={true} />;
}
// filepath: /C:/Users/15054/Documents/GitHub/DEGA-8/app/s/[id]/page.tsx

'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import SharedPage from '../../src/components/pages/shared';
//export const runtime = 'edge';

export default function SharedChatPage() {
  const { id = '' } = useParams<{ id: string }>();
  return <SharedPage id={id} />;
}
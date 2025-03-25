'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Box, ScrollArea, Loader } from '@mantine/core';
import Image from 'next/image';
import ChatPage from './chat';
import Pico8Player from '../DEGA-8/Pico8Player';
import { GameConverted } from '../DEGA-8/CartTemplater';
import { getSharedGame } from '../../../actions/getSharedGame';

interface SharedPageProps {
  id: string;
}

interface ChatData {
  id: string;
  chat: any;
  code: string;
  clip_pic: string;
  comments: string[];
}

export default function SharedPage({ id }: SharedPageProps) {
  const [chatMetadata, setChatMetadata] = useState<{id: string, clip_pic: string}>();
  const [chatMessages, setChatMessages] = useState<string>('');
  const [chatCode, setChatCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const result = await getSharedGame(id);
        
        if (!result.success) {
          console.error(result.error);
          return;
        }

        const { data } = result;
        if (!data) {
          console.error('No data received');
          return;
        }
        setChatMetadata({
          id: data.id,
          clip_pic: data.clip_pic
        });
        setChatMessages(data.chat);
        setChatCode(data.code);
       // GameConverted(data.code);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatData();
  }, [id]);

// Separate useEffect for client-side only operations
useEffect(() => {
  if (typeof window !== 'undefined' && chatCode) {
    // Only run GameConverted on the client side when we have the code
    GameConverted(chatCode);
  }
}, [chatCode]);


  // Separate useEffect to handle chatData changes
  useEffect(() => {
    if (chatMetadata) {
        GameConverted(chatCode);
    }
    console.log("chatMessages--", chatMessages);
  }, [chatMetadata, chatCode, chatMessages]);

  return (
    <Container 
      fluid 
      p={0}
      style={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box style={{ 
        display: 'flex', 
        height: '60vh',
        gap: '1px',
        backgroundColor: 'var(--mantine-color-dark-7)'
      }}>
        <Box style={{
          flex: '0 0 50%',
          position: 'relative',
          
          backgroundColor: 'var(--mantine-color-dark-8)',
        }}>
          <Image
            src="/AnimeBoi.png"
            alt="Anime Character"
            fill
            style={{ 
              objectFit: 'cover',
              borderRadius: '0',
              objectPosition: '60% 40%'
              
            }}
          />
        </Box>
        
        <Box style={{
          flex: '1',
          backgroundColor: 'var(--mantine-color-dark-8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
          
        }}>
          <div style={{ 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: '#001',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            objectFit: 'fill',
        

          }}>
            <Pico8Player width={'1000em'} height={'600em'} />
          </div>
        </Box>
      </Box>

      <Box style={{ 
        flex: 1,
        backgroundColor: 'var(--mantine-color-dark-8)',
        overflow: 'hidden'
      }}>
        <ScrollArea 
          style={{
            height: '100%'
          }}
          scrollbarSize={8}
        >
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader />
            </div>
          ) : (
            chatMetadata && <ChatPage share={true} chatData={chatMessages} chatMetadata={chatMetadata}/>
          )}
        </ScrollArea>
      </Box>
    </Container>
  );
} 
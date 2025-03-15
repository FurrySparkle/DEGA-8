import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Container, Grid, Paper, Box, ScrollArea } from '@mantine/core';
import Image from 'next/image';
import ChatPage from './chat';
import Pico8Player from '../DEGA-8/Pico8Player';

// Supabase client initialization
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPAURL || '',
  process.env.NEXT_PUBLIC_SUPAKEY || ''
);

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
  const [chatData, setChatData] = useState<ChatData | null>(null);

  useEffect(() => {
    const fetchChatData = async () => {
      // Dummy data for now
      setChatData({
        id: id,
        chat: {},
        code: 'console.log("Hello World")',
        clip_pic: '',
        comments: ['Great game!', 'Nice work!']
      });

      // Actual Supabase query to be implemented
      // const { data, error } = await supabase
      //   .from('chats')
      //   .select('*')
      //   .eq('id', id)
      //   .single();
      
      // if (data) setChatData(data);
    };

    fetchChatData();
  }, [id]);

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
          <ChatPage share={true} />
        </ScrollArea>
      </Box>
    </Container>
  );
} 
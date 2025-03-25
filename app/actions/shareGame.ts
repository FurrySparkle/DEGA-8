'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPAURL || '',
  process.env.SUPAKEY || ''
);

export async function shareGame(data: {
  chatId: string;
  messageContent: string;
  gameCode: string;
  screenshot: string;
}) {
  try {
    const { data: result, error } = await supabase
      .from('chats')
      .upsert(
        {
          id: data.chatId,
          chat: data.messageContent,
          code: data.gameCode,
          clip_pic: data.screenshot
        },
        {
          onConflict: 'id',
          ignoreDuplicates: false
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An error occurred while sharing'
    };
  }
} 
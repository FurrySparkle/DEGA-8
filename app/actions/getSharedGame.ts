'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPAURL || '',
  process.env.SUPAKEY || ''
);

export async function getSharedGame(id: string) {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      data: {
        id: data.id,
        clip_pic: data.clip_pic,
        chat: data.chat,
        code: data.code
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch shared game'
    };
  }
} 
'use client';

import React, { useState } from 'react';
import { Modal, Button, Text, LoadingOverlay, Box, TextInput } from '@mantine/core';
import { CopyButton } from '@mantine/core';
import { shareGame } from '../../../actions/shareGame';

interface SharePromptProps {
  isOpen: boolean;
  onClose: () => void;
  messageContent: string;
  chatId: string;
}

// Add TypeScript interface for database schema
interface ChatRecord {
  id: string;
  chat: string;
  code: string;
  clip_pic: string;
  created_at?: string; // Supabase automatically handles this
}

export function SharePrompt({ isOpen, onClose, messageContent, chatId }: SharePromptProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleShare = async () => {
    try {
      setLoading(true);
      setError(null);
      setShareUrl(null);

      // Get game code from localStorage
      const gameCode = window.localStorage.getItem('gamelink');
      if (!gameCode) {
        throw new Error('No game code found');
      }

      // Get screenshot using the exposed function from Pico8Player
      const screenshot = await (window as any).captureGameScreenshot();
      if (!screenshot) {
        throw new Error('Failed to capture game preview');
      }

      // Call server action
      const result = await shareGame({
        chatId,
        messageContent,
        gameCode,
        screenshot
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Generate share URL
      const generatedUrl = `${window.location.origin}/s/${chatId}`;
      setShareUrl(generatedUrl);

      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'Check out my DEGA-8 game!',
          text: 'I created this game using DEGA-8',
          url: generatedUrl
        });
      }
    } catch (err) {
      console.error('Share error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while sharing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Share Your Game">
      <LoadingOverlay visible={loading} />
      <Text size="sm" mb="md">
        Share your game with others! This will create a public link to your game.
      </Text>
      {error && (
        <Text color="red" size="sm" mb="md">
          Error: {error}
        </Text>
      )}
      {!shareUrl && (
        <Button onClick={handleShare} fullWidth>
          Share Game
        </Button>
      )}
      {shareUrl && (
        <Box mt="md">
          <Text size="sm" mb="xs">
            Your game is ready to share! Use this link:
          </Text>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <TextInput
              value={shareUrl}
              readOnly
              style={{ flex: 1 }}
              data-autofocus
            />
            <CopyButton value={shareUrl}>
              {({ copy, copied }) => (
                <Button onClick={copy}>
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              )}
            </CopyButton>
          </div>
        </Box>
      )}
    </Modal>
  );
} 
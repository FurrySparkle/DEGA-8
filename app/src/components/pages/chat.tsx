'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import slugify from 'slugify';
import { useParams } from 'next/navigation';
import { Loader } from '@mantine/core';

import { useAppContext } from '../../core/context';
import { backend } from '../../core/backend';
import { Page } from '../pageComponent';
import { useOption } from '../../core/options/use-option';
import { P8Injector } from '../DEGA-8/CartTemplater';

const Message = React.lazy(() => import(/* webpackPreload: true */ '../message'));

const Messages = styled.div`
    @media (min-height: 30em) {
        max-height: 100%;
        flex-grow: 1;
        overflow-y: scroll;
    }
    display: flex;
    flex-direction: column;
`;

const EmptyMessage = styled.div`
    flex-grow: 1;
    padding-bottom: 5vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: "Work Sans", sans-serif;
    line-height: 1.7;
    gap: 1rem;
    min-height: 10rem;
`;

export default function ChatPage(props: any) {
    
    const context = useAppContext();
    const [chatData, setChatData] = useState<string>(props.chatData);
    const [autoScrollWhenOpeningChat] = useOption('auto-scroll', 'auto-scroll-when-opening-chat')
    const [autoScrollWhileGenerating] = useOption('auto-scroll', 'auto-scroll-while-generating');
    const { id = '' } = useParams<{ id: string }>() ?? {};
    useEffect(() => {
        if (props.share && props.chatMetadata?.id === id && chatData) {
            const sharedChat = {
                id: props.chatMetadata.id,
                chatID: props.chatMetadata.id,
                timestamp: Date.now(),
                role: "assistant",
                content: chatData
            };
            console.log("sharedChat--", sharedChat);
            // Check if message already exists to prevent duplicates
            if (!context.currentChat.messagesToDisplay.some(m => m.id === sharedChat.id)) {
                // Use the appropriate context method to update messages
                // If there isn't one, you might need to add it to your context
                context.currentChat.messagesToDisplay = [...context.currentChat.messagesToDisplay, sharedChat];
            }
        }
    }, [props.share, props.chatMetadata, chatData, id, context.currentChat]);


    useEffect(() => {
        if (props.share || !context.currentChat.chatLoadedAt) {
            return;
        }

        const shouldScroll = autoScrollWhenOpeningChat || (Date.now() - context.currentChat.chatLoadedAt) > 5000;

        if (!shouldScroll) {
            return;
        }

        const container = document.querySelector('#messages') as HTMLElement;
        const messages = document.querySelectorAll('#messages .message');

        if (messages.length) {
            const latest = messages[messages.length - 1] as HTMLElement;
            const offset = Math.max(0, latest.offsetTop - 100);
            setTimeout(() => {
                container?.scrollTo({ top: offset, behavior: 'smooth' });
            }, 100);
        }
    }, [context.currentChat?.chatLoadedAt, context.currentChat?.messagesToDisplay.length, props.share, autoScrollWhenOpeningChat]);

    const autoScroll = useCallback(() => {
        if (context.generating && autoScrollWhileGenerating) {
            const container = document.querySelector('#messages') as HTMLElement;
            container?.scrollTo({ top: 999999, behavior: 'smooth' });
            container?.parentElement?.scrollTo({ top: 999999, behavior: 'smooth' });
        }
    }, [context.generating, autoScrollWhileGenerating]);
    useEffect(() => {
        const timer = setInterval(() => autoScroll(), 1000);
        return () => {
            clearInterval(timer);
        };
    }, [autoScroll]);

    const messagesToDisplay = context.currentChat.messagesToDisplay;

    const shouldShowChat = id && context.currentChat.chat && !!messagesToDisplay.length || props.share;


    useEffect(() => {
        if (messagesToDisplay.length > 0 && context.currentChat.chat && !props.share) {
            const lastMessage = messagesToDisplay[messagesToDisplay.length - 1];
            if (lastMessage.role === 'assistant') {
                P8Injector(lastMessage.content);
            }
        }
    }, [messagesToDisplay]);

    return <Page id={id || 'landing'}
        headerProps={{
            share: context.isShare,
            canShare: messagesToDisplay.length > 1,
            title: (id && messagesToDisplay.length) ? context.currentChat.chat?.title! : undefined,
            onShare: async () => {
                if (context.currentChat.chat) {
                    const id = await backend.current?.shareChat(context.currentChat.chat);
                    if (id) {
                        const slug = context.currentChat.chat.title
                            ? '/' + slugify(context.currentChat.chat.title.toLocaleLowerCase())
                            : '';
                        const url = window.location.origin + '/s/' + id + slug;
                        navigator.share?.({
                            title: context.currentChat.chat.title || undefined,
                            url,
                        });
                    }
                }
            },
        }}>
        <Suspense fallback={<Messages id="messages">
            <EmptyMessage>
                <Loader variant="dots" />
            </EmptyMessage>
        </Messages>}>
            <Messages id="messages">
                {shouldShowChat && (
                    <div style={{ paddingBottom: '4.5rem' }}>
                        {messagesToDisplay.map((message) => (
                            <Message key={id + ":" + message.id}
                                message={message}
                                share={props.share}
                                last={props.share ? true : context.currentChat.chat!.messages.leafs.some(n => n.id === message.id)} />
                        ))}
                    </div>
                )}
                {!shouldShowChat && <EmptyMessage>
                    <Loader variant="dots" />
                </EmptyMessage>}
            </Messages>
        </Suspense>
    </Page>;
}

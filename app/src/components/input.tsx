'use client';

import styled from '@emotion/styled';
import { Button, ActionIcon, Textarea, Loader, Popover } from '@mantine/core';
import { getHotkeyHandler, useHotkeys, useMediaQuery } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from '../core/context';
import { useAppDispatch, useAppSelector } from '../store';
import { selectMessage, setMessage } from '../store/message';
import { selectSettingsTab, openOpenAIApiKeyPanel } from '../store/settings-ui';
import { speechRecognition, supportsSpeechRecognition } from '../core/speech-recognition-types';
import { useWhisper } from '@chengsokdara/use-whisper';
import QuickSettings from './quick-settings';
import { useOption } from '../core/options/use-option';
import Pico8Player from '../components/DEGA-8/Pico8Player';

const Container = styled.div`
    background: #292933;
    border-top: thin solid #393933;
    padding: 1rem 1rem 0 1rem;

    .inner {
        max-width: 50rem;
        margin: auto;
        text-align: right;
    }

    .settings-button {
        margin: 0.5rem -0.4rem 0.5rem 1rem;
        font-size: 0.7rem;
        color: #999;
    }
`;

export declare type OnSubmit = (name?: string) => Promise<boolean>;

export interface MessageInputProps {
    disabled?: boolean;
}

export default function MessageInput(props: MessageInputProps) {
    const message = useAppSelector(selectMessage);
    const [recording, setRecording] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const hasVerticalSpace = useMediaQuery('(min-height: 1000px)');
    const [useOpenAIWhisper] = useOption<boolean>('speech-recognition', 'use-whisper');
    const [openAIApiKey] = useOption<string>('openai', 'apiKey');

    const [initialMessage, setInitialMessage] = useState('');
    const {
        transcribing,
        transcript,
        startRecording,
        stopRecording,
    } = useWhisper({
        apiKey: openAIApiKey || ' ',
        streaming: false,
    });

    const router = useRouter();
    const context = useAppContext();
    const dispatch = useAppDispatch();
    const intl = useIntl();

    const tab = useAppSelector(selectSettingsTab);

    const [showMicrophoneButton] = useOption<boolean>('speech-recognition', 'show-microphone');
    const [submitOnEnter] = useOption<boolean>('input', 'submit-on-enter');

    const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setMessage(e.target.value));
    }, [dispatch]);

    const pathname = usePathname();

    const onSubmit = useCallback(async () => {
        setSpeechError(null);

        const id = await context.onNewMessage(message);
        console.log('MessageInput||', id);
        if (id) {
            
             if (!window.location.pathname.includes(id)) {

                
                router.push(`/chat/` + id);
            }
            dispatch(setMessage(''));
        }
    }, [context, message, dispatch, router]);

    const onSpeechError = useCallback((e: any) => {
        console.error('speech recognition error', e);
        setSpeechError(e.message);

        try {
            speechRecognition?.stop();
        } catch (e) { }

        try {
            stopRecording();
        } catch (e) { }

        setRecording(false);
    }, [stopRecording]);

    const onHideSpeechError = useCallback(() => setSpeechError(null), []);

    const onSpeechStart = useCallback(async () => {
        let granted = false;
        let denied = false;

        try {
            const result = await navigator.permissions.query({ name: 'microphone' as any });
            if (result.state == 'granted') {
                granted = true;
            } else if (result.state == 'denied') {
                denied = true;
            }
        } catch (e) { }

        if (!granted && !denied) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                stream.getTracks().forEach(track => track.stop());
                granted = true;
            } catch (e) {
                denied = true;
            }
        }

        if (denied) {
            onSpeechError(new Error('speech permission was not granted'));
            return;
        }

        try {
            if (!recording) {
                setRecording(true);

                if (useOpenAIWhisper || !supportsSpeechRecognition) {
                    if (!openAIApiKey) {
                        dispatch(openOpenAIApiKeyPanel());
                        return false;
                    }
                    // recorder.start().catch(onSpeechError);
                    setInitialMessage(message);
                    await startRecording();
                } else if (speechRecognition) {
                    const initialMessage = message;

                    speechRecognition.continuous = true;
                    speechRecognition.interimResults = true;

                    speechRecognition.onresult = (event) => {
                        let transcript = '';
                        for (let i = 0; i < event.results.length; i++) {
                            if (event.results[i].isFinal && event.results[i][0].confidence) {
                                transcript += event.results[i][0].transcript;
                            }
                        }
                        dispatch(setMessage(initialMessage + ' ' + transcript));
                    };

                    speechRecognition.start();
                } else {
                    onSpeechError(new Error('not supported'));
                }
            } else {
                if (useOpenAIWhisper || !supportsSpeechRecognition) {
                    await stopRecording();
                    setTimeout(() => setRecording(false), 500);
                } else if (speechRecognition) {
                    speechRecognition.stop();
                    setRecording(false);
                } else {
                    onSpeechError(new Error('not supported'));
                }
            }
        } catch (e) {
            onSpeechError(e);
        }
    }, [onSpeechError, recording, useOpenAIWhisper, openAIApiKey, message, startRecording, dispatch, stopRecording]);

    useEffect(() => {
        if (useOpenAIWhisper || !supportsSpeechRecognition) {
            if (!transcribing && !recording && transcript?.text) {
                dispatch(setMessage(initialMessage + ' ' + transcript.text));
            }
        }
    }, [initialMessage, transcript, recording, transcribing, useOpenAIWhisper, dispatch]);

    useHotkeys([
        ['n', () => document.querySelector<HTMLTextAreaElement>('#message-input')?.focus()]
    ]);

    const blur = useCallback(() => {
        document.querySelector<HTMLTextAreaElement>('#message-input')?.blur();
    }, []);

    const rightSection = useMemo(() => {
        return (
            <div style={{
                opacity: '0.8',
                paddingRight: '1.3rem',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
                marginLeft: '2.5rem',
            }}>
                {context.generating && (<>
                    <Button variant="subtle" size="compact-xs"  onClick={() => { 
                        context.chat.cancelReply(context.currentChat.chat?.id, context.currentChat.leaf!.id);
                    }}>
                        <FormattedMessage
                            id="hRCz8p"
                            defaultMessage="Cancel"
                            description="Label for the button used to cancel generation"
                        />
                    </Button>
                    <Loader size="xs" style={{ padding: '0 0.8rem 0 0.5rem' }} />
                </>)}
                {!context.generating && (
                    <>
                        {showMicrophoneButton && <Popover width={200} position="bottom" withArrow shadow="md" opened={speechError !== null}>
                            <Popover.Target>
                                <ActionIcon size="md" ml={'md'}
                                    onClick={onSpeechStart}>
                                    {transcribing && <Loader size="xs" />}
                                    {!transcribing && <i className="fa fa-microphone" style={{ fontSize: '90%', color: recording ? 'red' : 'inherit' }} />}
                                </ActionIcon>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                }}>
                                    <p style={{
                                        fontFamily: `"Work Sans", sans-serif`,
                                        fontSize: '0.9rem',
                                        textAlign: 'center',
                                        marginBottom: '0.5rem',
                                    }}>
                                        <FormattedMessage
                                            id="NiZI6p"
                                            defaultMessage="Sorry, an error occurred trying to record audio."
                                        />
                                    </p>
                                    <Button variant="light" size="xs" fullWidth onClick={onHideSpeechError}>
                                        <FormattedMessage id="rbrahO" defaultMessage="Close" />
                                    </Button>
                                </div>
                            </Popover.Dropdown>
                        </Popover>}
                        <ActionIcon size="md" ml={'0.1rem'}
                            onClick={onSubmit}>
                            <i className="fa fa-paper-plane" style={{ fontSize: '90%'}} />
                        </ActionIcon>
                    </>
                )}
            </div>
        );
    }, [context.generating, context.chat, context.currentChat.chat?.id, context.currentChat.leaf, showMicrophoneButton, speechError, onSpeechStart, transcribing, recording, onHideSpeechError, onSubmit]);

    const disabled = context.generating;

  

    const hotkeyHandler = useMemo(() => {
        const keys = [
            ['Escape', blur, { preventDefault: true }],
            ['ctrl+Enter', onSubmit, { preventDefault: true }],
        ];
        if (submitOnEnter) {
            keys.unshift(['Enter', onSubmit, { preventDefault: true }]);
        }
        const handler = getHotkeyHandler(keys as any);
        return handler;
    }, [onSubmit, blur, submitOnEnter]);
    
    const isLandingPage = pathname === '/';
    if (context.isShare || (!isLandingPage && !context.id)) {
        return null;
    }
    return <Container>
        <div className="inner">

            {/* Pico-8 Player */}
            <Pico8Player />
            <Textarea disabled={props.disabled || disabled}
                id="message-input"
                autosize
                minRows={(hasVerticalSpace || context.isHome) ? 3 : 2}
                maxRows={12}
                placeholder={intl.formatMessage({ id: 'uahKRW', defaultMessage: "Enter your fun inspirations here...", description: "Placeholder for message input" })}
                value={message}
                onChange={onChange}
                rightSection={rightSection}
                rightSectionWidth={context.generating ? 200 : 55}
                onKeyDown={hotkeyHandler} />
            <QuickSettings key={tab} />
        </div>
    </Container>;
}

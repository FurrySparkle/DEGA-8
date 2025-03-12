import styled from '@emotion/styled';
import { Button, CopyButton, Loader, Textarea } from '@mantine/core';

import { Message } from "../core/chat/types";
import { share } from '../core/utils';
import { TTSButton } from './tts-button';
import { Markdown } from './markdown';
import { useAppContext } from '../core/context';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAppSelector } from '../store';
import { selectSettingsTab } from '../store/settings-ui';
import { ThinkingSection } from './ThinkingSection';

// hide for everyone but screen readers
const SROnly = styled.span`
    position: fixed;
    left: -9999px;
    top: -9999px;
`;

const Container = styled.div`
    &.by-user {
        background: #22232b;
    }

    &.by-assistant {
        background: #292933;
    }

    &.by-assistant + &.by-assistant, &.by-user + &.by-user {
        border-top: 0.2rem dotted rgba(0, 0, 0, 0.1);
    }

    &.by-assistant {
        border-bottom: 0.2rem solid rgba(0, 0, 0, 0.1);
    }

    position: relative;
    padding: 1.618rem;

    @media (max-width: 40em) {
        padding: 1rem;
    }

    .inner {
        margin: auto;
    }

    .content {
        font-family: "Open Sans", sans-serif;
        margin-top: 0rem;
        max-width: 100%;

        * {
            color: white;
        }

        .thinking-section {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 0.5rem;
            margin-bottom: 1rem;
            
            .thinking-header {
                cursor: pointer;
                padding: 0.5rem;
                user-select: none;
                display: flex;
                align-items: center;
                font-weight: 500;
                margin: -0.5rem -0.5rem 0;
                border-radius: 8px 8px 0 0;

                &:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .chevron {
                    display: inline-block;
                    transition: transform 0.2s ease;
                    margin-right: 0.5rem;
                    width: 1rem;
                    text-align: center;

                    &.open {
                        transform: rotate(90deg);
                    }
                }
            }

            .thinking-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease-out;
                margin-top: 0;

                &.open {
                    max-height: 2000px;
                    transition: max-height 0.5s ease-in;
                }

                pre {
                    margin-top: 0.5rem !important;
                    background: rgba(0, 0, 0, 0.3) !important;
                }
            }
        }

        p, ol, ul, li, h1, h2, h3, h4, h5, h6, img, blockquote, &>pre {
            max-width: 50rem;
            margin-left: auto;
            margin-right: auto;
        }

        img {
            display: block;
            max-width: 50rem;

            @media (max-width: 50rem) {
                max-width: 100%;
            }
        }

        ol {
            counter-reset: list-item;

            li {
                counter-increment: list-item;
            }
        }

        em, i {
            font-style: italic;
        }

        code {
            &, * {
                font-family: "Fira Code", monospace !important;
            }
            vertical-align: bottom;
        }

        /* Tables */
        table {
            margin-top: 1.618rem;
            border-spacing: 0px;
            border-collapse: collapse;
            border: thin solid rgba(255, 255, 255, 0.1);
            width: 100%;
            max-width: 55rem;
            margin-left: auto;
            margin-right: auto;
        }
        td + td, th + th {
            border-left: thin solid rgba(255, 255, 255, 0.1);
        }
        tr {
            border-top: thin solid rgba(255, 255, 255, 0.1);
        }
        table td,
        table th {
            padding: 0.618rem 1rem;
        }
        th {
            font-weight: 600;
            background: rgba(255, 255, 255, 0.1);
        }
    }

    .metadata {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        font-family: "Work Sans", sans-serif;
        font-size: 0.8rem;
        font-weight: 400;
        opacity: 0.6;
        max-width: 50rem;
        margin-bottom: 0.0rem;
        margin-right: -0.5rem;
        margin-left: auto;
        margin-right: auto;

        span + span {
            margin-left: 1em;
        }

        .fa {
            font-size: 85%;
        }

        .fa + span {
            margin-left: 0.2em;

            @media (max-width: 40em) {
                display: none;
            }
        }

        .mantine-Button-root {
            color: #ccc;
            font-size: 0.8rem;
            font-weight: 400;

            .mantine-Button-label {
                display: flex;
                align-items: center;
            }
        }
    }

    .fa {
        margin-right: 0.5em;
        font-size: 85%;
    }

    .buttons {
        text-align: right;
    }

    strong {
        font-weight: bold;
    }
`;

const EndOfChatMarker = styled.div`
    position: absolute;
    bottom: calc(-1.618rem - 0.5rem);
    left: 50%;
    width: 0.5rem;
    height: 0.5rem;
    margin-left: -0.25rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
`;

const Editor = styled.div`
    max-width: 50rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0.5rem;

    .mantine-Button-root {
        margin-top: 1rem;
    }
`;

function InlineLoader() {
    return (
        <Loader variant="dots" size="xs" style={{
            marginLeft: '1rem',
            position: 'relative',
            top: '-0.2rem',
        }} />
    );
}

export default function MessageComponent(props: { message: Message, last: boolean, share?: boolean }) {
    const context = useAppContext();
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState('');
    const intl = useIntl();

    const tab = useAppSelector(selectSettingsTab);

    // Extract reasoning content if it exists
    const { reasoningContent, mainContent } = useMemo(() => {
        const match = props.message.content.match(/^<ThinkingSection content="([^"]*)"(?:\s*isThinking="([^"]*)")?\s*\/>\n\n([\s\S]*)$/);
        if (match) {
            return {
                reasoningContent: match[1],
                isThinking: match[2] === 'true',
                mainContent: match[3]
            };
        }
        return { mainContent: props.message.content };
    }, [props.message.content]);

    const getRoleName = useCallback((role: string, share = false) => {
        switch (role) {
            case 'user':
                if (share) {
                    return intl.formatMessage({ id: 'rtjBsT', defaultMessage: 'User', description: "Label that is shown above messages written by the user (as opposed to the AI) for publicly shared conversation (third person, formal)." });
                } else {
                    return intl.formatMessage({ id: 'lZVm1z', defaultMessage: 'You', description: "Label that is shown above messages written by the user (as opposed to the AI) in the user's own chat sessions (first person)." });
                }
            case 'assistant':
                return intl.formatMessage({ id: 'TYf2vK', defaultMessage: 'DEGA-8', description: "Label that is shown above messages written by the AI (as opposed to the user)" });
            case 'system':
                return intl.formatMessage({ id: '77Iskx', defaultMessage: 'System', description: "Label that is shown above messages inserted into the conversation automatically by the system (as opposed to either the user or AI)" });
            default:
                return role;
        }
    }, [intl]);

    const elem = useMemo(() => {
        if (props.message.role === 'system') {
            return null;
        }

        return (
            <Container className={"message by-" + props.message.role}>
                <div className="inner">
                    <div className="metadata">
                        <span>
                            <strong>
                                {getRoleName(props.message.role, props.share)}{props.message.model === 'gpt-4' && ' (GPT 4)'}<SROnly>:</SROnly>
                            </strong>
                            {props.message.role === 'assistant' && props.last && !props.message.done && <InlineLoader />}
                        </span>
                        <TTSButton id={props.message.id}
                            selector={'.content-' + props.message.id}
                            complete={!!props.message.done}
                            autoplay={props.last && context.chat.lastReplyID === props.message.id} />
                        <div style={{ flexGrow: 1 }} />
                        <CopyButton value={props.message.content}>
                            {({ copy, copied }) => (
                                <Button variant="subtle" size="compact-sm"  onClick={copy} style={{ marginLeft: '1rem' }}>
                                    <i className="fa fa-clipboard" />
                                        {copied ? <FormattedMessage id="ljHOzQ" defaultMessage="Copied" description="Label for copy-to-clipboard button after a successful copy" />
                                        : <span><FormattedMessage id="upBSoW" defaultMessage="Copy" description="Label for copy-to-clipboard button" /></span>}
                                </Button>
                            )}
                        </CopyButton>
                        {/* {typeof navigator.share !== 'undefined' && (   // Share API is not supported in Version 1.0 TODO: rework into a new share page with a subscription system and commenting
                            <Button variant="subtle" size="compact-sm"  onClick={() => share(props.message.content)}>
                                <i className="fa fa-share" />
                                <span>
                                    <FormattedMessage id="gzJlXS" defaultMessage="Share" description="Label for a button which shares the text of a chat message using the user device's share functionality" />
                                </span>
                            </Button>
                        )} */}
                        {!context.isShare && props.message.role === 'user' && (
                            <Button variant="subtle" size="compact-sm"  onClick={() => {
                                setContent(props.message.content);
                                setEditing(v => !v);
                            }}>
                                <i className="fa fa-edit" />
                                <span>
                                    {editing ? <FormattedMessage id="raQMIg" defaultMessage="Cancel" description="Label for a button that appears when the user is editing the text of one of their messages, to cancel without saving changes" />
                                        : <FormattedMessage id="Tgo3vj" defaultMessage="Edit" description="Label for the button the user can click to edit the text of one of their messages" />}
                                </span>
                            </Button>
                        )}
                        {!context.isShare && props.message.role === 'assistant' && (
                            <Button variant="subtle" size="compact-sm"  onClick={() => context.regenerateMessage(props.message)}>
                                <i className="fa fa-refresh" />
                                <span>
                                    <FormattedMessage id="zBmup+" defaultMessage="Regenerate" description="Label for the button used to ask the AI to regenerate one of its messages. Since message generations are stochastic, the resulting message will be different." />
                                </span>
                            </Button>
                        )}
                    </div>
                    {!editing && (
                        <div className="content content-{props.message.id}">
                            {reasoningContent && (
                                <ThinkingSection 
                                    content={reasoningContent} 
                                    isThinking={!mainContent.trim()} 
                                />
                            )}
                            <Markdown content={mainContent} />
                        </div>
                    )}
                    {editing && (
                        <Editor>
                            <Textarea value={content}
                                onChange={e => setContent(e.currentTarget.value)}
                                autosize={true} />
                            <Button variant="light" onClick={() => context.editMessage(props.message, content)}>
                                <FormattedMessage id="Bm3EKs" defaultMessage="Save changes" />
                            </Button>
                            <Button variant="subtle" onClick={() => setEditing(false)}>
                                <FormattedMessage id="raQMIg" defaultMessage="Cancel" />
                            </Button>
                        </Editor>
                    )}
                </div>
                {props.last && <EndOfChatMarker />}
            </Container>
        );
    }, [props.message, props.share, props.last, getRoleName, context, editing, content, reasoningContent, mainContent]);

    return elem;
}
'use client';

import styled from '@emotion/styled';
import Head from 'next/head';
import { FormattedMessage, useIntl } from 'react-intl';
import { spotlight, useSpotlight } from '@mantine/spotlight';
import { Burger, Button, ButtonProps, Text } from '@mantine/core';
import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../core/context';
import { backend } from '../core/backend';
import { MenuItem, secondaryMenu } from '../menus';
import { useAppDispatch, useAppSelector } from '../store';
import { setTab } from '../store/settings-ui';
import { selectSidebarOpen, toggleSidebar } from '../store/sidebar';
import { openLoginModal, openSignupModal } from '../store/ui';
import { useOption } from '../core/options/use-option';
import { useHotkeys } from '@mantine/hooks';
import { P8Injector } from './DEGA-8/CartTemplater';

const Banner = styled.div`
    background: rgba(224, 49, 49, 0.2);
    color: white;
    text-align: center;
    font-family: "Work Sans", sans-serif;
    font-size: 80%;
    padding: 0.5rem;
    cursor: pointer;
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    min-height: 2.618rem;
    background: rgba(0, 0, 0, 0.0);
    font-family: "Work Sans", sans-serif;

    &.shaded {
        background: rgba(0, 0, 0, 0.2);
    }

    h1 {
        @media (max-width: 40em) {
            width: 100%;
            order: -1;
        }

        font-family: "Work Sans", sans-serif;
        font-size: 1rem;
        line-height: 1.3;

        animation: fadein 0.5s;
        animation-fill-mode: forwards;

        strong {
            font-weight: bold;
            white-space: nowrap;
        }

        span {
            display: block;
            font-size: 70%;
            white-space: nowrap;
        }

        @keyframes fadein {
            from { opacity: 0; }
            to   { opacity: 1; }
        }
    }

    h2 {
        margin: 0 0.5rem;
        font-size: 1rem;
        white-space: nowrap;
    }

    .spacer {
        flex-grow: 1;
    }

    i {
        font-size: 90%;
    }

    i + span, .mantine-Button-root span.hide-on-mobile {
        @media (max-width: 40em) {
            position: absolute;
            left: -9999px;
            top: -9999px;
        }
    }

    .mantine-Button-root {
        @media (max-width: 40em) {
            padding: 0.5rem;
        }
    }
`;

const SubHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    font-family: "Work Sans", sans-serif;
    line-height: 1.7;
    opacity: 0.7;
    margin: 0.5rem 0.5rem 0 0.5rem;

    .spacer {
        flex-grow: 1;
    }

    a {
        color: white;
    }

    .fa + span {
        position: absolute;
        left: -9999px;
        top: -9999px;
    }
`;

function HeaderButton(props: ButtonProps & { icon?: string, onClick?: () => void, children?: React.ReactNode }) {
    return (
        <Button
            size='xs'
            variant={props.variant || 'subtle'}
            onClick={props.onClick}
        >
            {props.icon && <i className={'fa fa-' + props.icon} />}
            {props.children && <span>{props.children}</span>}
        </Button>
    );
}

export interface HeaderProps {
    title?: string;
    onShare?: () => void;
    share?: boolean;
    canShare?: boolean;
}

export default function Header(props: HeaderProps) {
    const context = useAppContext();
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [openAIApiKey] = useOption<string>('openai', 'apiKey');
    const dispatch = useAppDispatch();
    const intl = useIntl();

    const sidebarOpen = useAppSelector(selectSidebarOpen);
    const onBurgerClick = useCallback(() => dispatch(toggleSidebar()), [dispatch]);

    const burgerLabel = sidebarOpen
        ? intl.formatMessage({ id: 'HyS0qp', defaultMessage: "Close sidebar" })
        : intl.formatMessage({ id: '+G35mR', defaultMessage: "Open sidebar" });

    const onNewGame = () => {
        const DEGAtemplate: string = `\`\`\`-- dega large vertical bouncing animation
-- pico-8 version

function _init()
    -- initialize position, velocity, and color
    dega = {
        letters = {
            {char="d", x=16, y=16, dy=1, color=13}, -- purple
            {char="e", x=48, y=32, dy=1, color=12}, -- teal
            {char="g", x=80, y=48, dy=1, color=13}, -- purple
            {char="a", x=112, y=64, dy=1, color=12}  -- teal
        }
    }
end

function _update()
    -- update vertical positions and bounce
    for letter in all(dega.letters) do
        letter.y += letter.dy

        -- bounce off top and bottom
        if letter.y < 0 or letter.y > 104 then
            letter.dy = -letter.dy
        end
    end
end

function _draw()
    cls()

    -- draw each letter
    for letter in all(dega.letters) do
        draw_letter(letter)
    end
end

function draw_letter(letter)
    local x, y, c = letter.x, letter.y, letter.color

    if letter.char == "d" then
        rectfill(x, y, x+10, y+20, c)
        circfill(x+10, y+10, 10, c)
    elseif letter.char == "e" then
       rectfill(x, y, x+20, y+4, c)
        rectfill(x, y+8, x+16, y+12, c)
        rectfill(x, y+16, x+20, y+20, c)
    elseif letter.char == "g" then
        rectfill(x+4, y, x+16, y+4, c)
        rectfill(x, y+4, x+4, y+16, c)
        rectfill(x+4, y+12, x+16, y+16, c)
        rectfill(x+12, y+8, x+16, y+12, c)
        rectfill(x+8, y+8, x+12, y+10, c)
    elseif letter.char == "a" then
        rectfill(x, y+2, x+4, y+18, c) -- left bar
        rectfill(x+8, y+2, x+12, y+18, c) -- right bar
        rectfill(x, y+8, x+12, y+12, c) -- crossbar
          rectfill(x, y+1, x+12, y-2, c) -- crossbar top

    end
end\`\`\``;

        // Possible location for .p8 injection
        P8Injector(DEGAtemplate);
        console.log("P8 Injector Fired! New Chat, DEGA template Deployed!");
    };

    const onNewChat = useCallback(async () => {
        setLoading(true);
        onNewGame();
        router.push(`/`);
        setLoading(false);
        setTimeout(() => document.querySelector<HTMLTextAreaElement>('#message-input')?.focus(), 100);
    }, [router]);

    const openSettings = useCallback(() => {
        dispatch(setTab(openAIApiKey ? 'pico' : 'user'));
    }, [openAIApiKey, dispatch]);

    const signIn = useCallback(() => {
        if ((window as any).AUTH_PROVIDER !== 'local') {
            backend.current?.signIn();
        } else {
            dispatch(openLoginModal());
        }
    }, [dispatch]);

    const signUp = useCallback(() => {
        if ((window as any).AUTH_PROVIDER !== 'local') {
            backend.current?.signIn();
        } else {
            dispatch(openSignupModal());
        }
    }, [dispatch]);

    useHotkeys([
        ['c', onNewChat],
    ]);

    const header = useMemo(() => (
        <>
            {context.sessionExpired && (
                <Banner onClick={signIn}>
                    <FormattedMessage
                        id="ZN6ZQf"
                        defaultMessage="You have been signed out. Click here to sign back in."
                    />
                </Banner>
            )}
            <HeaderContainer className={context.isHome ? 'shaded' : ''}>
                <Head>
                    <title>
                        {props.title ? `${props.title} - ` : ''}
                        {intl.formatMessage({
                            id: 'ygJhU2',
                            defaultMessage: "DEGA-8",
                            description: "HTML title tag"
                        })}
                    </title>
                </Head>
                {!sidebarOpen && (
                    <Burger
                        opened={sidebarOpen}
                        onClick={onBurgerClick}
                        aria-label={burgerLabel}
                        transitionDuration={0}
                        lineSize={6}
                    />
                )}
                <h2>
                    <Text
                        variant="gradient"
                        gradient={{ from: '#1DDCB8', to: '#FF00F7', deg: 45 }}
                        ta="center"
                        fz="lg"
                        fw={700}
                    >
                        {intl.formatMessage({
                            id: 'IJZtvH',
                            defaultMessage: "DEGA-8",
                            description: "app name"
                        })}
                    </Text>
                </h2>
                <div className="spacer" />
                <HeaderButton icon="search" onClick={spotlight.open} />
                <HeaderButton icon="gear" onClick={openSettings} />
                {backend.current && !props.share && props.canShare && typeof navigator.share !== 'undefined' && (
                    <HeaderButton icon="share" onClick={props.onShare}>
                        <FormattedMessage
                            id="Bi0lS9"
                            defaultMessage="Share"
                            description="Label for the button used to create a public share URL for a chat log"
                        />
                    </HeaderButton>
                )}
                <HeaderButton icon="plus" onClick={onNewChat} loading={loading} variant="light">
                    <FormattedMessage
                        id="74eGxP"
                        defaultMessage="New Chat"
                        description="Label for the button used to start a new chat session"
                    />
                </HeaderButton>
            </HeaderContainer>
        </>
    ), [
        context.sessionExpired,
        context.isHome,
        signIn,
        props.title,
        props.share,
        props.canShare,
        props.onShare,
        intl,
        sidebarOpen,
        onBurgerClick,
        burgerLabel,
        spotlight.open,
        openSettings,
        onNewChat,
        loading
    ]);

    return header;
}

function SubHeaderMenuItem(props: { item: MenuItem }) {
    return (
        <Button
            variant="subtle"
            size="compact-lg" 
            
            component={Link}
            href={props.item.link}
            target="_blank"
            key={props.item.link}
        >
            {props.item.icon && <i className={'fa fa-' + props.item.icon} />}
            <span>{props.item.label}</span>
        </Button>
    );
}

export function SubHeader(props: any) {
    const elem = useMemo(() => (
        <SubHeaderContainer>
            <div className="spacer" />
            {secondaryMenu.map(item => (
                <SubHeaderMenuItem item={item} key={item.link} />
            ))}
        </SubHeaderContainer>
    ), []);

    return elem;
}
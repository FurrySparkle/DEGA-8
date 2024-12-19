import styled from '@emotion/styled';
import { SpotlightProvider } from '@mantine/spotlight';
import { useChatSpotlightProps } from '../spotlight';
import { LoginModal, CreateAccountModal } from './auth-modals';
import Header, { HeaderProps, SubHeader } from './header';
import MessageInput from './input';
import SettingsDrawer from './settings';
import Sidebar from './sidebar';
import AudioControls from './tts-controls';
import storage from './mockLocalStorage';
import { NextPage } from 'next/dist/types';
import exp from 'constants';


const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    overflow: hidden;

    background: #292933;
    color: white;

    .sidebar {
        width: 0%;
        height: 100%;
        background: #303038;
        flex-shrink: 0;

        @media (min-width: 40em) {
            transition: width 0.2s ease-in-out;
        }

        &.opened {
            width: 33.33%;

            @media (max-width: 40em) {
                width: 100%;
                flex-shrink: 0;
            }

            @media (min-width: 50em) {
                width: 25%;
            }

            @media (min-width: 60em) {
                width: 20%;
            }
        }
    }

    @media (max-width: 40em) {
        .sidebar.opened + div {
            display: none;
        }
    }
`;

const Main = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: scroll;

    @media (min-height: 30em) {
        overflow: hidden;
    }
`;

interface PageProps {
    id: string;
    headerProps?: HeaderProps;
    showSubHeader?: boolean;
    children: any;
}

 const Page:NextPage<PageProps> = ({ id, headerProps, showSubHeader, children }) => {
    const spotlightProps = useChatSpotlightProps();

    return <SpotlightProvider {...spotlightProps}>
        <Container>
            <Sidebar />
            <Main key={id}>
                <Header share={headerProps?.share}
                    canShare={headerProps?.canShare}
                    title={headerProps?.title}
                    onShare={headerProps?.onShare} />
                {showSubHeader && <SubHeader />}
                {children}
                <AudioControls />
                <MessageInput key={storage.getItem('openai-api-key')} />
                <SettingsDrawer />
                <LoginModal />
                <CreateAccountModal />
            </Main>
        </Container>
    </SpotlightProvider>;
}

export default Page;
import styled from '@emotion/styled';
import { Button } from '@mantine/core';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppDispatch } from '../../store';
import { openOpenAIApiKeyPanel } from '../../store/settings-ui';
import { Page } from '../pageComponent';
import { useOption } from '../../core/options/use-option';
import { isProxySupported } from '../../core/chat/openai';


const Container = styled.div`
    flex-grow: 1;
    padding-bottom: 5vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: "Work Sans", sans-serif;
    line-height: 1.7;
    gap: 1rem;
`;



export default function LandingPage(props: any) {
    const [openAIApiKey] = useOption<string>('openai', 'apiKey');
    const dispatch = useAppDispatch();
    const onConnectButtonClick = useCallback(() => dispatch(openOpenAIApiKeyPanel()), [dispatch]);

       

    return <Page id={'landing'} showSubHeader={true}>
        <Container>
            <p>
                <FormattedMessage id="f/hGIY" defaultMessage={`Hello, how can I help you today?`}
                    description="A friendly message that appears at the start of new chat sessions" />
            </p>
            {!openAIApiKey && !isProxySupported() && (
                <Button  variant="light" size="compact-xs" onClick={onConnectButtonClick}>
                    <FormattedMessage id="pPju8p" defaultMessage={`Connect your OpenAI account and Upload your pic0-8 dat file to get started`} />
                </Button>
            )}
        </Container>
    </Page>;
}

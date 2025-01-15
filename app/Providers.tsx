'use client';

import '@mantine/core/styles.css';
import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ModalsProvider } from '@mantine/modals';
import { AppContextProvider } from './src/core/context';
import store, { persistor } from './src/store/index';
import './src/index.scss';


const handleIntlError = (err: any) => {
  if (
    err.code === 'MISSING_TRANSLATION' ||
    err.message.includes("An `id` must be provided to format a message")
  ) {
    // Suppress missing translation and missing id errors
    return;
  }
  // Log other errors as usual
  throw err;
};


const Providers = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<any>(null);
  const [locale, setLocale] = useState('en-us');

  useEffect(() => {
    async function loadLocaleData(locale: string) {
      const response = await fetch(`/lang/${locale}.json`);
      if (!response.ok) {
        throw new Error('Failed to load locale data');
      }
      const messagesData: any = await response.json();
      for (const key of Object.keys(messagesData)) {
        if (typeof messagesData[key] !== 'string') {
          messagesData[key] = messagesData[key].defaultMessage;
        }
      }
      return messagesData;
    }

    const browserLocale = navigator.language || 'en-us';
    const supportedLocale = ['en-us', 'it-it'].includes(browserLocale.toLowerCase())
      ? browserLocale.toLowerCase()
      : 'en-us';

    loadLocaleData(supportedLocale)
      .then((loadedMessages) => {
        setMessages(loadedMessages);
        setLocale(supportedLocale);
      })
      .catch((e) => {
        console.warn('No locale data for', browserLocale);
        setMessages({});
      });
  }, []);

  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <React.StrictMode>
      <IntlProvider locale={locale} defaultLocale="en-us" messages={messages} onError={handleIntlError}>
        <MantineProvider  defaultColorScheme="dark">  
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ModalsProvider>
                <AppContextProvider>
                  {children}
                </AppContextProvider>
              </ModalsProvider>
            </PersistGate>
          </Provider>
        </MantineProvider>
      </IntlProvider>
    </React.StrictMode>
  );
};

export default Providers;
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/navigation";
import { useAppContext } from "./core/context";

export function useChatSpotlightProps() {
    const router = useRouter();
    const { chat } = useAppContext();
    const intl = useIntl();

    const [version, setVersion] = useState(0);

    useEffect(() => {
        const handleUpdate = () => setVersion(v => v + 1);
        chat.on('update', handleUpdate);
        return () => {
            chat.off('update', handleUpdate);
        };
    }, [chat]);

    const search = useCallback((query: string) => {
        return chat.searchChats(query)
            .map((result: any) => ({
                ...result,
                onTrigger: () => router.push(`/chat/${result.chatID}${result.messageID ? `#msg-${result.messageID}` : ''}`),
            }));
    }, [chat, router, version]);

    const props = useMemo(() => ({
        shortcut: ['/'],
        overlayColor: '#000000',
        searchPlaceholder: intl.formatMessage({ 
            id: "search.chats.placeholder",
            defaultMessage: 'Search your chats' 
        }),
        searchIcon: <i className="fa fa-search" />,
        actions: search,
        filter: (query: string, items: any[]) => items,
    }), [search, intl]);

    return props;
}
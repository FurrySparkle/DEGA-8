import { Button, FileButton } from "@mantine/core";
import { importChat } from "../../core/chat/chat-persistance";
import { Chat, serializeChat } from "../../core/chat/types";
import { useAppContext } from "../../core/context";
import SettingsOption from "./option";
import SettingsTab from "./tab";
import { useState, useCallback } from "react";
import { FormattedMessage } from "react-intl";

export default function UserOptionsTab(props: any) {
    const context = useAppContext();

    const doc = context.chat.doc;
    const getData = useCallback(async () => {
        const chats = context.chat.all() as Chat[];
        return chats.map(chat => serializeChat(chat));
    }, [context.chat]);

    const [importedChats, setImportedChats] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleExport = useCallback(async () => {
        const data = await getData();
        const json = JSON.stringify(data);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "chat-with-gpt.json";
        link.click();
    }, [getData]);

    const handleImport = useCallback(
        async (file: File) => {
            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const json = e.target?.result as string;
                    const data = JSON.parse(json) as Chat[];
                    if (data.length > 0) {
                        context.chat.doc.transact(() => {
                            for (const chat of data) {
                                try {
                                    importChat(doc, chat);
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        });
                        setImportedChats(data.length);
                        setErrorMessage(null);
                    } else {
                        setErrorMessage("The imported file does not contain any chat data.");
                    }
                };
                reader.readAsText(file);
            } catch (error) {
                setErrorMessage("Failed to import chat data.");
            }
        },
        [doc]
    );

    const successMessage = importedChats ? (
        <div style={{ color: 'green' }}>
            <i className="fa fa-check-circle"></i>
            <span style={{ marginLeft: '0.5em' }}>
                <FormattedMessage 
                    id="RvwcQ5" 
                    defaultMessage="Imported {count} chat(s)"
                    description="Success message after importing chats"
                />
            </span>
        </div>
    ) : null;

    const errorMessageElement = errorMessage ? (
        <div style={{ color: 'red' }}>
            <FormattedMessage 
                id="3z8AKW" 
                defaultMessage="Failed to import chat data." 
            />
        </div>
    ) : null;

    return (
        <SettingsTab name="user">
            <SettingsOption heading={context.intl.formatMessage({defaultMessage: "Import and Export", id: '0HTf4+'})}>
                <div>
                    <Button variant="light" onClick={handleExport} style={{
                        marginRight: '1rem',
                    }}>
                        <FormattedMessage 
                            id="SVwJTM" 
                            defaultMessage="Export" 
                        />
                    </Button>
                    <FileButton onChange={handleImport} accept=".json">
                        {(props) => <Button variant="light" {...props}>
                            <FormattedMessage 
                                id="9XUYQt" 
                                defaultMessage="Import" 
                            />
                        </Button>}
                    </FileButton>
                </div>
                {successMessage}
                {errorMessageElement}
            </SettingsOption>
        </SettingsTab>
    );
}
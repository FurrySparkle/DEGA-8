import { FormattedMessage } from "react-intl";
import { OptionGroup } from "../core/options/option-group";
import FileUploadSingle from "../components/FileUpload";



export const openAIOptions: OptionGroup = {
    id: 'openai',
    options: [
        { id: 'PicoDat',
            defaultValue: "",
            displayOnSettingsScreen: "user",
            displayAsSeparateSection: true,
            renderProps: (value, options, context) => ({  
                type: "select",
                label: context.intl.formatMessage({
                    id: '/Z/Ow+',
                    defaultMessage: "Your Pico-8 Dat File"
                }),
                placeholder: "Upload your Pico.dat file",
                description: <>
                    <p>
                        <a href="https://www.lexaloffle.com/dl/docs/pico-8_manual.html#Getting_Started" target="_blank" rel="noopener noreferrer">
                            <FormattedMessage id="lbu8Rg" defaultMessage="Find the Pico-8 Manual here." description="Label for the link that takes the user to the page on the Pico website where they can find their Dat file." />
                        </a>
                    </p>
                    <FileUploadSingle></FileUploadSingle>
                
                    <p>
                        <FormattedMessage id="r+lcWP" defaultMessage="Your Dat File is stored only on this device and never transmitted to anyone." />
                    </p>
                    <p>
                    <FormattedMessage id="lDNh0C" defaultMessage="Be aware that you must legitimately own your Dat File. <a>Click here to get more infos.</a>"
                        values={{
                            a: (chunks: any) => <a href="https://www.lexaloffle.com/pico-8.php" target="_blank" rel="noopener noreferrer">{chunks}</a>
                        }} />
                    </p>
                </>,
            }), },
        {
            id: 'apiKey',
            defaultValue: "",
            displayOnSettingsScreen: "user",
            displayAsSeparateSection: true,
            renderProps: (value, options, context) => ({
                type: "password",
                label: context.intl.formatMessage({
                    id: 'c60o5M',
                    defaultMessage: "Your OpenAI API Key"
                }),
                placeholder: "sk-************************************************",
                description: <>
                    <p>
                        <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer">
                            <FormattedMessage id="zFt1cV" defaultMessage="Find your API key here." description="Label for the link that takes the user to the page on the OpenAI website where they can find their API key." />
                        </a>
                    </p>
                    <p>
                        <FormattedMessage id="3T9nRn" defaultMessage="Your API key is stored only on this device and never transmitted to anyone except OpenAI." />
                    </p>
                    <p>
                        <FormattedMessage id="L5s+z7" defaultMessage="OpenAI API key usage is billed at a pay-as-you-go rate, separate from your ChatGPT subscription." />
                    </p>
                    <p>
                    <FormattedMessage id="hQPHf0" defaultMessage="Be aware that OpenAI's APIs have associated cost. <a>Click here to get more infos.</a>"
                        values={{
                            a: (chunks: any) => <a href="https://www.openaccessgpt.org/what-is-the-cost" target="_blank" rel="noopener noreferrer">{chunks}</a>
                        }} />
                    </p>
                </>,
            }),
        },
    ],
}
import { Mistral } from '@mistralai/mistralai';

async function askChat(apiKey, question) {
    const client = new Mistral({ apiKey: apiKey });

    const system = await (await fetch('/preprompt.txt')).text();

    const chatResponse = await client.chat.complete({
        model: 'mistral-small-latest',
        messages: [
            { role: "system", content: system },
            { role: 'user', content: question }
        ],
    });

    return chatResponse.choices[0].message.content;
}

export { askChat };

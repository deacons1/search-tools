import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPENAI_API_KEY, OPENAI_MODEL } from '$env/static/private';

function buildContextFromHistory(history: any[]) {
    if (!history || history.length === 0) return '';
    
    let context = '';
    for (let i = 0; i < history.length; i += 2) {
        if (history[i] && history[i + 1]) {
            context += `Previous Question: ${history[i].content}\n`;
            context += `Previous Answer: ${history[i + 1].content}\n\n`;
        }
    }
    return context;
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { message, context, history = [] } = await request.json();
        const conversationContext = buildContextFromHistory(history);

        const messages = [
            {
                role: 'user',
                content: `goal: answer the user's question with your knowledge along with the additional context provided

Previous conversation:
${conversationContext}

Current question: ${message}

Additional context from search results:
${context}`
            }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API error');
        }

        const data = await response.json();
        return json({ response: data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        return json({ error: 'Failed to generate response' }, { status: 500 });
    }
};
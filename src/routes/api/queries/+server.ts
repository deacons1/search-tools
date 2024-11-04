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
        const { message, history = [] } = await request.json();
        const context = buildContextFromHistory(history);
        
        const prompt = `Generate exactly 3 Google search queries to find information about this question. Include context from previous conversation when relevant.

Previous conversation context:
${context}

Format your response in this exact JSON structure:
{
    "queries": [
        "first search query here",
        "second search query here",
        "third search query here"
    ]
}

The current question is: ${message}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API error');
        }

        const data = await response.json();
        return json(JSON.parse(data.choices[0].message.content));
    } catch (error) {
        console.error('Error:', error);
        return json({ error: 'Failed to generate queries' }, { status: 500 });
    }
};
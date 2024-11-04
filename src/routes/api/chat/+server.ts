import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPENAI_API_KEY, OPENAI_MODEL, SERPER_API_KEY } from '$env/static/private';
import axios from 'axios';

async function scrapeUrl(url: string) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://scrape.serper.dev',
            headers: {
                'X-API-KEY': SERPER_API_KEY,
                'Content-Type': 'application/json'
            },
            data: { url }
        });
        return response.data;
    } catch (error) {
        console.error('Scraping error:', error);
        return null;
    }
}

async function getSearchResults(queries: string[]) {
    try {
        const searchResults = await Promise.all(queries.map(async (q) => {
            const response = await axios({
                method: 'post',
                url: 'https://google.serper.dev/search',
                headers: {
                    'X-API-KEY': SERPER_API_KEY,
                    'Content-Type': 'application/json'
                },
                data: { q }
            });
            return response.data;
        }));
        return searchResults;
    } catch (error) {
        console.error('SERPER API Error:', error);
        throw error;
    }
}

async function scrapeResults(searchResults: any[]) {
    let scrapedContent = '';
    const maxLength = 10000;
    
    // Organize results in round-robin fashion
    const organizedResults = [];
    let maxResultsPerQuery = 0;
    
    searchResults.forEach(result => {
        if (result.organic && result.organic.length > maxResultsPerQuery) {
            maxResultsPerQuery = result.organic.length;
        }
    });

    for (let i = 0; i < maxResultsPerQuery; i++) {
        for (const result of searchResults) {
            if (result.organic && result.organic[i]) {
                organizedResults.push({
                    query: result.searchParameters.q,
                    url: result.organic[i].link,
                    title: result.organic[i].title,
                    snippet: result.organic[i].snippet
                });
            }
        }
    }

    // Scrape each result until we reach 10k characters
    for (const result of organizedResults) {
        if (scrapedContent.length >= maxLength) break;

        const scraped = await scrapeUrl(result.url);
        if (scraped && scraped.text) {
            const content = `
Query: ${result.query}
URL: ${result.url}
Title: ${result.title}
Content: ${scraped.text.slice(0, 1000)}
---
`;
            scrapedContent += content;
        }
    }

    return scrapedContent.slice(0, maxLength);
}

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

async function generateSearchQueries(message: string, history: any[] = []) {
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
    return JSON.parse(data.choices[0].message.content);
}

async function generateResponse(question: string, context: string, history: any[] = []) {
    try {
        const conversationContext = buildContextFromHistory(history);
        const messages = [
            {
                role: 'user',
                content: `goal: answer the user's question with your knowledge along with the additional context provided

Previous conversation:
${conversationContext}

Current question: ${question}

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
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { message, history = [] } = await request.json();

        // Generate search queries with context
        const parsedQueries = await generateSearchQueries(message, history);
        
        // Get search results for each query
        const searchResults = await getSearchResults(parsedQueries.queries);
        
        // Scrape content from search results
        const scrapedContent = await scrapeResults(searchResults);

        // Generate final response using scraped content and conversation history
        const finalResponse = await generateResponse(message, scrapedContent, history);

        return json({ 
            response: finalResponse,
            queries: parsedQueries.queries,
            searchResults,
            scrapedContent
        });
    } catch (error) {
        console.error('Error:', error);
        return json({ error: 'Failed to process request' }, { status: 500 });
    }
};
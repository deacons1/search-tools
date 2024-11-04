import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SERPER_API_KEY } from '$env/static/private';
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

async function scrapeResults(searchResults: any[]) {
    let scrapedContent = '';
    const maxLength = 10000;
    
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

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { searchResults } = await request.json();
        const scrapedContent = await scrapeResults(searchResults);
        return json({ scrapedContent });
    } catch (error) {
        console.error('Error:', error);
        return json({ error: 'Failed to process scraping request' }, { status: 500 });
    }
};
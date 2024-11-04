import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SERPER_API_KEY } from '$env/static/private';
import axios from 'axios';

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

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { queries } = await request.json();
        const searchResults = await getSearchResults(queries);
        return json({ searchResults });
    } catch (error) {
        console.error('Error:', error);
        return json({ error: 'Failed to process search request' }, { status: 500 });
    }
};
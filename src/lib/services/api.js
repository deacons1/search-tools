export async function fetchTitle(message, history) {
    const response = await fetch('/api/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
    });
    return response.json();
}

export async function fetchQueries(message, history) {
    const response = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
    });
    return response.json();
}

export async function fetchSearchResults(queries) {
    const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queries })
    });
    return response.json();
}

export async function fetchScrapedContent(searchResults) {
    const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchResults })
    });
    return response.json();
}

export async function fetchAnswer(message, context, history) {
    const response = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, context })
    });
    return response.json();
}
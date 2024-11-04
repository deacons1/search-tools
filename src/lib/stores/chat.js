import { writable } from 'svelte/store';

function createChatStore() {
    const { subscribe, set, update } = writable({
        messages: [],
        activeTab: 'response',
        isLoading: false,
        searchResults: [],
        aiResponses: [],
        conversationHistory: [],
        searchTitle: 'New Search'
    });

    return {
        subscribe,
        reset: () => {
            set({
                messages: [],
                activeTab: 'response',
                isLoading: false,
                searchResults: [],
                aiResponses: [],
                conversationHistory: [],
                searchTitle: 'New Search'
            });
        },
        setLoading: (loading) => {
            update(state => ({ ...state, isLoading: loading }));
        },
        setActiveTab: (tab) => {
            update(state => ({ ...state, activeTab: tab }));
        },
        setSearchTitle: (title) => {
            update(state => ({ ...state, searchTitle: title }));
        },
        addMessage: (message) => {
            update(state => ({
                ...state,
                messages: [...state.messages, message]
            }));
        },
        addConversationMessage: (message) => {
            update(state => ({
                ...state,
                conversationHistory: [...state.conversationHistory, message]
            }));
        },
        setSearchResults: (results) => {
            update(state => ({ ...state, searchResults: results }));
        },
        addAIResponse: (response) => {
            update(state => ({
                ...state,
                aiResponses: [response, ...state.aiResponses]
            }));
        },
        handleError: (messageContent) => {
            const errorMessage = "I apologize, but I encountered an error processing your request. Please try again.";
            update(state => ({
                ...state,
                messages: [...state.messages, { type: 'ai', content: errorMessage }],
                aiResponses: [{ question: messageContent, response: errorMessage }, ...state.aiResponses],
                activeTab: 'response'
            }));
        }
    };
}

export const chatStore = createChatStore();
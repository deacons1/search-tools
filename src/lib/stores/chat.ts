import { writable } from 'svelte/store';
import type { Message, SearchResult, AIResponse, ConversationMessage } from '$lib/types';
import * as api from '$lib/services/api';

function createChatStore() {
    const { subscribe, set, update } = writable({
        messages: [] as Message[],
        activeTab: 'response' as 'response' | 'sources',
        isLoading: false,
        searchResults: [] as SearchResult[],
        aiResponses: [] as AIResponse[],
        conversationHistory: [] as ConversationMessage[],
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
        setLoading: (loading: boolean) => {
            update(state => ({ ...state, isLoading: loading }));
        },
        setActiveTab: (tab: 'response' | 'sources') => {
            update(state => ({ ...state, activeTab: tab }));
        },
        setSearchTitle: (title: string) => {
            update(state => ({ ...state, searchTitle: title }));
        },
        addMessage: (message: Message) => {
            update(state => ({
                ...state,
                messages: [...state.messages, message]
            }));
        },
        addConversationMessage: (message: ConversationMessage) => {
            update(state => ({
                ...state,
                conversationHistory: [...state.conversationHistory, message]
            }));
        },
        setSearchResults: (results: SearchResult[]) => {
            update(state => ({ ...state, searchResults: results }));
        },
        addAIResponse: (response: AIResponse) => {
            update(state => ({
                ...state,
                aiResponses: [response, ...state.aiResponses]
            }));
        },
        handleError: (messageContent: string) => {
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
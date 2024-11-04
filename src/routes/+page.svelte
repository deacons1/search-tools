<script>
    import Header from './Header.svelte';
    import ChatInput from '$lib/components/ChatInput.svelte';
    import ResponsePanel from '$lib/components/ResponsePanel.svelte';
    import MessageList from '$lib/components/MessageList.svelte';
    import { chatStore } from '$lib/stores/chat';
    import * as api from '$lib/services/api';

    function handleMessage(e) {
        processMessage(e.detail);
    }

    async function processMessage(messageContent) {
        chatStore.addMessage({ type: 'user', content: messageContent });
        chatStore.setLoading(true);
        chatStore.setActiveTab('response');
        
        try {
            const userMessage = { role: 'user', content: messageContent };
            chatStore.addConversationMessage(userMessage);
            
            const titleData = await api.fetchTitle(messageContent, $chatStore.conversationHistory);
            if (titleData.title) {
                chatStore.setSearchTitle(titleData.title);
            }

            const queriesData = await api.fetchQueries(messageContent, $chatStore.conversationHistory);
            
            if (queriesData.queries) {
                chatStore.addMessage({ 
                    type: 'ai', 
                    content: "I'm searching for the following:",
                    queries: queriesData.queries
                });

                const searchData = await api.fetchSearchResults(queriesData.queries);
                if (searchData.searchResults) {
                    const results = searchData.searchResults.flatMap(result => 
                        result.organic?.slice(0, 10).map(item => ({
                            title: item.title,
                            url: item.link,
                            snippet: item.snippet
                        })) || []
                    );
                    chatStore.setSearchResults(results);

                    const scrapeData = await api.fetchScrapedContent(searchData.searchResults);
                    const finalData = await api.fetchAnswer(
                        messageContent, 
                        scrapeData.scrapedContent, 
                        $chatStore.conversationHistory
                    );

                    if (finalData.response) {
                        const aiMessage = { role: 'assistant', content: finalData.response };
                        chatStore.addConversationMessage(aiMessage);
                        chatStore.addAIResponse({ 
                            question: messageContent, 
                            response: finalData.response 
                        });
                        chatStore.setActiveTab('response');
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            chatStore.handleError(messageContent);
        } finally {
            chatStore.setLoading(false);
        }
    }
</script>

<div class="min-h-screen bg-[#0D1117] text-white flex flex-col">
    <Header 
        on:newSearch={() => chatStore.reset()} 
        searchTitle={$chatStore.searchTitle} 
    />

    <div class="flex-1 grid grid-cols-2 gap-4 p-4">
        <div class="flex flex-col h-full">
            <MessageList 
                messages={$chatStore.messages}
                isLoading={$chatStore.isLoading}
            />
            <ChatInput on:submit={handleMessage} />
        </div>

        <div class="h-full">
            <ResponsePanel 
                activeTab={$chatStore.activeTab}
                aiResponses={$chatStore.aiResponses}
                searchResults={$chatStore.searchResults}
            />
        </div>
    </div>
</div>
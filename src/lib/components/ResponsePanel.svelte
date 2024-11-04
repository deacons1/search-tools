<script>
    import { marked } from 'marked';

    export let activeTab = 'response';
    export let searchResults = [];
    export let aiResponses = [];
</script>

<div class="bg-[#161B22] rounded-lg h-full">
    <div class="border-b border-[#30363D] px-4 py-2 flex items-center gap-4">
        <button 
            class="text-sm {activeTab === 'response' ? 'text-[#58A6FF]' : 'text-[#8B949E] hover:text-white'} transition-colors"
            on:click={() => activeTab = 'response'}
        >
            Response
        </button>
        <button 
            class="text-sm {activeTab === 'sources' ? 'text-[#58A6FF]' : 'text-[#8B949E] hover:text-white'} transition-colors"
            on:click={() => activeTab = 'sources'}
        >
            Sources
        </button>
    </div>
    <div class="p-6">
        {#if activeTab === 'response'}
            <div class="text-[#C9D1D9] space-y-6">
                {#if aiResponses.length === 0}
                    <p class="text-[#8B949E]">Ask me anything! I'm here to help you with your questions.</p>
                {:else}
                    {#each aiResponses as item}
                        <div class="bg-[#0D1117] rounded-lg p-6">
                            <div class="prose prose-invert max-w-none">
                                <p class="text-[#8B949E] mb-4 text-sm">{item.question}</p>
                                {@html marked(item.response, { breaks: true })}
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        {:else}
            <div class="space-y-4">
                {#each searchResults as result}
                    <div class="bg-[#0D1117] p-4 rounded-lg">
                        <a href={result.url} target="_blank" rel="noopener noreferrer" class="text-[#58A6FF] hover:underline text-sm block">{result.title}</a>
                        <span class="text-[#8B949E] text-xs">{result.url}</span>
                        {#if result.snippet}
                            <p class="text-[#C9D1D9] text-sm mt-2">{result.snippet}</p>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
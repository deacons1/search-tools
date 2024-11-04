<script>
    import { fade } from 'svelte/transition';

    export let messages = [];
    export let isLoading = false;
</script>

<div class="flex-1 overflow-y-auto">
    {#each messages as message}
        <div class="mb-6" transition:fade>
            {#if message.type === 'user'}
                <div class="bg-[#161B22] rounded-lg p-6">
                    <p class="text-sm text-white">{message.content}</p>
                </div>
            {:else}
                <div class="bg-[#161B22] rounded-lg p-6">
                    <div class="space-y-4">
                        <p class="text-sm text-gray-300">{message.content}</p>
                        {#if message.queries && message.queries.length > 0}
                            <div class="mt-6 bg-[#0D1117] rounded-lg p-4">
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="text-sm font-medium">Search Queries</h3>
                                    <button class="p-1 hover:bg-[#21262D] rounded-md transition-colors">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M18 15l-6-6-6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="space-y-2">
                                    {#each message.queries as query}
                                        <div class="flex items-center gap-2">
                                            <svg class="w-4 h-4 text-[#3FB950] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <code class="text-[#8B949E] font-mono text-sm">{query}</code>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    {/each}
    {#if isLoading}
        <div class="mb-6" transition:fade>
            <div class="bg-[#161B22] rounded-lg p-6">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-[#1F6FEB] rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-[#1F6FEB] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-[#1F6FEB] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
            </div>
        </div>
    {/if}
</div>
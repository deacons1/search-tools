<script>
    import { createEventDispatcher } from 'svelte';

    let messageInput = '';
    const dispatch = createEventDispatcher();

    function handleSubmit() {
        if (messageInput.trim()) {
            const message = messageInput;
            messageInput = '';
            dispatch('submit', message);
        }
    }
</script>

<div class="mt-4 bg-[#22272E] rounded-lg p-4">
    <div class="flex gap-2">
        <div class="flex-1">
            <input
                type="text"
                bind:value={messageInput}
                placeholder="What do you want to know today?"
                class="w-full bg-[#1C2128] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0969DA] border border-gray-800"
                on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
            />
        </div>
        <button 
            class="p-2 hover:bg-[#1C2128] rounded-md transition-colors disabled:opacity-50"
            on:click={handleSubmit}
            disabled={!messageInput.trim()}
        >
            <svg class="w-5 h-5 text-[#0969DA]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
</div>
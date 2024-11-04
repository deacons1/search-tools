<script>
    import { createEventDispatcher } from 'svelte';
    import { goto } from '$app/navigation';

    export let searchTitle = 'New Search';
    const dispatch = createEventDispatcher();
</script>

<header class="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
    <div class="flex items-center space-x-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-white">
            <path d="M13.325 3.05011L8.66741 20.4323L10.5993 20.9499L15.2568 3.56775L13.325 3.05011Z" fill="currentColor"/>
            <path d="M7.61197 18.3608L8.97136 16.9124L8.97086 16.8933L3.87657 12.1121L8.96793 7.30273L7.60854 5.85433L1.04956 12.1121L7.61197 18.3608Z" fill="currentColor"/>
            <path d="M16.388 18.3608L15.0286 16.9124L15.0291 16.8933L20.1234 12.1121L15.0321 7.30273L16.3915 5.85433L22.9504 12.1121L16.388 18.3608Z" fill="currentColor"/>
        </svg>
        <span class="text-sm font-medium">{searchTitle}</span>
    </div>
    <div class="flex items-center space-x-2">
        <button 
            class="px-3 py-1.5 text-sm bg-[#2D333B] rounded-md hover:bg-[#353B44] transition-colors flex items-center gap-2"
            on:click={() => goto('/settings')}
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM0 8a8 8 0 1116 0A8 8 0 010 8z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
                <path d="M8 5.75A2.25 2.25 0 008 10.25 2.25 2.25 0 008 5.75zM3.5 8a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
            </svg>
            Settings
        </button>
        <button 
            class="px-3 py-1.5 text-sm bg-[#0969DA] rounded-md hover:bg-[#1F7BE0] transition-colors flex items-center gap-2"
            on:click={() => dispatch('newSearch')}
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.707 13.293L13 10.586C13.63 9.536 14 8.311 14 7C14 3.14 10.859 0 7 0C3.141 0 0 3.14 0 7C0 10.86 3.141 14 7 14C8.311 14 9.536 13.63 10.586 13L13.293 15.707C14.074 16.488 15.326 16.488 16.107 15.707C16.888 14.926 16.888 13.674 15.707 13.293ZM7 12C4.239 12 2 9.761 2 7C2 4.239 4.239 2 7 2C9.761 2 12 4.239 12 7C12 9.761 9.761 12 7 12Z" fill="currentColor"/>
            </svg>
            New Search
        </button>
    </div>
</header>
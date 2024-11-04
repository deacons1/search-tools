<script lang="ts">
    import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-[#0D1117] text-white p-8">
    <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-2xl font-semibold">Settings</h1>
            <button 
                on:click={() => goto('/')}
                class="px-3 py-1.5 text-sm bg-[#2D333B] rounded-md hover:bg-[#353B44] transition-colors flex items-center gap-2"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.83 2L4 8l5.83 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Back
            </button>
        </div>

        <div class="bg-[#161B22] rounded-lg p-6 space-y-8">
            <div>
                <h2 class="text-lg font-medium mb-4">API Settings</h2>
                <div class="space-y-4">
                    <div>
                        <label for="openai-key" class="block text-sm font-medium text-[#8B949E] mb-2">OpenAI API Key</label>
                        <input
                            type="password"
                            id="openai-key"
                            class="w-full bg-[#0D1117] border border-[#30363D] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#58A6FF] focus:border-[#58A6FF]"
                            placeholder="sk-..."
                        />
                    </div>
                    <div>
                        <label for="serper-key" class="block text-sm font-medium text-[#8B949E] mb-2">Serper API Key</label>
                        <input
                            type="password"
                            id="serper-key"
                            class="w-full bg-[#0D1117] border border-[#30363D] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#58A6FF] focus:border-[#58A6FF]"
                            placeholder="Your Serper API key"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h2 class="text-lg font-medium mb-4">Model Settings</h2>
                <div class="space-y-4">
                    <div>
                        <label for="model" class="block text-sm font-medium text-[#8B949E] mb-2">OpenAI Model</label>
                        <select
                            id="model"
                            class="w-full bg-[#0D1117] border border-[#30363D] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#58A6FF] focus:border-[#58A6FF]"
                        >
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                    </div>
                    <div>
                        <label for="temperature" class="block text-sm font-medium text-[#8B949E] mb-2">Temperature</label>
                        <input
                            type="range"
                            id="temperature"
                            min="0"
                            max="1"
                            step="0.1"
                            value="0.7"
                            class="w-full"
                        />
                        <div class="flex justify-between text-xs text-[#8B949E] mt-1">
                            <span>More Focused</span>
                            <span>More Creative</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-4 flex justify-end">
                <button class="px-4 py-2 bg-[#238636] text-sm font-medium rounded-md hover:bg-[#2EA043] transition-colors">
                    Save Changes
                </button>
            </div>
        </div>
    </div>
</div>
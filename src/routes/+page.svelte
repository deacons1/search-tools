<script lang="ts">
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';

    let email = '';
    let password = '';
    let loading = false;
    let error = '';
    let isSignUp = false; // Track whether we're in signup or login mode

    onMount(() => {
        console.log('Checking existing session...');
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('Session check result:', session ? 'Session found' : 'No session');
            if (session) {
                console.log('Existing session found, redirecting to /search...');
                goto('/search');
            }
        });
    });

    const handleAuth = async () => {
        try {
            console.log(`${isSignUp ? 'Signup' : 'Login'} attempt started for email:`, email);
            loading = true;
            error = '';
            
            const { data, error: authError } = isSignUp 
                ? await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`
                    }
                })
                : await supabase.auth.signInWithPassword({
                    email,
                    password
                });

            if (authError) {
                console.error('Auth error:', authError);
                throw authError;
            }

            if (isSignUp) {
                // Show confirmation message for sign up
                error = 'Please check your email for the confirmation link.';
            } else {
                console.log('Login successful:', data);
                console.log('Redirecting to /search...');
                goto('/search');
            }
        } catch (err) {
            console.error('Auth error caught:', err);
            error = err instanceof Error ? err.message : 'An error occurred';
        } finally {
            console.log('Auth attempt completed. Loading state reset.');
            loading = false;
        }
    };

</script>

<main class="min-h-screen bg-[#0D1117] text-white flex flex-col items-center justify-center p-4">
    <div class="text-center max-w-2xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
            AI-Powered Search Assistant
        </h1>
        
        <p class="text-lg md:text-xl text-gray-300 mb-8">
            Experience intelligent search with our AI assistant. Get comprehensive answers backed by real-time web results.
        </p>

        <div class="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
            {#if error}
                <div class="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
                    {error}
                </div>
            {/if}

            <form class="space-y-4" on:submit|preventDefault={handleAuth}>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-300 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        bind:value={email}
                        class="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        required
                    />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-300 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        bind:value={password}
                        class="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        required
                    />
                </div>

                <div class="flex flex-col gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                               font-semibold transition-colors duration-200
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               focus:ring-offset-[#0D1117] disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
                    </button>

                    <button
                        type="button"
                        class="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                        on:click={() => isSignUp = !isSignUp}
                    >
                        {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </form>
        </div>
    </div>
</main>
<script lang="ts">
	import '../app.css';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Listen for auth changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_OUT') {
				goto('/');
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<slot />
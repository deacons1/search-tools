import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    'https://hetutzptcfeypuuhbeby.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldHV0enB0Y2ZleXB1dWhiZWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1OTc5ODQsImV4cCI6MjA0NjE3Mzk4NH0.MGzdfMGMsDf2HIqAs2m9VSswcWxbKFHj1JAL7WA'
);
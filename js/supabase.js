import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Replace both placeholders with values from Supabase Project Settings > API.
const SUPABASE_URL = 'https://mfyleprybkpdsqviovxm.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-NzbGRWJRsb689T_UDG-gQ_flUbGXlg';

export const isConfigured =
  !SUPABASE_URL.startsWith('YOUR_') && !SUPABASE_PUBLISHABLE_KEY.startsWith('YOUR_');

export const supabase = createClient(
  isConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co',
  isConfigured ? SUPABASE_PUBLISHABLE_KEY : 'placeholder-publishable-key',
);

export function configurationMessage() {
  return '请先在 js/supabase.js 中填写 Supabase Project URL 和 publishable key。';
}

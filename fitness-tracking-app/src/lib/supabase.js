import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://alevqdstiuiglonygzzr.supabase.co'
const supabaseKey = 'sb_publishable_soT8EL7nq-10M6USIzl7vw_6nmpn7d0'

export const supabase = createClient(supabaseUrl, supabaseKey)

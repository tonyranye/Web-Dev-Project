import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://alevqdstiuiglonygzzr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZXZxZHN0aXVpZ2xvbnlnenpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMDQ4OTIsImV4cCI6MjA5MTY4MDg5Mn0.UR8GeLzK0b3Nsw924PoaEda9zcADqVGNoc5XqqNFEWM'

export const supabase = createClient(supabaseUrl, supabaseKey)

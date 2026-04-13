import { supabase } from './src/lib/supabase.js'


async function testSupabase() {
  const { data, error } = await supabase.from('meals').select('*')

  console.log('DATA:', data)
  console.log('ERROR:', error)
}

testSupabase()

async function testConnection() {
  const { data, error } = await supabase.from('_test').select('*')
  console.log(data, error)
}

testConnection()
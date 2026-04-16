import { supabase } from '@/lib/supabase.js'

export async function ProfileService(table) {
    try {
        const {data: {user}, error: authError} = await supabase.auth.getUser()

        if(authError || !user){
            return null;
        }

        const { data, error: profileError } = await supabase
            .from(table)
            .select('*')
            .eq('user_id', user.id)
            .single()

        if(profileError){
            console.error('Error fetching profile:', profileError)
            return null;
        }

        return data;

    } catch (error) {
        console.error('Unexpected error:', error.message)
        return null;
    }
}

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl)
    const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true })

    if (error) {
        if (error.code === '42P01') { // undefined_table
            console.log('Connection successful, but table "projects" does not exist yet.')
        } else {
            console.error('Connection failed:', error.message)
        }
    } else {
        console.log('Connection successful! Projects table exists.')
    }
}

testConnection()

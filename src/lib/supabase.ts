import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Reservation {
  id: string
  reservation_code: string
  customer_name: string
  phone: string | null
  email: string | null
  date: string
  time: string
  party_size: number
  notes: string | null
  created_at: string
}

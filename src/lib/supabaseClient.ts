import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://okwkocbowyrkgucbedtt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rd2tvY2Jvd3lya2d1Y2JlZHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDEyMzIsImV4cCI6MjA1OTYxNzIzMn0.HtIRxWlb8aiiWOndx-mq7wL9gjrKbxa0bIFE5p69_ps'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

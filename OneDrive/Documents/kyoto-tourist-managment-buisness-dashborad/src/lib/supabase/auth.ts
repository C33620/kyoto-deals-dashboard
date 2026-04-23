import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Use in server components that require authentication
// Redirects to /welcome if no session found
export async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/welcome')

  return user
}

// Use when you need the user but don't want to force redirect
export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

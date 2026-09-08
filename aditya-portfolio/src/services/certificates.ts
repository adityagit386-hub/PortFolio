import { supabase } from '../lib/supabase'
import type { Certificate } from '../types/certificate'

export async function getCertificates(): Promise<Certificate[]> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('issue_date', { ascending: true, nullsFirst: true })

  if (error) throw error
  return (data as Certificate[]) ?? []
}

export async function getFeaturedCertificates(): Promise<Certificate[]> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Certificate[]) ?? []
}

export async function getCertificatesByIssuer(
  issuer: string,
): Promise<Certificate[]> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .ilike('issuer', `%${issuer}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Certificate[]) ?? []
}
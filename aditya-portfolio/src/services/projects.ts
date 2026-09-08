import { supabase } from '../lib/supabase'
import type { Project } from '../types/project'

export async function getProjects(): Promise<Project[]> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Project[]) ?? []
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Project[]) ?? []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return (data as Project | null) ?? null
}

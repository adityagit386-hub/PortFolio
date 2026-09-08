import { supabase } from '../lib/supabase'
import { personalInfo } from '../data/personal'

export async function getResumeUrl(): Promise<string> {
  if (!supabase) return personalInfo.resumeUrl

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'resume_url')
    .maybeSingle()

  if (error || !data?.value) return personalInfo.resumeUrl
  return data.value
}

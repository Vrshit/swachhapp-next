import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Report, User, Facility } from './types';

const DEFAULT_SUPABASE_URL = 'https://xvppovvptltrklbrdxhd.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_w7_fg0dSNL02bPyg33WDVA_gbLfOQh0';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim() !== '' &&
    !supabaseUrl.includes('your-project-id') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim() !== '' &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
  );
};

let clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return clientInstance;
}

/**
 * Upload base64 dataUrl (photo/audio) to Supabase Storage bucket
 */
export async function uploadEvidenceToStorage(
  dataUrl: string,
  folder: 'photos' | 'audio' | 'resolutions' = 'photos'
): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const parts = dataUrl.split(',');
    if (parts.length < 2) return null;

    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const ext = mime.includes('webm')
      ? 'webm'
      : mime.includes('wav')
      ? 'wav'
      : mime.includes('png')
      ? 'png'
      : 'jpg';

    const base64Data = parts[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mime });

    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('waste-evidence')
      .upload(fileName, blob, {
        contentType: mime,
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('waste-evidence')
      .getPublicUrl(data.path);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Failed to upload to Supabase storage:', err);
    return null;
  }
}

/**
 * Cloud Database Operations
 */
export async function fetchReportsFromSupabase(): Promise<Report[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      userName: r.user_name,
      photoDataUrl: r.photo_url || '',
      audioDataUrl: r.audio_url || undefined,
      resolvedPhotoDataUrl: r.resolved_photo_url || undefined,
      lat: r.lat,
      lng: r.lng,
      address: r.address || undefined,
      accuracy: r.accuracy || undefined,
      description: r.description,
      wasteCategory: r.waste_category,
      severity: r.severity,
      status: r.status,
      assignedTipper: r.assigned_tipper || undefined,
      etaMinutes: r.eta_minutes || undefined,
      adminNotes: r.admin_notes || undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at || undefined,
    }));
  } catch (e) {
    console.warn('Error fetching reports from Supabase:', e);
    return null;
  }
}

export async function insertReportToSupabase(report: Report): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('reports').insert([
      {
        id: report.id,
        user_id: report.userId,
        user_name: report.userName,
        photo_url: report.photoDataUrl,
        audio_url: report.audioDataUrl || null,
        resolved_photo_url: report.resolvedPhotoDataUrl || null,
        lat: report.lat,
        lng: report.lng,
        address: report.address || null,
        accuracy: report.accuracy || null,
        description: report.description,
        waste_category: report.wasteCategory,
        severity: report.severity,
        status: report.status,
        assigned_tipper: report.assignedTipper || null,
        eta_minutes: report.etaMinutes || null,
        admin_notes: report.adminNotes || null,
        created_at: report.createdAt,
      },
    ]);

    return !error;
  } catch (e) {
    console.warn('Error inserting report to Supabase:', e);
    return false;
  }
}

export async function updateReportInSupabase(
  id: string,
  status: Report['status'],
  adminNotes?: string,
  resolvedPhotoUrl?: string
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const payload: any = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (adminNotes !== undefined) payload.admin_notes = adminNotes;
    if (resolvedPhotoUrl !== undefined) payload.resolved_photo_url = resolvedPhotoUrl;

    const { error } = await supabase.from('reports').update(payload).eq('id', id);
    return !error;
  } catch (e) {
    console.warn('Error updating report in Supabase:', e);
    return false;
  }
}

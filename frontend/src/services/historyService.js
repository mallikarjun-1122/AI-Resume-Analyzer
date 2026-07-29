import { supabase } from "../lib/supabase";

const LOCAL_STORAGE_KEY = "ai_resume_analyzer_history";

function getLocalHistory() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalHistory(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving local history:", e);
  }
}

// Save Resume Analysis
export async function saveHistory(data) {
  const newItem = {
    id: data.id || `hist_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    user_id: data.user_id || "demo-user-123",
    resume_name: data.resume_name || "Resume.pdf",
    ats_score: data.ats_score || 85,
    job_match: data.job_match || 84,
    recommendation: data.recommendation || "Hire",
    overall_rating: data.overall_rating || "8.5/10",
    uploaded_at: new Date().toISOString(),
    analysis: data.analysis || {},
  };

  // Always store locally as instant backup
  const localList = getLocalHistory();
  localList.unshift(newItem);
  saveLocalHistory(localList);

  // Background non-blocking sync if Supabase is available
  try {
    supabase
      .from("resume_history")
      .insert([newItem])
      .then(() => {})
      .catch(() => {});
  } catch (e) {
    // ignore
  }

  return [newItem];
}

// Get History (returns empty [] if all items deleted)
export async function getHistory() {
  const localList = getLocalHistory();
  return localList || [];
}

// Delete History
export async function deleteHistory(id) {
  const localList = getLocalHistory().filter((item) => String(item.id) !== String(id));
  saveLocalHistory(localList);

  try {
    supabase.from("resume_history").delete().eq("id", id).then(() => {}).catch(() => {});
  } catch (err) {
    // ignore
  }
  return true;
}

// Get Single History Record
export async function getHistoryById(id) {
  const localList = getLocalHistory();
  const found = localList.find((item) => String(item.id) === String(id));
  return found || null;
}
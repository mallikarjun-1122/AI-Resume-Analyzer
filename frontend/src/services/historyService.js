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
    ats_score: data.ats_score || 0,
    job_match: data.job_match || 0,
    recommendation: data.recommendation || "Unknown",
    overall_rating: data.overall_rating || "Unknown",
    uploaded_at: new Date().toISOString(),
    analysis: data.analysis || {},
  };

  // Always store locally as backup
  const localList = getLocalHistory();
  localList.unshift(newItem);
  saveLocalHistory(localList);

  try {
    const { data: result, error } = await supabase
      .from("resume_history")
      .insert([newItem])
      .select();

    if (error) {
      console.warn("Supabase save warning (using local storage backup):", error.message);
      return [newItem];
    }
    return result;
  } catch (err) {
    console.warn("Supabase network failure (saved locally):", err.message);
    return [newItem];
  }
}

// Get All History
export async function getHistory(userId) {
  try {
    const { data, error } = await supabase
      .from("resume_history")
      .select("*")
      .eq("user_id", userId)
      .order("uploaded_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("Supabase fetch fallback to local storage:", err.message);
  }

  // Fallback to local storage
  const localList = getLocalHistory();
  return localList.filter((item) => !userId || item.user_id === userId || item.user_id === "demo-user-123");
}

// Delete History
export async function deleteHistory(id) {
  // Update local storage
  const localList = getLocalHistory().filter((item) => item.id !== id);
  saveLocalHistory(localList);

  try {
    await supabase.from("resume_history").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase delete failed (deleted locally):", err.message);
  }
  return true;
}

// Get Single History Record
export async function getHistoryById(id) {
  try {
    const { data, error } = await supabase
      .from("resume_history")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn("Supabase fetch by ID fallback to local storage:", err.message);
  }

  const localList = getLocalHistory();
  return localList.find((item) => String(item.id) === String(id)) || null;
}
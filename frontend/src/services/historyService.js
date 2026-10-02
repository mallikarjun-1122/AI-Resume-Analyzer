import { supabase } from "../lib/supabase";

function getUserKey(userIdentifier) {
  const identifier =
    userIdentifier ||
    localStorage.getItem("candidate_email") ||
    localStorage.getItem("candidate_id");
  if (!identifier) return null;
  return `ai_resume_history_${String(identifier).trim().toLowerCase()}`;
}

function getLocalHistory(userIdentifier) {
  const key = getUserKey(userIdentifier);
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalHistory(list, userIdentifier) {
  const key = getUserKey(userIdentifier);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving local history:", e);
  }
}

// Save Resume Analysis (partitioned by user)
export async function saveHistory(data, userIdentifier) {
  const currentEmail = data.user_email || localStorage.getItem("candidate_email") || "";
  const currentId = data.user_id || localStorage.getItem("candidate_id") || "usr_guest";
  const userKey = userIdentifier || currentEmail || currentId;

  const newItem = {
    id: data.id || `hist_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    user_id: currentId,
    user_email: currentEmail,
    resume_name: data.resume_name || "Resume.pdf",
    ats_score: data.ats_score ?? 0,
    job_match: data.job_match ?? 0,
    recommendation: data.recommendation ?? "Not assessed",
    overall_rating: data.overall_rating ?? "Not assessed",
    uploaded_at: new Date().toISOString(),
    analysis: data.analysis || {},
  };

  // Always store locally in user-partitioned storage
  const localList = getLocalHistory(userKey);
  localList.unshift(newItem);
  saveLocalHistory(localList, userKey);

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

// Get History for specific user (returns empty [] if user has not done any analysis)
export async function getHistory(userIdentifier) {
  const localList = getLocalHistory(userIdentifier);
  return localList || [];
}

// Delete History
export async function deleteHistory(id, userIdentifier) {
  const userKey = userIdentifier || localStorage.getItem("candidate_email") || localStorage.getItem("candidate_id");
  const localList = getLocalHistory(userKey).filter((item) => String(item.id) !== String(id));
  saveLocalHistory(localList, userKey);

  try {
    supabase.from("resume_history").delete().eq("id", id).then(() => {}).catch(() => {});
  } catch (err) {
    // ignore
  }
  return true;
}

// Get Single History Record
export async function getHistoryById(id, userIdentifier) {
  const localList = getLocalHistory(userIdentifier);
  let found = localList.find((item) => String(item.id) === String(id));
  if (!found) {
    // Search across user's history partitions if not found in current key
    const allKeys = Object.keys(localStorage).filter((k) => k.startsWith("ai_resume_history_"));
    for (const k of allKeys) {
      try {
        const items = JSON.parse(localStorage.getItem(k)) || [];
        const match = items.find((item) => String(item.id) === String(id));
        if (match) return match;
      } catch (e) {
        // ignore
      }
    }
  }
  return found || null;
}


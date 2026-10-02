import { supabase } from "../lib/supabase";

const USERS_STORAGE_KEY = "ai_resume_analyzer_users";

/**
 * Retrieve all registered users from local storage
 */
export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // Initialize with default demo account for instant testing
      const initialUsers = [
        {
          id: "usr_demo_candidate",
          email: "candidate@analyzer.ai",
          fullName: "Demo Candidate",
          password: "password123",
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(raw) || [];
  } catch (e) {
    console.error("Error reading registered users:", e);
    return [];
  }
}

/**
 * Save registered users array
 */
function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving registered users:", e);
  }
}

/**
 * Find user by email (case-insensitive)
 */
export function findUserByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  return users.find((u) => u.email && u.email.toLowerCase() === cleanEmail) || null;
}

/**
 * Register a new user
 * If email already exists, returns { success: false, code: "USER_EXISTS" }
 */
export async function registerUser({ fullName, email, password }) {
  const cleanEmail = email.trim().toLowerCase();
  const trimmedName = fullName.trim();

  // Check if account already exists in local registry
  const existing = findUserByEmail(cleanEmail);
  if (existing) {
    return {
      success: false,
      code: "USER_EXISTS",
      message: "An account with this email already exists. Please log in.",
    };
  }

  // Attempt Supabase sign up in parallel (if configured)
  try {
    const { data: suData, error: suError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: { full_name: trimmedName },
      },
    });

    if (suError && suError.message && suError.message.toLowerCase().includes("already registered")) {
      return {
        success: false,
        code: "USER_EXISTS",
        message: "An account with this email already exists in Supabase.",
      };
    }
  } catch (e) {
    // Ignore fallback errors if Supabase is placeholder
  }

  // Create new user record
  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    email: cleanEmail,
    fullName: trimmedName,
    password: password,
    createdAt: new Date().toISOString(),
  };

  const users = getRegisteredUsers();
  users.push(newUser);
  saveRegisteredUsers(users);

  return {
    success: true,
    user: newUser,
  };
}

/**
 * Log in a user
 * Checks if user exists.
 * If user does NOT exist, returns { success: false, code: "USER_NOT_FOUND" }
 * If user exists but wrong password, returns { success: false, code: "INVALID_PASSWORD" }
 * If credentials match, returns { success: true, user }
 */
export async function loginUser({ email, password }) {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Try Supabase Auth if reachable and non-placeholder
  let supabaseSuccess = false;
  let supabaseUser = null;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (!error && data?.user) {
      supabaseSuccess = true;
      const u = data.user;
      supabaseUser = {
        id: u.id,
        email: u.email,
        fullName: u.user_metadata?.full_name || u.email?.split("@")[0] || "Candidate",
      };

      // Ensure user is in local registry
      const local = findUserByEmail(cleanEmail);
      if (!local) {
        const users = getRegisteredUsers();
        users.push({
          id: u.id,
          email: cleanEmail,
          fullName: supabaseUser.fullName,
          password: password,
          createdAt: new Date().toISOString(),
        });
        saveRegisteredUsers(users);
      }

      return {
        success: true,
        user: supabaseUser,
      };
    }
  } catch (e) {
    // Continue to local registry check
  }

  // 2. Check local user registry
  const existingUser = findUserByEmail(cleanEmail);

  if (!existingUser) {
    return {
      success: false,
      code: "USER_NOT_FOUND",
      message: "No account found with this email. Please create an account.",
    };
  }

  // Check password
  if (existingUser.password !== password) {
    return {
      success: false,
      code: "INVALID_PASSWORD",
      message: "Incorrect password. Please verify your credentials and try again.",
    };
  }

  return {
    success: true,
    user: existingUser,
  };
}

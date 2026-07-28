import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

const getCandidateUser = (customEmail, customName) => {
  const email = customEmail || localStorage.getItem("candidate_email") || "candidate@analyzer.ai";
  let name = customName || localStorage.getItem("candidate_name");
  
  if (!name || name === "Pro Candidate") {
    if (email && email.includes("@")) {
      const prefix = email.split("@")[0];
      name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    } else {
      name = "Candidate";
    }
  }

  return {
    id: localStorage.getItem("candidate_id") || "demo-user-123",
    email: email,
    user_metadata: { full_name: name }
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedDemo = localStorage.getItem("demo_mode");
    return savedDemo === "true" ? getCandidateUser() : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const u = data.session.user;
          const userObj = {
            id: u.id,
            email: u.email,
            user_metadata: {
              full_name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Candidate"
            }
          };
          setUser(userObj);
          localStorage.setItem("candidate_email", u.email);
          localStorage.setItem("candidate_name", userObj.user_metadata.full_name);
        } else if (localStorage.getItem("demo_mode") === "true") {
          setUser(getCandidateUser());
        } else {
          setUser(null);
        }
      } catch (err) {
        if (localStorage.getItem("demo_mode") === "true") {
          setUser(getCandidateUser());
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getSession();

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u = session.user;
          const userObj = {
            id: u.id,
            email: u.email,
            user_metadata: {
              full_name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Candidate"
            }
          };
          setUser(userObj);
          localStorage.setItem("candidate_email", u.email);
          localStorage.setItem("candidate_name", userObj.user_metadata.full_name);
        } else if (localStorage.getItem("demo_mode") === "true") {
          setUser(getCandidateUser());
        } else {
          setUser(null);
        }
      });
      if (data?.subscription) {
        unsubscribe = () => data.subscription.unsubscribe();
      }
    } catch (e) {
      console.warn("Auth listener:", e);
    }
  }, []);

  const loginAsGuest = (customDetails = {}) => {
    localStorage.setItem("demo_mode", "true");
    if (customDetails.email) {
      localStorage.setItem("candidate_email", customDetails.email);
    }
    if (customDetails.full_name) {
      localStorage.setItem("candidate_name", customDetails.full_name);
    }
    const candidateUser = getCandidateUser(customDetails.email, customDetails.full_name);
    setUser(candidateUser);
  };

  const logout = async () => {
    localStorage.removeItem("demo_mode");
    localStorage.removeItem("candidate_email");
    localStorage.removeItem("candidate_name");
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAsGuest,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
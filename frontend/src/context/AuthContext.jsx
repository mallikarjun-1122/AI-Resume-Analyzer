import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

const getCandidateUser = (customEmail, customName) => {
  const email = customEmail || localStorage.getItem("candidate_email") || "mallikarjun@analyzer.ai";
  let name = customName || localStorage.getItem("candidate_name") || "Mallikarjun";

  return {
    id: localStorage.getItem("candidate_id") || "demo-user-123",
    email: email,
    user_metadata: { full_name: name }
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedDemo = localStorage.getItem("demo_mode");
    return savedDemo === "true" ? getCandidateUser() : getCandidateUser();
  });
  const [loading, setLoading] = useState(false);

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
              full_name: u.user_metadata?.full_name || localStorage.getItem("candidate_name") || "Mallikarjun"
            }
          };
          setUser(userObj);
          localStorage.setItem("candidate_email", u.email);
          localStorage.setItem("candidate_name", userObj.user_metadata.full_name);
        } else {
          setUser(getCandidateUser());
        }
      } catch (err) {
        setUser(getCandidateUser());
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
              full_name: u.user_metadata?.full_name || localStorage.getItem("candidate_name") || "Mallikarjun"
            }
          };
          setUser(userObj);
          localStorage.setItem("candidate_email", u.email);
          localStorage.setItem("candidate_name", userObj.user_metadata.full_name);
        } else {
          setUser(getCandidateUser());
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
    setUser(getCandidateUser("mallikarjun@analyzer.ai", "Mallikarjun"));
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
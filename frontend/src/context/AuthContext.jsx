import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

const getCandidateUser = (customEmail, customName) => {
  const email = customEmail || localStorage.getItem("candidate_email") || "";
  let name = customName || localStorage.getItem("candidate_name") || (email.includes("@") ? email.split("@")[0] : "Candidate");

  let guestId = localStorage.getItem("candidate_id");
  if (!guestId || guestId === "demo-user-123") {
    guestId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("candidate_id", guestId);
  }

  return {
    id: guestId,
    email: email,
    user_metadata: { full_name: name }
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const isAuth = localStorage.getItem("is_authenticated") === "true";
    const candidateEmail = localStorage.getItem("candidate_email");
    if (isAuth && candidateEmail) {
      return getCandidateUser(candidateEmail);
    }
    return null;
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
              full_name: u.user_metadata?.full_name || localStorage.getItem("candidate_name") || u.email?.split("@")[0] || "Candidate"
            }
          };
          setUser(userObj);
          localStorage.setItem("is_authenticated", "true");
          localStorage.setItem("candidate_email", u.email);
          localStorage.setItem("candidate_name", userObj.user_metadata.full_name);
        } else {
          const isAuth = localStorage.getItem("is_authenticated") === "true";
          const candidateEmail = localStorage.getItem("candidate_email");
          if (isAuth && candidateEmail) {
            setUser(getCandidateUser(candidateEmail));
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        const isAuth = localStorage.getItem("is_authenticated") === "true";
        const candidateEmail = localStorage.getItem("candidate_email");
        if (isAuth && candidateEmail) {
          setUser(getCandidateUser(candidateEmail));
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getSession();

    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const u = session.user;
          const userObj = {
            id: u.id,
            email: u.email,
            user_metadata: {
              full_name: u.user_metadata?.full_name || localStorage.getItem("candidate_name") || u.email?.split("@")[0] || "Candidate"
            }
          };
          setUser(userObj);
          localStorage.setItem("is_authenticated", "true");
          localStorage.setItem("candidate_email", u.email);
          localStorage.setItem("candidate_name", userObj.user_metadata.full_name);
        } else if (event === "SIGNED_OUT") {
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
    localStorage.setItem("is_authenticated", "true");
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
    localStorage.removeItem("is_authenticated");
    localStorage.removeItem("demo_mode");
    localStorage.removeItem("candidate_email");
    localStorage.removeItem("candidate_name");
    localStorage.removeItem("candidate_id");
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
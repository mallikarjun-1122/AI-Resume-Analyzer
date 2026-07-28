import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

const DEMO_USER = {
  id: "demo-user-123",
  email: "candidate@analyzer.ai",
  user_metadata: { full_name: "Pro Candidate" }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedDemo = localStorage.getItem("demo_mode");
    return savedDemo === "true" ? DEMO_USER : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setUser(data.session.user);
        } else if (localStorage.getItem("demo_mode") === "true") {
          setUser(DEMO_USER);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (localStorage.getItem("demo_mode") === "true") {
          setUser(DEMO_USER);
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
          setUser(session.user);
        } else if (localStorage.getItem("demo_mode") === "true") {
          setUser(DEMO_USER);
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

  const loginAsGuest = () => {
    localStorage.setItem("demo_mode", "true");
    setUser(DEMO_USER);
  };

  const logout = async () => {
    localStorage.removeItem("demo_mode");
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
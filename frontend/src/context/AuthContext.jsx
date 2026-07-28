import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

const DEMO_USER = {
  id: "demo-user-123",
  email: "candidate@analyzer.ai",
  user_metadata: { full_name: "Demo Candidate" }
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
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data?.session?.user) {
          setUser(data.session.user);
        } else if (localStorage.getItem("demo_mode") === "true") {
          setUser(DEMO_USER);
        }
      } catch (err) {
        console.warn("Supabase auth offline or unconfigured, defaulting to demo guest mode if enabled:", err);
        if (localStorage.getItem("demo_mode") === "true") {
          setUser(DEMO_USER);
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
      console.warn("Auth listener fallback:", e);
    }

    return () => unsubscribe();
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
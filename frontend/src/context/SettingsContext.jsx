import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");

    return saved
      ? JSON.parse(saved)
      : {
          analysis: true,
          tips: true,
          updates: true,
          marketing: false,
        };
  });

  useEffect(() => {
    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  return (
    <SettingsContext.Provider
      value={{
        notifications,
        setNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
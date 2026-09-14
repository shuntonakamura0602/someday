"use client";

import { createContext, useContext, useEffect, useState } from "react";

const NavVisibilityContext = createContext<{
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
}>({ hidden: false, setHidden: () => {} });

export function NavVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  return (
    <NavVisibilityContext.Provider value={{ hidden, setHidden }}>
      {children}
    </NavVisibilityContext.Provider>
  );
}

export function useNavVisibility() {
  return useContext(NavVisibilityContext);
}

/** Hides the global nav chrome while the calling component is mounted. */
export function useHideNav(hidden: boolean) {
  const { setHidden } = useNavVisibility();
  useEffect(() => {
    if (hidden) {
      setHidden(true);
      return () => setHidden(false);
    }
  }, [hidden, setHidden]);
}

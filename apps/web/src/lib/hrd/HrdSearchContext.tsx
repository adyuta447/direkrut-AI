"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HrdSearchContextType {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const HrdSearchContext = createContext<HrdSearchContextType | undefined>(undefined);

export function HrdSearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <HrdSearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </HrdSearchContext.Provider>
  );
}

export function useHrdSearch() {
  const context = useContext(HrdSearchContext);
  if (!context) throw new Error("useHrdSearch must be used within HrdSearchProvider");
  return context;
}

import { ReactNode } from "react";

export interface ChatActionDescriptor {
  label: string;
  kind: "candidate" | "send";
  value: string;
}

export interface ChatResponse {
  text: ReactNode;
  actions?: ChatActionDescriptor[];
}

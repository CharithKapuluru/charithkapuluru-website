import type { ReactNode } from "react";
import { ChatCenteredText } from "@phosphor-icons/react/dist/ssr";
import Callout from "./Callout";

export default function RealTalk({ children }: { children: ReactNode }) {
  return (
    <Callout tone="neutral" icon={ChatCenteredText} label="Real talk" className="italic">
      {children}
    </Callout>
  );
}

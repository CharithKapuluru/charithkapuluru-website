import type { ReactNode } from "react";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import Callout from "./Callout";

export default function DidYouKnow({ children }: { children: ReactNode }) {
  return (
    <Callout tone="success" icon={Sparkle} label="Did you know">
      {children}
    </Callout>
  );
}

import type { ReactNode } from "react";
import { Lightbulb } from "@phosphor-icons/react/dist/ssr";
import Callout from "./Callout";

export default function KeyTakeaway({ children }: { children: ReactNode; variant?: "yellow" | "blue" | "green" }) {
  return (
    <Callout tone="tip" icon={Lightbulb} label="Key takeaway">
      {children}
    </Callout>
  );
}

import type { ReactNode } from "react";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import Callout from "./Callout";

export default function WarningBox({ children }: { children: ReactNode }) {
  return (
    <Callout tone="danger" icon={Warning} label="Warning">
      {children}
    </Callout>
  );
}

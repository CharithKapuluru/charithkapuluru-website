import type { ReactNode } from "react";
import { ChatCircleText } from "@phosphor-icons/react/dist/ssr";
import Callout from "./Callout";

export default function AnalogyBox({ children }: { children: ReactNode; icon?: string }) {
  return (
    <Callout tone="info" icon={ChatCircleText} label="Think of it this way">
      {children}
    </Callout>
  );
}

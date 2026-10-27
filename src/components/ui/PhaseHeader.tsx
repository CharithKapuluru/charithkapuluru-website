import SectionHeader from "./SectionHeader";

export default function PhaseHeader({
  phaseNumber,
  title,
}: {
  phaseNumber: number | string;
  title: string;
  accentColor?: "terracotta" | "moss" | "sage" | "sand" | "olive";
}) {
  return <SectionHeader eyebrow={`Phase ${phaseNumber}`} title={title} />;
}

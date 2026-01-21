"use client";

interface DropCapProps {
  children: React.ReactNode;
  accentColor?: "terracotta" | "moss" | "sage" | "sand";
}

const DropCap = ({ children, accentColor = "moss" }: DropCapProps) => {
  const colorClasses = {
    terracotta: "text-accent-terracotta/70",
    moss: "text-accent-moss/70",
    sage: "text-accent-sage/80",
    sand: "text-accent-sand/80",
  };

  // Extract first letter and rest of content
  const text = typeof children === "string" ? children : "";
  const firstLetter = text.charAt(0);
  const restOfText = text.slice(1);

  if (!text) {
    return <p className="text-lg text-text-taupe leading-relaxed">{children}</p>;
  }

  return (
    <p className="text-lg text-text-taupe leading-relaxed mb-6">
      <span
        className={`float-left text-6xl font-serif font-bold mr-3 mt-1 leading-none ${colorClasses[accentColor]}`}
        style={{ marginBottom: "-0.1em" }}
      >
        {firstLetter}
      </span>
      {restOfText}
    </p>
  );
};

export default DropCap;

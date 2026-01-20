"use client";

interface KeyTakeawayProps {
  children: React.ReactNode;
  variant?: "yellow" | "blue" | "green";
}

const KeyTakeaway = ({ children, variant = "yellow" }: KeyTakeawayProps) => {
  const bgColors = {
    yellow: "bg-amber-50",
    blue: "bg-blue-50",
    green: "bg-emerald-50",
  };

  const borderColors = {
    yellow: "border-amber-400",
    blue: "border-blue-400",
    green: "border-emerald-400",
  };

  return (
    <div
      className={`
        ${bgColors[variant]} ${borderColors[variant]}
        border-l-4 rounded-r-lg p-5 my-8
      `}
    >
      <div className="flex gap-4">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div>
          <h4 className="font-serif font-semibold text-text-charcoal mb-2">
            Key Takeaway
          </h4>
          <p className="text-text-taupe leading-relaxed">{children}</p>
        </div>
      </div>
    </div>
  );
};

export default KeyTakeaway;

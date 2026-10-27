interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export default function ComparisonTable({ headers, rows, caption }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-small">
        {caption && <caption className="bg-surface-2 px-4 py-3 text-left font-medium text-fg">{caption}</caption>}
        <thead>
          <tr className="bg-surface-2">
            {headers.map((h, i) => (
              <th key={i} scope="col" className={i === 0 ? "sticky left-0 bg-surface-2 px-4 py-3 text-left font-medium text-fg" : "px-4 py-3 text-left font-medium text-fg"}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, r) => (
            <tr key={r} className="bg-surface">
              {row.map((cell, c) => (
                <td key={c} className={c === 0 ? "sticky left-0 bg-surface px-4 py-3 font-medium text-fg" : "px-4 py-3 text-fg-2"}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

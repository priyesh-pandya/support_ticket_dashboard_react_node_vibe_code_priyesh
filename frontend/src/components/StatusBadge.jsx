const STYLES = {
  Open: "bg-blue-100 text-blue-700 ring-blue-600/20",
  "In Progress": "bg-amber-100 text-amber-700 ring-amber-600/20",
  Resolved: "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || "bg-slate-100 text-slate-700 ring-slate-600/20";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}>
      {status}
    </span>
  );
}

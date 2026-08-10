const STYLES = {
  Low: "bg-slate-100 text-slate-600 ring-slate-500/20",
  Medium: "bg-purple-100 text-purple-700 ring-purple-600/20",
  High: "bg-rose-100 text-rose-700 ring-rose-600/20",
};

export default function PriorityBadge({ priority }) {
  const style = STYLES[priority] || "bg-slate-100 text-slate-600 ring-slate-500/20";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}>
      {priority}
    </span>
  );
}

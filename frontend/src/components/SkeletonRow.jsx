export default function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-4"><div className="h-3 w-16 rounded bg-slate-200" /></td>
      <td className="px-4 py-4"><div className="h-3 w-40 rounded bg-slate-200" /></td>
      <td className="px-4 py-4"><div className="h-5 w-16 rounded-full bg-slate-200" /></td>
      <td className="px-4 py-4"><div className="h-5 w-16 rounded-full bg-slate-200" /></td>
      <td className="px-4 py-4"><div className="h-3 w-24 rounded bg-slate-200" /></td>
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white/70 p-4">
      <div className="mb-3 h-3 w-24 rounded bg-slate-200" />
      <div className="mb-4 h-4 w-3/4 rounded bg-slate-200" />
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full bg-slate-200" />
        <div className="h-5 w-16 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

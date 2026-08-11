import { HiOutlineInbox, HiOutlineMagnifyingGlass } from "react-icons/hi2";

export default function EmptyState({ onCreate, filtered = false, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-indigo-200 bg-white/50 py-20 text-center animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
        {filtered ? <HiOutlineMagnifyingGlass size={28} /> : <HiOutlineInbox size={28} />}
      </div>
      <h3 className="text-lg font-semibold text-slate-700">
        {filtered ? "No matching tickets" : "No tickets yet"}
      </h3>
      <p className="max-w-sm text-sm text-slate-500">
        {filtered
          ? "No tickets match your current search or filters. Try adjusting them or clear everything to see all tickets."
          : "When you create a support ticket, it will show up here so you can track its status and priority."}
      </p>
      {filtered ? (
        <button
          onClick={onClearFilters}
          className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200 transition hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
        >
          Clear filters
        </button>
      ) : (
        <button
          onClick={onCreate}
          className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200 transition hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
        >
          New Support Ticket
        </button>
      )}
    </div>
  );
}

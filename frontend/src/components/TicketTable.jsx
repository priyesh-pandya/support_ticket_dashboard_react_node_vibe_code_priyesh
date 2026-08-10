import { motion } from "framer-motion";
import { HiArrowTopRightOnSquare, HiTrash } from "react-icons/hi2";
import StatusBadge from "./StatusBadge.jsx";
import PriorityBadge from "./PriorityBadge.jsx";
import SkeletonRow from "./SkeletonRow.jsx";
import { SkeletonCard } from "./SkeletonRow.jsx";
import EmptyState from "./EmptyState.jsx";
import TicketCard from "./TicketCard.jsx";

export default function TicketTable({ tickets, loading, onCreate, onDelete }) {
  if (loading) {
    return (
      <>
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-sm sm:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 sm:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </>
    );
  }

  if (!tickets.length) {
    return <EmptyState onCreate={onCreate} />;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white/70 shadow-sm sm:block scrollbar-thin">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Ticket ID</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((t, i) => (
              <motion.tr
                key={t._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="transition hover:bg-indigo-50/40"
              >
                <td className="px-4 py-3 font-medium text-slate-500">#{t._id.slice(-6).toUpperCase()}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{t.subject}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                <td className="px-4 py-3 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/tickets/${t._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-white transition hover:bg-indigo-600"
                      aria-label="View ticket details"
                    >
                      <HiArrowTopRightOnSquare size={18} />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Delete this ticket? This action cannot be undone.")) {
                          onDelete?.(t._id);
                        }
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600"
                      aria-label="Delete ticket"
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:hidden">
        {tickets.map((t) => (
          <TicketCard key={t._id} ticket={t} onDelete={onDelete} />
        ))}
      </div>
    </>
  );
}

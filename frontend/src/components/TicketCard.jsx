import { motion } from "framer-motion";
import { HiArrowTopRightOnSquare, HiTrash } from "react-icons/hi2";
import StatusBadge from "./StatusBadge.jsx";
import PriorityBadge from "./PriorityBadge.jsx";

export default function TicketCard({ ticket, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">#{ticket._id.slice(-6).toUpperCase()}</span>
        <span className="text-xs text-slate-400">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>
      <h4 className="mb-3 text-sm font-semibold text-slate-800">{ticket.subject}</h4>
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/tickets/${ticket._id}`}
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
                onDelete?.(ticket._id);
              }
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600"
            aria-label="Delete ticket"
          >
            <HiTrash size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

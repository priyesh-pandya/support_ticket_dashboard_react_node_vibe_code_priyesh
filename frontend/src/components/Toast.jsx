import { AnimatePresence, motion } from "framer-motion";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";

export default function Toast({ toasts }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-black/5 ${
              t.type === "error" ? "bg-rose-500" : "bg-emerald-500"
            }`}
          >
            {t.type === "error" ? <HiXCircle size={18} /> : <HiCheckCircle size={18} />}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

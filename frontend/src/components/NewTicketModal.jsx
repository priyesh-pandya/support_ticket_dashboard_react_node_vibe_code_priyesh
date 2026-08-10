import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiXMark } from "react-icons/hi2";

const PRIORITIES = ["Low", "Medium", "High"];

function FloatingField({ id, label, value, onChange, error, textarea }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="relative">
      <Tag
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        rows={textarea ? 3 : undefined}
        className={`peer w-full rounded-xl border bg-white/70 px-4 pb-2.5 pt-5 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-400/50 ${
          error ? "border-rose-400 focus:border-rose-400" : "border-slate-200 focus:border-indigo-400"
        } ${textarea ? "resize-none" : ""}`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-3.5 text-sm text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-indigo-500 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}

export default function NewTicketModal({ open, onClose, onSubmit, submitting }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [errors, setErrors] = useState({});

  const reset = () => {
    setSubject("");
    setDescription("");
    setPriority("Medium");
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validate = () => {
    const next = {};
    if (!subject.trim()) next.subject = "Subject is required";
    if (!description.trim()) next.description = "Description is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ subject, description, priority });
    reset();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">New Support Ticket</h2>
              <button
                onClick={handleClose}
                className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <HiXMark size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FloatingField
                id="subject"
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                error={errors.subject}
              />
              <FloatingField
                id="description"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
                textarea
              />
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Priority</label>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                        priority === p
                          ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create Ticket"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

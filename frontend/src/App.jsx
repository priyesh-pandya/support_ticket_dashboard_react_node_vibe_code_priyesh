import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import TicketTable from "./components/TicketTable.jsx";
import TicketFilters from "./components/TicketFilters.jsx";
import NewTicketModal from "./components/NewTicketModal.jsx";
import Toast from "./components/Toast.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import useTickets, { isFilterActive } from "./hooks/useTickets.js";
import { HiOutlinePlus } from "react-icons/hi2";
import { motion } from "framer-motion";

function HomePage() {
  const {
    tickets,
    loading,
    submitting,
    filters,
    updateFilters,
    resetFilters,
    addTicket,
    removeTicket,
  } = useTickets();
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const pushToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleCreate = async (payload) => {
    const result = await addTicket(payload);
    if (result.ok) {
      setModalOpen(false);
      pushToast("Ticket created successfully");
    } else {
      pushToast("Failed to create ticket", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await removeTicket(id);
    if (result.ok) {
      pushToast("Ticket deleted successfully");
    } else {
      pushToast("Failed to delete ticket", "error");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              Support Tickets
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track, prioritize, and manage every support request in one place.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
          >
            <HiOutlinePlus size={18} />
            New Support Ticket
          </button>
        </motion.div>

        <TicketFilters
          filters={filters}
          onChange={updateFilters}
          onReset={resetFilters}
          resultCount={tickets.length}
          loading={loading}
        />

        <TicketTable
          tickets={tickets}
          loading={loading}
          filtered={isFilterActive(filters)}
          onClearFilters={resetFilters}
          onCreate={() => setModalOpen(true)}
          onDelete={handleDelete}
        />
      </main>

      <NewTicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        submitting={submitting}
      />

      <Toast toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tickets/:id" element={<TicketDetail />} />
    </Routes>
  );
}
